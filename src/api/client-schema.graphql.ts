import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { mergeSchemasAsync } from '@graphql-tools/merge';
import { UrlLoader } from '@graphql-tools/url-loader';
import { buildASTSchema, isInterfaceType } from 'graphql';
import { GraphQLInterfaceType } from 'graphql/type/definition';

// eslint-disable-next-line import/no-default-export
export default async function (url: string, _config: unknown) {
  // Load server schema from url just like normal
  const serverSource = await new UrlLoader().load(url, {});
  const serverSchema = serverSource.schema!;

  // Load client-side schema from this file
  const clientSource = await new GraphQLFileLoader().load(
    __dirname + '/client-schema.graphql',
    {}
  );
  const clientSchema = buildASTSchema(clientSource.document!);

  // For all client interfaces that also exist in server schema...
  // Add the client-side fields to the server interface & all implementations
  // This will need the @client directive in gql queries but all types will be good to go!
  for (const clientInterface of Object.values(clientSchema.getTypeMap()).filter(
    isInterfaceType
  )) {
    const serverInterface = serverSchema.getType(
      clientInterface.name
    ) as GraphQLInterfaceType | null;
    if (!serverInterface) {
      continue;
    }

    const impls = serverSchema.getImplementations(clientInterface);
    const addTo = [serverInterface, ...impls.objects, ...impls.interfaces];

    const fields = clientInterface.getFields();
    for (const impl of addTo) {
      Object.assign(impl.getFields(), fields);
    }

    // Remove from client schema so that it doesn't get duplicated in merge below
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete clientSchema.getTypeMap()[clientInterface.name];
  }

  // Merge everything together here
  const schema = await mergeSchemasAsync({
    schemas: [serverSchema, clientSchema],
  });

  return schema;
}

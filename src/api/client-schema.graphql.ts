import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { mergeSchemas } from '@graphql-tools/schema';
import { UrlLoader } from '@graphql-tools/url-loader';
import { buildASTSchema, isInterfaceType } from 'graphql';
import { GraphQLInterfaceType } from 'graphql/type/definition';
import { memoize } from 'lodash';

const fromFile = async (path: string) => {
  const source = await new GraphQLFileLoader().load(path, {});
  return buildASTSchema(source[0]!.document!);
};
const fromUrl = async (url: string) => {
  const source = await new UrlLoader().load(url, {});
  return source[0]!.schema!;
};

// eslint-disable-next-line import/no-default-export
const loader = memoize(async (url: string, _config: unknown) => {
  // In CI, load server schema from API PR build if given
  const unmergedServerPath = './server_build/schema.graphql';
  let unmergedServerSchema = null;
  if (
    process.env.CI &&
    (await new GraphQLFileLoader().canLoad(unmergedServerPath, {}))
  ) {
    unmergedServerSchema = await fromFile(unmergedServerPath);
  }

  // Else load server schema from url just like normal
  const serverSchema = unmergedServerSchema ?? (await fromUrl(url));

  // Load client-side schema from this file
  const clientSchema = await fromFile(__dirname + '/client-schema.graphql');

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
  const schema = mergeSchemas({
    schemas: [serverSchema, clientSchema],
  });

  return schema;
});

// eslint-disable-next-line import/no-default-export
export default loader;

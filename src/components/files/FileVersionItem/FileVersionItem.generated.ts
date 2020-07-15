/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export type FileVersionItem_Directory_Fragment = {
  __typename?: 'Directory';
} & Pick<Types.Directory, 'id' | 'category' | 'createdAt' | 'name'> & {
    createdBy: { __typename?: 'User' } & {
      displayFirstName: { __typename?: 'SecuredString' } & Pick<
        Types.SecuredString,
        'value'
      >;
      displayLastName: { __typename?: 'SecuredString' } & Pick<
        Types.SecuredString,
        'value'
      >;
    };
  };

export type FileVersionItem_File_Fragment = { __typename?: 'File' } & Pick<
  Types.File,
  'id' | 'category' | 'createdAt' | 'name'
> & {
    createdBy: { __typename?: 'User' } & {
      displayFirstName: { __typename?: 'SecuredString' } & Pick<
        Types.SecuredString,
        'value'
      >;
      displayLastName: { __typename?: 'SecuredString' } & Pick<
        Types.SecuredString,
        'value'
      >;
    };
  };

export type FileVersionItem_FileVersion_Fragment = {
  __typename?: 'FileVersion';
} & Pick<Types.FileVersion, 'id' | 'category' | 'createdAt' | 'name'> & {
    createdBy: { __typename?: 'User' } & {
      displayFirstName: { __typename?: 'SecuredString' } & Pick<
        Types.SecuredString,
        'value'
      >;
      displayLastName: { __typename?: 'SecuredString' } & Pick<
        Types.SecuredString,
        'value'
      >;
    };
  };

export type FileVersionItemFragment =
  | FileVersionItem_Directory_Fragment
  | FileVersionItem_File_Fragment
  | FileVersionItem_FileVersion_Fragment;

export const FileVersionItemFragmentDoc = gql`
  fragment FileVersionItem on FileNode {
    id
    category
    createdAt
    createdBy {
      displayFirstName {
        value
      }
      displayLastName {
        value
      }
    }
    name
  }
`;

import { createContext } from 'react';
import { ChangesetDiffFragment } from '../../api/fragments/changeset.generated';

export const ChangesetDiffContext =
  createContext<ChangesetDiffFragment | null | undefined>(null);

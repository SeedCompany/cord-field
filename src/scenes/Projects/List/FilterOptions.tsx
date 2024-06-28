import { labelFrom } from '~/common';
import { EnumField } from '../../../components/form';

export type ProjectPreset = 'mine' | 'pinned';
export type ProjectPresetLabel = 'Mine' | 'Pinned';
const ProjectsPreset: readonly ProjectPreset[] = ['mine', 'pinned'];
const ProjectsPresetLabels: Readonly<
  Record<ProjectPreset, ProjectPresetLabel>
> = {
  mine: 'Mine',
  pinned: 'Pinned',
};
export const FilterOptions = () => {
  return (
    <EnumField
      name="filter"
      options={ProjectsPreset}
      getLabel={labelFrom(ProjectsPresetLabels)}
      defaultValue={[]}
      multiple
      variant="toggle-split"
    />
  );
};

import { FieldConfig, mapChangeList, ModifiedList, returnId, returnSelf } from '@app/core/change-engine';
import { generateObjectId } from '@app/core/util';
import { Degree } from './degree';

export class Education {
  readonly id: string;
  degree: Degree;
  major: string;
  institution: string;

  static fromJson(json: Education): Education {
    return Object.assign(new Education(), json);
  }

  static create(): Education {
    return Object.assign(new Education(), { id: generateObjectId() });
  }

  static fieldConfigList = (): FieldConfig<Education[], ModifiedEducationList> => ({
    accessor: returnId,
    toServer: mapChangeList(returnSelf, returnId),
  });
}

export type ModifiedEducationList = ModifiedList<Education, string>;

import { Language } from '@app/core/models/language';
import { maybeServerDate } from '@app/core/util';
import { DateTime } from 'luxon';
import { ExtensionStatus } from './status';
import { ExtensionType } from './type';

export { ExtensionStatus, ExtensionType };

export class ProjectExtension {
  id: string;
  status: ExtensionStatus;
  types: ExtensionType[];
  endDate: DateTime | null;
  languages: Language[];
  summary: string;
  additionalComment: string;

  static fromJson(json: any): ProjectExtension {
    const ext = new ProjectExtension();

    ext.id = json.id;
    ext.status = json.status;
    ext.types = json.types;
    ext.endDate = maybeServerDate(json.endDate);
    ext.languages = (json.languages || []).map(Language.fromJson);
    ext.summary = json.summary;
    ext.additionalComment = json.additionalComment;

    return ext;
  }

  static create(data: Partial<ProjectExtension> = {}): ProjectExtension {
    return {
      id: 'new',
      types: [],
      status: ExtensionStatus.Draft,
      endDate: null,
      languages: [],
      summary: '',
      additionalComment: '',
      ...data,
    };
  }
}

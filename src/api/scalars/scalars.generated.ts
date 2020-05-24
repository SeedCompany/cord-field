import { TypePolicies } from '@apollo/client';
import { Parsers } from './scalars.parser';

const optional = <T, R>(parser: (val: T) => R) => (
  val: T | null | undefined
): R | null => (val != null ? parser(val) : null);

export const typePolicies: TypePolicies = {
  Budget: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  BudgetRecord: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Ceremony: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Country: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Directory: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Education: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  File: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      modifiedAt: {
        read: Parsers.DateTime,
      },
    },
  },
  FileVersion: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  InternshipEngagement: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      modifiedAt: {
        read: Parsers.DateTime,
      },
    },
  },
  InternshipProject: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      modifiedAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Language: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  LanguageEngagement: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      modifiedAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Organization: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Partnership: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Product: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  ProjectMember: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      modifiedAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Region: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  SecuredDate: {
    fields: {
      value: {
        read: optional(Parsers.Date),
      },
    },
  },
  SecuredDateTime: {
    fields: {
      value: {
        read: optional(Parsers.DateTime),
      },
    },
  },
  TranslationProject: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      modifiedAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Unavailability: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      start: {
        read: Parsers.DateTime,
      },
      end: {
        read: Parsers.DateTime,
      },
    },
  },
  User: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Zone: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
};

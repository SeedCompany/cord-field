import { buildEnum } from '@app/core/models/enum';

export enum ProductPurpose {
  Evangelism = 'evangelism',
  ChurchPlanting = 'church_planting',
  ChurchLife = 'church_life',
  ChurchMaturity = 'church_maturity',
  Discipleship = 'discipleship',
  SocialIssues = 'social_issues',
}

export namespace ProductPurpose {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProductPurpose, {
    [ProductPurpose.Evangelism]: 'Evangelism',
    [ProductPurpose.ChurchPlanting]: 'Church Planting',
    [ProductPurpose.ChurchLife]: 'Church Life',
    [ProductPurpose.ChurchMaturity]: 'Church Maturity',
    [ProductPurpose.Discipleship]: 'Discipleship',
    [ProductPurpose.SocialIssues]: 'Social Issues',
  });
}

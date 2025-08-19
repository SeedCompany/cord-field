import { Nil } from '@seedcompany/common';

export * from './EthnoArt';
export * from './Film';
export * from './Language';
export * from './Location';
export * from './Organization';
export * from './Project';
export * from './Story';
export * from './Tool';
export * from './User';
export * from './Partner';
export * from './FundingAccount';
export * from './FieldRegion';
export * from './FieldZone';

export const getLookupId = (ref: { id: string } | Nil) => (ref ? ref.id : ref);

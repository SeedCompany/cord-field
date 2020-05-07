import React from 'react';
import { LanguageEngagementListItemCard as LELIC } from './LanguageEngagementListItemCard';

export default { title: 'Components' };

export const LanguageEngagementListItemCard = () => (
  <LELIC
    id="123123"
    createdAt="12/20/20"
    status="Active"
    ceremony={{ value: { type: 'Certification' } }}
    completeDate={{ value: '12/20/20' }}
    disbursementCompleteDate={{ value: '12/20/20' }}
    communicationsCompleteDate={{ value: '12/20/20' }}
    startDate={{ value: '12/20/20' }}
    endDate={{ value: '12/20/20' }}
    initialEndDate={{ value: '12/20/20' }}
    lastSuspendedAt={{ value: '12/20/20' }}
    lastReactivatedAt={{ value: '12/20/20' }}
    statusModifiedAt={{ value: '12/20/20' }}
    modifiedAt="12/20/20"
    language={{ value: { name: { value: 'asdfasd' } } }}
    firstScripture={{ value: true }}
    lukePartnership={{ value: true }}
    sentPrintingDate={{ value: '12/20/20' }}
    products={{ total: 0, items: [{ type: 'NewTestamentFull' }] }}
  />
);

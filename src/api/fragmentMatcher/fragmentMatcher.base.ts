export const possibleTypes = {
  Product: ['.+Product'],
  Engagement: ['.+Engagement'],
  Project: ['.+Project'],
  Secured: ['Secured.+'],
  PaginatedList: ['.+ListOutput', 'Secured.+List'],
} as const;

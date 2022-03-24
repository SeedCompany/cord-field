import { NetworkStatus } from '@apollo/client/core/networkStatus';

/** Copied from @apollo/client */
export const isNetworkRequestInFlight = (networkStatus?: NetworkStatus) =>
  networkStatus ? networkStatus < 7 : false;

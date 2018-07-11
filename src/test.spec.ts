import { AuthenticationToken } from './app/core/models/authentication-token';
import { AuthenticationStorageService } from './app/core/services/authentication-storage.service';
import './app/rxjs-imports';

export async function saveTestCredentials(storageService: AuthenticationStorageService, remember = false): Promise<void> {

  // tslint:disable:max-line-length
  const tokens = AuthenticationToken.fromTokenMap({
    /**
     * These tokens are good through 5/2/2118 @ 2:11 GMT - make sure you update them before then or your tests will fail.
     * It's more likely that the private key for the development environments will have changed before then. That too
     * will cause your tests to fail. If the private key is updated, resign these tokens at jwt.io with the
     * test private key (never use a production key on a third-party site), and paste the new values back here.
     */
    token: {
      'plo.cord.bible': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcnNvbl9mdWxsQHRzY28ub3JnIiwiZG9tYWluIjoiZmllbGQiLCJkZm4iOiJDYXJzb24iLCJkbG4iOiJGdWxsIiwiaWQiOiI1YjQ1YWFmMDAwMDAwMDAwMDAwMDAwMDAiLCJpYXQiOjE1MjUyMjQ1NjAsImV4cCI6NDY4MDkwMDY2MCwiYXVkIjoicGxvLmNvcmQuYmlibGUiLCJpc3MiOiJwbG8uY29yZC5iaWJsZSIsImp0aSI6IjkwYzY1MzY3LWMzNzEtNDRlMS04OWU0LWJlY2EwNTEzODI0YSJ9.1ICvzmt0ylH-uc-589txB-nY7Xoy2vjWzhYtFIfFmRM'
    }
  });
  // tslint:enable:max-line-length
  return storageService.saveTokens(tokens, remember);
}

export async function removeTestCredentials(storageService: AuthenticationStorageService): Promise<void> {
  return storageService.clearTokens();
}

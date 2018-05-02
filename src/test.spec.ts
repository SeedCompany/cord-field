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
    'token': {
      'profile.illuminations.bible': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpwQG9saXZldGVjaC5jb20iLCJkb21haW4iOiJmaWVsZCIsImZpcnN0TmFtZSI6IkouUC4iLCJsYXN0TmFtZSI6IlBvdmVkYSIsImlkIjoiNWFlNzkwNzhlNGE2YjMwMDAxYzNlMTM2IiwiaXNzU2lnIjoiZDU3NTJhM2JjODlmNjk1NTYyZjk3MzA0MDgwZGMzOGYxNTc1MTI2NGUzNWI1YWJmYzZkNjExNjI5MjNhYzNiMSIsImlhdCI6MTUyNTIyNDU2MCwiZXhwIjo0NjgwOTAwNzA0LCJhdWQiOiJwcm9maWxlLmlsbHVtaW5hdGlvbnMuYmlibGUiLCJpc3MiOiJwcm9maWxlLmlsbHVtaW5hdGlvbnMuYmlibGUiLCJqdGkiOiI5MGM2NTM2Ny1jMzcxLTQ0ZTEtODllNC1iZWNhMDUxMzgyNGEifQ.wksQwMpIshUYm9u-95Rw19P6hyQLTpmVvvQgRbeQGAA',
      'plo.cord.bible': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpwQG9saXZldGVjaC5jb20iLCJkb21haW4iOiJmaWVsZCIsImZpcnN0TmFtZSI6IkouUC4iLCJsYXN0TmFtZSI6IlBvdmVkYSIsImlkIjoiNWFlNzkwNzhlNGE2YjMwMDAxYzNlMTM2IiwiaXNzU2lnIjoiZDU3NTJhM2JjODlmNjk1NTYyZjk3MzA0MDgwZGMzOGYxNTc1MTI2NGUzNWI1YWJmYzZkNjExNjI5MjNhYzNiMSIsImlhdCI6MTUyNTIyNDU2MCwiZXhwIjo0NjgwOTAwNjYwLCJhdWQiOiJwbG8uY29yZC5iaWJsZSIsImlzcyI6InByb2ZpbGUuaWxsdW1pbmF0aW9ucy5iaWJsZSIsImp0aSI6IjkwYzY1MzY3LWMzNzEtNDRlMS04OWU0LWJlY2EwNTEzODI0YSJ9.WfJCRsn_A50pNpAz-_pYaha4Xor498JWDtI04kTiU7E'
    }
  });
  // tslint:enable:max-line-length
  return storageService.saveTokens(tokens, remember);
}

export async function removeTestCredentials(storageService: AuthenticationStorageService): Promise<void> {
  return storageService.clearTokens();
}

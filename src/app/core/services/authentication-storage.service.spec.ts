import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from '../core.module';
import { AuthenticationToken } from '../models/authentication-token';
import { AUTH_STORAGE_KEY, AuthenticationStorageService } from './authentication-storage.service';
import { LocalStorageService, SessionStorageService } from './storage.service';

let authStoreService: AuthenticationStorageService;
let localStore: LocalStorageService;
let sessionStore: SessionStorageService;
let httpMockService: HttpTestingController;

describe('AuthenticationStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ]
    });
    authStoreService = TestBed.get(AuthenticationStorageService);
    localStore = TestBed.get(LocalStorageService);
    sessionStore = TestBed.get(SessionStorageService);
    httpMockService = TestBed.get(HttpTestingController);
  });

  describe('authentication tokens', () => {

    it('should store the tokens in local storage', (done) => {

      const mockToken = {
        'token': {
          'profile.illuminations.bible': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdvd3RoYW1Ab2xpdmV0' +
          'ZWNoLm5ldCIsImRvbWFpbiI6ImZpZWxkIiwiZmlyc3ROYW1lIjoiR293dGhhbSIsImxhc3ROYW1lIjoiUm9kZGEiLCJpZCI6IjVhY' +
          '2I0NjNkY2YwYmRjMDc4MjgzMGJjNSIsImlzc1NpZyI6IjYzNjJkZjQxNzM2MTE1YzE1YTUwMDUzZDQyM2RlYzQwOTRhYzQzZjFiODR' +
          'lNjUwM2QxNTIxM2UyNzcwMGZhZWQiLCJpYXQiOjE1MjMyNzI0MzIsImV4cCI6MTUyMzQ0NTIzMiwiYXVkIjoicHJvZmlsZS5pbGx1b' +
          'WluYXRpb25zLmJpYmxlIiwiaXNzIjoicHJvZmlsZS5pbGx1bWluYXRpb25zLmJpYmxlIiwianRpIjoiOTI1OWM5NzAtZjk1YS00Y2V' +
          'lLTgyN2QtMzMwYjEwY2JlNTk0In0.6qYGuESle_M1oGpQ1HrbqH4gzEkK96e5r7tvT26cFP4'
        }
      };
      const mockAuthToken: AuthenticationToken[] = AuthenticationToken.fromTokenMap(mockToken);

      authStoreService
        .saveTokens(mockAuthToken, true)
        .then(async () => {
          const tokens = await localStore.getItem<AuthenticationToken[]>(AUTH_STORAGE_KEY);
          console.log('stored tokens are', tokens);
          expect(tokens.length).toBe(1);
          expect(tokens[0].issuer).toBe('profile.illuminations.bible');
          done();
        })
        .catch(done.fail);
    });

    it('should get tokens', () => {

    });

    it('should clear the tokens', () => {

    });
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { saveTestCredentials } from '../../../test.spec';
import { CoreModule } from '../core.module';
import { AuthenticationToken } from '../models/authentication-token';
import { AUTH_STORAGE_KEY, AuthenticationStorageService } from './authentication-storage.service';
import { LocalStorageService } from './storage.service';

describe('AuthenticationStorageService', () => {

  let authStoreService: AuthenticationStorageService;
  let localStore: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule,
      ],
    });
    authStoreService = TestBed.get(AuthenticationStorageService);
    localStore = TestBed.get(LocalStorageService);
  });

  it('should be created', inject([AuthenticationStorageService], (service: AuthenticationStorageService) => {
    expect(service).toBeTruthy();
  }));

  describe('authentication tokens', () => {

    afterEach(async () => {
      await authStoreService.clearTokens();
    });

    it('should store tokens', (done: DoneFn) => {
      saveTestCredentials(authStoreService, true)
        .then(async () => {
          const tokens = (await localStore.getItem<AuthenticationToken[]>(AUTH_STORAGE_KEY))!;
          expect(tokens.length).toBe(1);
          expect(tokens[0].issuer).toBe('plo.cord.bible');
          done();
        })
        .catch(done.fail);
    });

    it('should get tokens', async (done: DoneFn) => {
      try {
        await saveTestCredentials(authStoreService, true);
        const tokens = (await authStoreService.getAuthenticationTokens())!;
        expect(tokens.length).toEqual(1);
        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('should clear the tokens', async (done: DoneFn) => {
      try {
        await saveTestCredentials(authStoreService, true);
        await authStoreService.clearTokens();
        const tokens = await authStoreService.getAuthenticationTokens();
        expect(tokens).toBe(null);
        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });
});

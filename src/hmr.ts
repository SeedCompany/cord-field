import { ApplicationRef, NgModuleRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';

export const hmrBootstrap = (module: any, bootstrap: () => Promise<NgModuleRef<any>>) => {
  let ngModule: NgModuleRef<any>;
  module.hot.accept();
  bootstrap().then(mod => ngModule = mod);
  module.hot.dispose(() => {
    const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
    const elements = appRef.components.map(c => c.location.nativeElement);
    const makeVisible = createNewHosts(elements);
    ngModule.destroy();

    // Hack to remove old overlay components
    // https://github.com/angular/material2/issues/749
    const overlays = document.querySelectorAll('.cdk-overlay-container, .cdk-visually-hidden');
    for (let i = 0; i < overlays.length; i++) {
      overlays[i].remove();
    }

    makeVisible();
  });

  // Group up and collapse HMR updated modules, Try to filter out other noise.
  // On Chrome, you can put `-HMR -WDS` in console log filter to filter out all the messages.
  const origLog = window.console.log;
  let grouping = false;
  window.console.log = function() {
    if (arguments.length === 1 && typeof arguments[0] === 'string') {
      if (arguments[0] === '[HMR] Updated modules:') {
        // tslint:disable-next-line:no-console
        console.groupCollapsed('[HMR] Updated modules');
        grouping = true;
        return;
      } else if (arguments[0] === '[HMR] App is up to date.') {
        grouping = false;
        // tslint:disable-next-line:no-console
        console.groupEnd();
      } else if (arguments[0] === 'Angular is running in the development mode. Call enableProdMode() to enable the production mode.') {
        return;
      } else if (arguments[0].match(/^\[(HMR|WDS)\].+\.\.\.$/)) {
        return;
      }
      if (grouping) {
        origLog.call(window.console, arguments[0].substr(9));
        return;
      }
    }

    origLog.apply(window.console, arguments);
  };
};

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
};

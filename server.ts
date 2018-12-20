// These are important and needed before anything else
import 'zone.js/dist/zone-node';
// tslint:disable-next-line:ordered-imports
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as express from 'express';
import { join } from 'path';

// Faster server renders w/ prod mode (dev mode never needed)
enableProdMode();

const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// Leave this as require() since this file is built dynamically with webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
  ],
}));
app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y',
}));

app.get('*', (req, res) => {
  res.render('index', {req});
});

app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';

export interface SsrServerOptions {
  browserDistFolder: string;
  defaultPort: number;
  importMetaUrl: string;
}

export function createSsrServer(options: SsrServerOptions) {
  const { browserDistFolder, defaultPort, importMetaUrl } = options;

  const app = express();
  const angularApp = new AngularNodeAppEngine();

  app.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
      redirect: false,
    }),
  );

  app.use((req, res, next) => {
    angularApp
      .handle(req)
      .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
      .catch(next);
  });

  if (isMainModule(importMetaUrl) || process.env['pm_id']) {
    const port = process.env['PORT'] || defaultPort;
    app.listen(port, (error) => {
      if (error) throw error;
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  }

  return { app, reqHandler: createNodeRequestHandler(app) };
}

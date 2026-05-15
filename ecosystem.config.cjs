module.exports = {
  apps: [
    {
      name: 'main',
      script: 'apps/main/dist/main/server/server.mjs',
      env: {
        PORT: 4000,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'models',
      script: 'apps/models/dist/models/server/server.mjs',
      env: {
        PORT: 4201,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'studio',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: 'apps/studio',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
  ],
};

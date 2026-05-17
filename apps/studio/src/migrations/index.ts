import * as migration_20260517_150325_init from './20260517_150325_init';

export const migrations = [
  {
    up: migration_20260517_150325_init.up,
    down: migration_20260517_150325_init.down,
    name: '20260517_150325_init',
  },
];

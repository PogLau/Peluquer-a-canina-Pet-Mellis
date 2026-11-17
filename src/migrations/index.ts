import * as migration_20261117_000634_inicial from './20261117_000634_inicial';

export const migrations = [
  {
    up: migration_20261117_000634_inicial.up,
    down: migration_20261117_000634_inicial.down,
    name: '20261117_000634_inicial'
  },
];

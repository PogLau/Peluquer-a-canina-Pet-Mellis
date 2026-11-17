import * as migration_20261117_000634_inicial from './20261117_000634_inicial';
import * as migration_20261117_120000_enlace_tutor from './20261117_120000_enlace_tutor';

export const migrations = [
  {
    up: migration_20261117_000634_inicial.up,
    down: migration_20261117_000634_inicial.down,
    name: '20261117_000634_inicial'
  },
  {
    up: migration_20261117_120000_enlace_tutor.up,
    down: migration_20261117_120000_enlace_tutor.down,
    name: '20261117_120000_enlace_tutor'
  },
];

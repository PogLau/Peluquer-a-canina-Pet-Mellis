import * as migration_20261117_000634_inicial from './20261117_000634_inicial';
import * as migration_20261117_120000_enlace_tutor from './20261117_120000_enlace_tutor';
import * as migration_20261117_150000_escaneo_turno from './20261117_150000_escaneo_turno';

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
  {
    up: migration_20261117_150000_escaneo_turno.up,
    down: migration_20261117_150000_escaneo_turno.down,
    name: '20261117_150000_escaneo_turno'
  },
];

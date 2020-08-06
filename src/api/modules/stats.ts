import Deps from '../../utils/deps';
import Logs from '../../data/logs';
import { LogDocument } from '../../data/models/log';

const distinct = (v, i, a) => a.indexOf(v) === i;

export default class Stats {
  private savedLogs: LogDocument[] = [];

  get modules(): ModuleStats[] {
    const moduleNames = this.savedLogs
      .flatMap(l => l.changes.map(c => c.module));

    return moduleNames
      .filter(distinct)
      .map(name => ({ name, count: moduleNames.filter(m => m === name).length }))
      .sort((a, b) => b.count - a.count);
  }

  get inputs(): InputStats[] {
      const paths = this.savedLogs
        .flatMap(l => l.changes.map(c =>
          Object.keys(c.changes.new)
          .map((key) => `${c.module}.${key}`)))
        .flat();
      
      return paths
        .filter(distinct)
        .map(path => ({
          path,
          count: paths.filter(p => p === path).length }))
        .sort((a, b) => b.count - a.count);
  }

  constructor(private logs = Deps.get<Logs>(Logs)) {}

  async init() {
    this.savedLogs = await this.logs.getAll();
  }
}

export interface ModuleStats {
  name: string;
  count: number;
}

export interface InputStats {
  path: string;
  count: number;
}
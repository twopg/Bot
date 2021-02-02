import Deps from '../../utils/deps';
import Logs from '../../data/logs';
import { LogDocument } from '../../data/models/log';


const distinct = (v, i, a) => a.indexOf(v) === i;

export default class Stats {
  private savedLogs: LogDocument[] = [];
  private initialized = false;

  private _commands: CommandStats[];
  private _general: GeneralStats;
  private _inputs: InputStats[];
  private _modules: ModuleStats[];

  get commands(): CommandStats[] {
    if (this.initialized)
      return this._commands;
    
    const names = this.savedLogs
      .flatMap(l => l.commands
        .flatMap(c => c.name));
    
    return names
      .filter(distinct)
      .map(name => ({ name, count: names.filter(n => n === name).length }))
      .sort((a, b) => b.count - a.count);
  }

  get general(): GeneralStats {
    if (this.initialized)
      return this._general;

    const commandsExecuted = this.savedLogs
      .reduce((a, b) => a + b.commands.length, 0);
    
    return {
      commandsExecuted,
      inputsChanged: this.inputs
        .reduce((a, b) => a + b.count, 0),
      inputsCount: this.inputs
        .map(c => c.path)
        .filter(distinct).length,
      iq: 10
    }
  }

  get inputs(): InputStats[] {
    if (this.initialized)
      return this._inputs;
    
    const paths = this.savedLogs
      .flatMap(l => l.changes
        .flatMap(c => Object.keys(c.changes.new)
          .flatMap(key => `${c.module}.${key}`)));
    
    return paths
      .filter(distinct)
      .map(path => ({ path, count: paths.filter(p => p === path).length }))
      .sort((a, b) => b.count - a.count);
  }

  get modules(): ModuleStats[] {
    if (this.initialized)
      return this._modules;

    const moduleNames = this.savedLogs
      .flatMap(l => l.changes.map(c => c.module));

    return moduleNames
      .filter(distinct)
      .map(name => ({ name, count: moduleNames.filter(m => m === name).length }))
      .sort((a, b) => b.count - a.count);
  }

  constructor(private logs = Deps.get<Logs>(Logs)) {}

  async init() {
    await this.updateValues();

    const interval = 30 * 60 * 1000;
    setInterval(() => this.updateValues(), interval);
  }

  async updateValues() {
    this.savedLogs = await this.logs.getAll();

    this.initialized = false;

    this._commands = this.commands;
    this._general = this.general;
    this._inputs = this.inputs;
    this._modules = this.modules;

    this.initialized = true;
  }
}

export interface CommandStats {
  name: string;
  count: number;
}

export interface GeneralStats {
  commandsExecuted: number;
  inputsCount: number;
  inputsChanged: number;
  iq: number;
}

export interface InputStats {
  path: string;
  count: number;
}

export interface ModuleStats {
  name: string;
  count: number;
}
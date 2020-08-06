import { LogDocument, SavedLog } from '../../src/data/models/log';
import Stats from '../../src/api/modules/stats';
import Logs from '../../src/data/logs';
import { mock } from 'ts-mockito';
import { expect } from 'chai';

describe('api/modules/stats', () => {
  let savedLog: LogDocument;
  let stats: Stats;

  beforeEach(async() => {
    let logs = mock<Logs>();
    logs.getAll = (): any => [savedLog];

    savedLog = new SavedLog();
    stats = new Stats(logs);
    
    savedLog.changes.push(
      {
        module: 'general',
        at: new Date(),
        by: '',
        changes: { old: { prefix: '/' }, new: { prefix: '.' } }
      },
      {
        module: 'general',
        at: new Date(),
        by: '',
        changes: { old: { prefix: '/' }, new: { prefix: '.' } }
      }, 
      {
        module: 'xp',
        at: new Date(),
        by: '',
        changes: { old: { xpPerMessage: 50 }, new: { xpPerMessage: 100 } }
      }
    );

    savedLog.commands.push(
      { name: 'ping', by: '', at: new Date() },
      { name: 'ping', by: '', at: new Date() },
      { name: 'dashboard', by: '', at: new Date() }
    );

    await stats.init();
  });

  it('get commands, returns correct count', () => {
    const result = stats.commands[0].count;

    expect(result).to.equal(2);
  });

  it('get commands, returns correct sorted item', () => {
    const result = stats.commands[0].name;

    expect(result).to.equal('ping');
  });

  it('get inputs, returns correct count', () => {
    const result = stats.inputs[0].count;

    expect(result).to.equal(2);
  });

  it('get inputs, returns correct sorted item', () => {
    const result = stats.inputs[0].path;

    expect(result).to.equal('general.prefix');
  });

  it('get modules, returns correct count', () => {
    const result = stats.modules[0].count;

    expect(result).to.equal(2);
  });

  it('get modules, returns correct sorted item', () => {
    const result = stats.modules[0].name;

    expect(result).to.equal('general');
  });
});
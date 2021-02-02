import { promisify } from 'util';
import { resolve } from 'path';
import { exec } from 'child_process';
import fs from 'fs';

const appendFile = promisify(fs.appendFile);

export class ErrorLogger {
  private logsPath = resolve('./logs');
  private sessionDate = new Date()
    .toISOString()
    .replace(/:/g, '');

  private get timestamp() {
    return new Date().toISOString();
  }

  constructor() {
    exec(`
      mkdir -p
      ${this.logsPath}/logs/dashboard
      ${this.logsPath}/logs/api`.trim()
    );
  }

  async dashboard(message: string) {
    await appendFile(
      `${this.logsPath}/dashboard/${this.sessionDate}.log`,
      `[${this.timestamp}] ${message}\n`
    );
  }

  async api(status: number, message: string, route: string) {
    await appendFile(
      `${this.logsPath}/api/${this.sessionDate}.log`,
      `[${this.timestamp}] [${status}] [${route}] ${message}\n`
    );
  }
}

import { config } from 'dotenv';
config({ path: '.env' });

const env = new Map<string, (value: string) => any>();

env.set('API_URL', (value: string) => {
  if (value.endsWith('/'))
    throw new TypeError(`API URL should not end with a '/'`);
  if (!value.endsWith('/api'))
    throw new TypeError(`API URL should end with a '/api'`);
  if (!value.startsWith('http'))
    throw new TypeError(`API URL should start with 'http'`);
});

env.set('DASHBOARD_URL', (value: string) => {
  if (value.endsWith('/'))
    throw new TypeError(`Dashboard URL should not end with a '/'`);
  if (!value.startsWith('http'))
    throw new TypeError(`Dashboard URL should start with 'http'`);
});

env.set('CLIENT_ID', (value: string) => {  
  if (!value)
    throw new TypeError('Client ID should not be empty');

  const pattern = /\d{18}/;
  if (!pattern.test(value))
    throw new TypeError('Client ID does not match snowflake ID format');
});

export function validateEnv() {
  for (const key in process.env)
    if (env.has(key)) {
      try {
        env.get(key)(process.env[key]);
      } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', `${key} is not setup correctly.`);
        console.log('\x1b[36m%s\x1b[0m', `Setup guide: https://help.codea.live/projects/2pg/setup/config`);

        throw error;
      }
    }
}

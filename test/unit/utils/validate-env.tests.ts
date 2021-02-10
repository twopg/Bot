import { expect } from 'chai';
import { validateEnv } from '../../../src/utils/validate-env';

describe('utils/validate-env', () => {
  const ogEnv = { ...process.env };

  beforeEach(() => {
    process.env = ogEnv;
  })

  it('CLIENT_ID is not defined, error thrown', async () => {
    process.env.CLIENT_ID = undefined;

    expect(validateEnv).to.throw();
  });

  it('CLIENT_ID is not 18 digits, error thrown', async () => {
    process.env.CLIENT_ID = 'testing_123';

    expect(validateEnv).to.throw();
  });

  it('CLIENT_ID is 18 digits, accepted', async () => {
    process.env.CLIENT_ID = '012345678901234567';    

    expect(validateEnv).to.not.throw();
  });

  it('API_URL ends with /, error thrown', async () => {
    process.env.API_URL = '.../';    

    expect(validateEnv).to.throw();
  });

  it('API_URL does not start with http, error thrown', async () => {
    process.env.API_URL = '2pg.xyz';    

    expect(validateEnv).to.throw();
  });

  it('API_URL does not end with /api, error thrown', async () => {
    process.env.API_URL = 'https://2pg.xyz';    

    expect(validateEnv).to.throw();
  });

  it('API_URL valid, accepted', async () => {
    process.env.API_URL = 'https://2pg.xyz/api';    

    expect(validateEnv).to.not.throw();
  });

  it('DASHBOARD_URL ends with /, error thrown', async () => {
    process.env.DASHBOARD_URL = '.../';    

    expect(validateEnv).to.throw();
  });

  it('DASHBOARD_URL does not start with http, error thrown', async () => {
    process.env.DASHBOARD_URL = '2pg.xyz';    

    expect(validateEnv).to.throw();
  });

  it('DASHBOARD_URL valid, accepted', async () => {
    process.env.DASHBOARD_URL = 'https://2pg.xyz';    

    expect(validateEnv).to.not.throw();
  });
});

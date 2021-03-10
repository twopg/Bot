import { config } from 'dotenv';
config({ path: 'test/.env' });

import { use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiSpies from 'chai-spies';
import { connect } from 'mongoose';

use(chaiAsPromised);
use(chaiSpies);

connect(process.env.MONGO_URI, { 
  useUnifiedTopology: true, 
  useNewUrlParser: true, 
  useFindAndModify: false 
});

(async() => {
  // await import('./integration/auto-mod.tests');
  await import('./integration/users.tests');
  await import('./integration/user-warn.tests');

  await import('./unit/utils/validate-env.tests');
})();

import { expect } from 'chai';
import { SavedUser, UserDocument } from '../../src/data/models/user';
import Users from '../../src/data/users';

describe('data/users', () => {
  let users: Users;
  let user: UserDocument;

  beforeEach(async () => {
    users = new Users();

    await SavedUser.deleteMany({});
    user = await SavedUser.create({ _id: 'test_user_123' });
  });

  afterEach(async () => {
    await SavedUser.deleteMany({});
  });

  it('give plus, user now has premium', async () => {
    await users.givePlus(user.id, '1_month');

    user = await SavedUser.findById('test_user_123');

    expect(user.premium).to.be.true;
  });

  it('give plus, 1 month, adds 1 month to expiration', async () => {
    await users.givePlus(user.id, '1_month');

    user = await SavedUser.findById('test_user_123');
    const difference = user.premiumExpiration.getTime() - new Date().getTime();
    const days = difference / 1000 / 60 / 60 / 24;

    expect(Math.round(days)).to.equal(30);
  });

  it('give plus, 3 month, adds 3 month to expiration', async () => {
    await users.givePlus(user.id, '3_month');

    user = await SavedUser.findById('test_user_123');
    const difference = user.premiumExpiration.getTime() - new Date().getTime();
    const days = difference / 1000 / 60 / 60 / 24;

    expect(Math.round(days)).to.equal(90);
  });

  it('give plus, 1 year, adds 1 year to expiration', async () => {
    await users.givePlus(user.id, '1_year');

    user = await SavedUser.findById('test_user_123');
    const thisYear = new Date().getFullYear();
    const year = user.premiumExpiration.getFullYear();

    expect(year).to.be.greaterThan(thisYear);
  });
});

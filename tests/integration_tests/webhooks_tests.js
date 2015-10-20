import TrelloConnector from '../../src/connector';
import config from 'config';
import {
  expect
}
from 'chai';
describe.skip("webhook API", () => {
  let _connector;
  before(() => {
    _connector = new TrelloConnector({
      apiKey: config.get('apiKey'),
      apiSecret: config.get('apiSecret'),
      appName: 'Hoist unit test app'
    });
    let authorization = {
      get: (key) => {
        return config.get(key);
      }
    }
    _connector.authorize(authorization);
  });
  describe('can create a webhook', () => {
    let _result;
    before(() => {
      return _connector.post('/1/webhooks', {
          description: 'a test webhook for hoist',
          callbackURL: 'https://endpoint.hoi.io/test_endpoint',
          idModel: '52e578bee2c5cd8a7bebb365'
        })
        .then((result) => {
          _result = result;
        });
    });
    it('should return a list of lists', () => {
      return expect(_result.length).to.be.greaterThan(1);
    });
  });
});

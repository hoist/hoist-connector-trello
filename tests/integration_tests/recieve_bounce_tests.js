import TrelloConnector from '../../src/connector';
import config from 'config';
import sinon from 'sinon';
import {
  expect
}
from 'chai';
describe('receiveBounce', () => {
  let _connector;
  before(() => {
    _connector = new TrelloConnector({
      apiKey: config.get('apiKey'),
      apiSecret: config.get('apiSecret'),
      appName: 'Hoist unit test app'
    });
  });
  describe('on first call', () => {
    let bounce;
    before(function () {
      bounce = {
        store: {},
        get: function (key) {
          return this.store[key];
        },
        delete: function (key) {
          delete this.store[key];
          return Promise.resolve(null);
        },
        set: function (key, value) {
          this.store[key] = value;
          return Promise.resolve(null);
        },
        redirect: function () {
          console.log('redirect', arguments);
          return Promise.resolve(null);
        },
        done: function () {
          console.log('done', arguments);
          return Promise.resolve(null);
        }
      };

      sinon.spy(bounce, 'redirect');
      return _connector.receiveBounce(bounce);
    });
    it('should redirect', () => {
      return expect(bounce.redirect)
        .to.have.been.calledWith(`https://trello.com/1/connect?key=${config.get('apiKey')}&name=Hoist%20unit%20test%20app&response_type=token&scope=read,write&expiration=never&return_url=https%3A%2F%2Fbouncer.hoist.test%2Fbounce`)
    });
  });
});

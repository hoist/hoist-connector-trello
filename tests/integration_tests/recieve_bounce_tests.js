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
        .to.have.been.calledWith(`https://trello.com/1/OAuthAuthorizeToken?name=Hoist%20unit%20test%20app&oauth_token=${bounce.store['RequestToken']}`)
    });
    it('should store access token', () => {
      return expect(bounce.store['RequestToken']).to.exist;
    });
    it('should store access token secret', () => {
      console.log(bounce.store);
      return expect(bounce.store['RequestTokenSecret']).to.exist;
    });
    it('should record step', () => {
      return expect(bounce.store['currentStep']).to.eql('RequestToken');
    });
  });
  describe.skip('on second call', () => {
    let bounce;
    before(function () {
      bounce = {
        store: {
          currentStep: 'RequestToken',
          RequestToken: config.get('requestToken'),
          RequestTokenSecret: config.get('requestTokenSecret')
        },
        query: {
          oauth_verifier: config.get('oauthVerifier')
        },
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
      sinon.spy(bounce, 'done');
      return _connector.receiveBounce(bounce);
    });
    it('should call done', () => {
      return expect(bounce.done).to.have.been.called;
    });
    it('should store access token', () => {
      return expect(bounce.store['AccessToken']).to.exist;
    });
    it('should store access token secret', () => {
      console.log(bounce.store);
      return expect(bounce.store['AccessTokenSecret']).to.exist;
    });
    it('should record step', () => {
      return expect(bounce.store['currentStep']).to.eql('AccessToken');
    });
  });
});

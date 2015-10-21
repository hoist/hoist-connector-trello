import TrelloConnector from '../../src/connector';
import config from 'config';
import {
  expect
}
from 'chai';
describe("trello API", () => {
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
  describe('get boards', () => {
    let _result;
    before(() => {
      return _connector.get('/1/members/me/boards')
        .then((result) => {
          _result = result;
        });
    });
    it('should return a list of boards', () => {
      return expect(_result.length).to.be.greaterThan(1);
    });
  });
  describe('create a board', () => {
    let _result;
    before(() => {
      return _connector.post('/1/boards', {
          name: 'a test board from Hoist unit tests'
        })
        .then((result) => {
          _result = result;
        });
    });
    it('should return a list of lists', () => {
      return expect(_result.id).to.exist;
    });
    after(() => {
      return _connector.put(`/1/boards/${_result.id}/closed`, {
        value: true
      });
    })
  });

});

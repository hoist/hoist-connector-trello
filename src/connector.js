import logger from '@hoist/logger';
import config from 'config';
import Trello from 'node-trello';
import Bluebird from 'bluebird';
import url from 'url';
import {
  OAuthConnectorBase
}
from '@hoist/oauth-connector';
import {
  merge
}
from 'lodash';

let overrides = {
  requestTokenUri: 'https://trello.com/1/OAuthGetRequestToken',
  accessTokenUri: 'https://trello.com/1/OAuthGetAccessToken',
  authorizationUri: 'https://trello.com/1/OAuthAuthorizeToken',
  oauthVersion: '1.0'
}
let baseUri = {
  protocol: 'https',
  hostname: 'api.trello.com'
}

/*
 * The main class for connecting to Trello
 * @extends {OAuthConnectorBase}
 */
export default class TrelloConnector extends OAuthConnectorBase {

  /**
   * create a new TrelloConnector
   * @param {object} configuration - the configuration details for this connector
   * @param {string} configuration.apiKey - the trello API Key
   * @param {string} configuration.apiSecret - the trello API secret
   * @param {string} configuration.appName - the application name as it should show up to the user in Trello
   */
  constructor(configuration) {
    overrides.authorizationUri = `${overrides.authorizationUri}?name=${configuration.appName}&expiration=never&scope=read,write`
    configuration.consumerKey = configuration.apiKey;
    configuration.consumerSecret = configuration.apiSecret;
    super(merge({}, configuration, overrides));
    this._logger = logger.child({
      cls: TrelloConnector
    });
  }


  get(path, urlArguments) {
    var uri = merge({}, {
      pathname: path,
      query: urlArguments
    }, baseUri);
    return this._performRequest('GET', url.format(uri), {}).then((result) => {
      return JSON.parse(result[0]);
    });
  }
  post(path, body) {
    var uri = merge({}, {
      pathname: path
    }, baseUri);
    return this._performRequest('POST', url.format(uri), body || {}).then((result) => {
      return JSON.parse(result[0]);
    });
  }
  put(path, body) {
    var uri = merge({}, {
      pathname: path
    }, baseUri);
    return this._performRequest('PUT', url.format(uri), body || {}).then((result) => {
      return JSON.parse(result[0]);
    });
  }
  delete(path) {
    var uri = merge({}, {
      pathname: path
    }, baseUri);
    return this._performRequest('DELETE', url.format(uri)).then((result) => {
      return JSON.parse(result[0]);
    });
  }
}

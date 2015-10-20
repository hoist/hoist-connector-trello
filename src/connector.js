import logger from '@hoist/logger';
import config from 'config';
import Trello from 'node-trello';
import Bluebird from 'bluebird';
/*
 * The main class for connecting to Trello
 * @implements {ConnectorInterface}
 */
export default class TrelloConnector {

  /**
   * create a new TrelloConnector
   * @param {object} configuration - the configuration details for this connector
   * @param {string} configuration.apiKey - the trello API Key
   * @param {string} configuration.apiSecret - the trello API secret
   * @param {string} configuration.appName - the application name as it should show up to the user in Trello
   */
  constructor(configuration) {
    this._logger = logger.child({
      cls: TrelloConnector
    })
    this._configuration = configuration;
  }

  /**
   * @param {AuthorizationStore} authorization - the users authorization
   */
  receiveBounce(authorization) {
    let authStep = authorization.get('currentStep')
    switch (authStep) {
    case 'bouncing':
      this._logger.info('returned from trello');
      return Promise.all([
          authorization.set('authToken', authorization.query.token),
          authorization.set('currentStep', 'done')
        ])
        .then(() => {
          return authorization.done();
        });
      break;
    default:
      this._logger.info('redirecting user to trello');
      return authorization.set('currentStep', 'bouncing')
        .then(() => {
          return authorization.redirect(`https://trello.com/1/connect?key=${this._configuration.apiKey}&name=${encodeURIComponent(this._configuration.appName)}&response_type=token&scope=read,write&expiration=never&return_url=${encodeURIComponent('https://'+config.get('Hoist.domains.bouncer')+'/bounce')}`)
        });
    }
  }

  /**
   * authorize the oauth connection with existing parameters
   * @param {<AuthorizationStore>} authorization - the users authorization
   */
  authorize(authorization) {
    this._authToken = authorization.get('authToken');
    this._trello = new Trello(this._configuration.apiKey, this._authToken);
    Bluebird.promisifyAll(this._trello);
  }

  get(url, urlArguments) {
    return this._trello.getAsync(url, urlArguments || {});
  }
  post(url, body) {
    return this._trello.postAsync(url, body || {});
  }
  put(url, body) {
    return this._trello.putAsync(url, body || {});
  }
  delete(url) {
    return this._trello.deleteAsync(url);
  }
}

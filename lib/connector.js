'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _hoistLogger = require('@hoist/logger');

var _hoistLogger2 = _interopRequireDefault(_hoistLogger);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _nodeTrello = require('node-trello');

var _nodeTrello2 = _interopRequireDefault(_nodeTrello);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

/*
 * The main class for connecting to Trello
 * @implements {ConnectorInterface}
 */

var TrelloConnector = (function () {

  /**
   * create a new TrelloConnector
   * @param {object} configuration - the configuration details for this connector
   * @param {string} configuration.apiKey - the trello API Key
   * @param {string} configuration.apiSecret - the trello API secret
   * @param {string} configuration.appName - the application name as it should show up to the user in Trello
   */

  function TrelloConnector(configuration) {
    _classCallCheck(this, TrelloConnector);

    this._logger = _hoistLogger2['default'].child({
      cls: TrelloConnector
    });
    this._configuration = configuration;
  }

  /**
   * @param {AuthorizationStore} authorization - the users authorization
   */

  _createClass(TrelloConnector, [{
    key: 'receiveBounce',
    value: function receiveBounce(authorization) {
      var _this = this;

      var authStep = authorization.get('currentStep');
      switch (authStep) {
        case 'bouncing':
          this._logger.info('returned from trello');
          return Promise.all([authorization.set('authToken', authorization.query.token), authorization.set('currentStep', 'done')]).then(function () {
            return authorization.done();
          });
          break;
        default:
          this._logger.info('redirecting user to trello');
          return authorization.set('currentStep', 'bouncing').then(function () {
            return authorization.redirect('https://trello.com/1/connect?key=' + _this._configuration.apiKey + '&name=' + encodeURIComponent(_this._configuration.appName) + '&response_type=token&scope=read,write&expiration=never&return_url=' + encodeURIComponent('https://' + _config2['default'].get('Hoist.domains.bouncer') + '/bounce'));
          });
      }
    }

    /**
     * authorize the oauth connection with existing parameters
     * @param {<AuthorizationStore>} authorization - the users authorization
     */
  }, {
    key: 'authorize',
    value: function authorize(authorization) {
      this._authToken = authorization.get('authToken');
      this._trello = new _nodeTrello2['default'](this._configuration.apiKey, this._authToken);
      _bluebird2['default'].promisifyAll(this._trello);
    }
  }, {
    key: 'get',
    value: function get(url, urlArguments) {
      return this._trello.getAsync(url, urlArguments || {});
    }
  }, {
    key: 'post',
    value: function post(url, body) {
      return this._trello.postAsync(url, body || {});
    }
  }, {
    key: 'put',
    value: function put(url, body) {
      return this._trello.putAsync(url, body || {});
    }
  }, {
    key: 'delete',
    value: function _delete(url) {
      return this._trello.deleteAsync(url);
    }
  }]);

  return TrelloConnector;
})();

exports['default'] = TrelloConnector;
module.exports = exports['default'];
//# sourceMappingURL=connector.js.map

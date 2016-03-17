'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('@hoist/logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _nodeTrello = require('node-trello');

var _nodeTrello2 = _interopRequireDefault(_nodeTrello);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _oauthConnector = require('@hoist/oauth-connector');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var overrides = {
  requestTokenUri: 'https://trello.com/1/OAuthGetRequestToken',
  accessTokenUri: 'https://trello.com/1/OAuthGetAccessToken',
  authorizationUri: 'https://trello.com/1/OAuthAuthorizeToken',
  oauthVersion: '1.0'
};
var baseUri = {
  protocol: 'https',
  hostname: 'api.trello.com'
};

/*
 * The main class for connecting to Trello
 * @extends {OAuthConnectorBase}
 */

var TrelloConnector = function (_OAuthConnectorBase) {
  _inherits(TrelloConnector, _OAuthConnectorBase);

  /**
   * create a new TrelloConnector
   * @param {object} configuration - the configuration details for this connector
   * @param {string} configuration.apiKey - the trello API Key
   * @param {string} configuration.apiSecret - the trello API secret
   * @param {string} configuration.appName - the application name as it should show up to the user in Trello
   */

  function TrelloConnector(configuration) {
    _classCallCheck(this, TrelloConnector);

    configuration.consumerKey = configuration.apiKey;
    configuration.consumerSecret = configuration.apiSecret;

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TrelloConnector).call(this, (0, _lodash.merge)({}, configuration, overrides)));

    _this._logger = _logger2.default.child({
      cls: TrelloConnector
    });
    return _this;
  }

  _createClass(TrelloConnector, [{
    key: '_setupAuthorizationQuery',
    value: function _setupAuthorizationQuery(query) {
      query.name = this._configuration.appName;
      query.expiration = "never";
      query.scope = "read,write";
      return query;
    }
  }, {
    key: 'get',
    value: function get(path, urlArguments) {
      var uri = (0, _lodash.merge)({}, {
        pathname: path,
        query: urlArguments
      }, baseUri);
      return this._performRequest('GET', _url2.default.format(uri), {}).then(function (result) {
        return JSON.parse(result);
      });
    }
  }, {
    key: 'post',
    value: function post(path, body) {
      var uri = (0, _lodash.merge)({}, {
        pathname: path
      }, baseUri);
      return this._performRequest('POST', _url2.default.format(uri), body || {}).then(function (result) {
        return JSON.parse(result);
      });
    }
  }, {
    key: 'put',
    value: function put(path, body) {
      var uri = (0, _lodash.merge)({}, {
        pathname: path
      }, baseUri);
      return this._performRequest('PUT', _url2.default.format(uri), body || {}).then(function (result) {
        return JSON.parse(result);
      });
    }
  }, {
    key: 'delete',
    value: function _delete(path) {
      var uri = (0, _lodash.merge)({}, {
        pathname: path
      }, baseUri);
      return this._performRequest('DELETE', _url2.default.format(uri)).then(function (result) {
        return JSON.parse(result);
      });
    }
  }]);

  return TrelloConnector;
}(_oauthConnector.OAuthConnectorBase);

exports.default = TrelloConnector;
//# sourceMappingURL=connector.js.map

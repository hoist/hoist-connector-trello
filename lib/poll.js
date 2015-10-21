'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _connector = require('./connector');

var _connector2 = _interopRequireDefault(_connector);

var _hoistLogger = require('@hoist/logger');

var _hoistLogger2 = _interopRequireDefault(_hoistLogger);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _hoistErrors = require('@hoist/errors');

var _hoistErrors2 = _interopRequireDefault(_hoistErrors);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var ConnectorRequiresAuthorizationError = _hoistErrors2['default'].create({
  name: 'ConnectorRequiresAuthorizationError'
});

var TrelloPoller = (function () {
  function TrelloPoller(context) {
    _classCallCheck(this, TrelloPoller);

    this._logger = _hoistLogger2['default'].child({
      cls: this.constructor.name,
      subscription: context.subscription._id,
      application: context.application._id
    });
    this._context = context;
    this._connector = new _connector2['default'](context.settings);
  }

  _createClass(TrelloPoller, [{
    key: 'poll',
    value: function poll() {
      var _this = this;

      return this.assertCanPoll().then(function (hooksSetup) {
        if (!hooksSetup) {
          return _this.setupHook();
        }
      })['catch'](function (err) {
        _this._logger.error(err);
        if (!(err instanceof ConnectorRequiresAuthorizationError)) {
          _this._logger.alert(err);
        }
      });
    }
  }, {
    key: 'assertCanPoll',
    value: function assertCanPoll() {
      var _this2 = this;

      var hooksSetup = this._context.subscription.get('setup');
      return Promise.resolve().then(function () {
        if (hooksSetup) {
          //we've already setup this subscription
          _this2._context.subscription.delayTill(new _moment2['default']().add(100, 'days').toDate());
        }
      }).then(function () {
        _this2._logger.info('checking credentials');
        if (!_this2._context.authorization) {
          _this2._logger.warn('Connector needs auth and no auth set');
          //we've already setup this subscription
          _this2._context.subscription.delayTill(new _moment2['default']().add(1, 'hour').toDate());
          throw new ConnectorRequiresAuthorizationError();
        }
        if (!_this2._context.authorization.get('SubscriptionModelId')) {
          _this2._logger.warn('Connector needs a subscription repository and none set');
          //we've already setup this subscription
          _this2._context.subscription.delayTill(new _moment2['default']().add(1, 'hour').toDate());
          throw new ConnectorRequiresAuthorizationError();
        }
      }).then(function () {
        return hooksSetup;
      });
    }
  }, {
    key: 'setupHook',
    value: function setupHook() {
      var _this3 = this;

      return Promise.resolve().then(function () {
        _this3._logger.info('setting connector authorization');
        return _this3._connector.authorize(_this3._context.authorization);
      }).then(function () {
        _this3._logger.info('creating webhook endpoint');
        var hookUri = 'https://' + _config2['default'].get('Hoist.domains.endpoint') + '/' + _this3._context.organisation.slug + '/' + _this3._context.application.slug + '/' + _this3._context.connectorKey + '-incoming';
        return _this3._connector.post('/1/webhooks', {
          description: 'Hoist.io Endpoint',
          callbackURL: hookUri,
          idModel: _this3._context.authorization.get('SubscriptionModelId')
        }).then(function (result) {
          _this3._logger.debug({
            result: result
          }, 'result recieved');
        });
      }).then(function () {
        _this3._logger.info('webhooks created');
        return _this3._context.subscription.set('setup', true);
      });
    }
  }]);

  return TrelloPoller;
})();

exports['default'] = function (context) {
  var poller = new TrelloPoller(context);
  return poller.poll();
};

;
module.exports = exports['default'];
//# sourceMappingURL=poll.js.map

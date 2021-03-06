/* eslint-disable */
import moment from 'moment'
import React from 'react'

const today = moment().startOf('day').subtract(1, 'minutes')

'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BackgroundWrapper = function (_React$Component) {
  _inherits(BackgroundWrapper, _React$Component);

  function BackgroundWrapper() {
    _classCallCheck(this, BackgroundWrapper);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  BackgroundWrapper.prototype.render = function render() {
    return <div className={today.isBefore(moment(this.props.value)) ? this.props.children.props.className : this.props.children.props.className + ' rbc-day-past'} style={this.props.children.props.style}></div>;
  };

  return BackgroundWrapper;
}(_react2.default.Component);

exports.default = BackgroundWrapper;
module.exports = exports['default'];

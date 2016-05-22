import React, { Component, PropTypes } from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

class frontend extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('frontend', () => frontend);
import React from 'react-native';
import App from './App';

console.log('App',App);

class frontend extends React.Component {
  render() {
    return (
      <App />
    );
  }
}

React.AppRegistry.registerComponent('frontend', () => frontend);
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Home from './components/Home';
import HomeRoute from './routes/HomeRoute';

ReactDOM.render(
  <Relay.RootContainer
    Component={Home}
    route={new HomeRoute()} />,
  document.getElementById('app'));

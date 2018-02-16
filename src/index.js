/*
Copyright 2017 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import reducer from './redux/modules/reducer';
import socketMiddleware from './redux/middlewares/socketMiddleware';
import SocketClient from './helpers/SocketClient';

import { App, NotFound } from './components';

export const socketClient = new SocketClient({ connect: true });
export const store = createStore(
  reducer,
  applyMiddleware(
    ReduxThunk,
    socketMiddleware(socketClient)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/map/:mapKey" component={App} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  </Provider>, document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.scss';

import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux'

import Chat from './pages/chat-page/chat-page'
import store from './services/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
      <BrowserRouter>
        <Chat />
      </BrowserRouter>
    </Provider>
);

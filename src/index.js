import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'
import setupSocket from './sockets/index'
import reducers from './reducers'
import handleNewMessage from './sagas/index'
import username from './utils/name'


const sagaMiddleware = createSagaMiddleware()


const store = createStore(
    reducers, 
    applyMiddleware(sagaMiddleware)
)

const socket = setupSocket(store.dispatch, username)

sagaMiddleware.run(handleNewMessage, {socket, username})

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);

reportWebVitals();


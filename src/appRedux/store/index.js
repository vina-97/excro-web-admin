import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware  from 'redux-thunk';
//import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import { createBrowserHistory } from 'history';
import { promiseMiddleware } from './middleware';

export const history = createBrowserHistory();

//const loggerMiddleware = createLogger();

export const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware ,
        //promiseMiddleware,
        //loggerMiddleware
    )
);

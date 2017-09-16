import portfolio from './portfolio'
import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    portfolio,
    routing: routerReducer,
});
export default rootReducer;

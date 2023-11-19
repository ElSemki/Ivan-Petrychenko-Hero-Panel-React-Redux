import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import filters from '../reducers/filters';
import heroes from '../reducers/heroes';

const stringMiddleware = () => next => action => {
	if (typeof action === 'string') {
		return next({ type: action });
	}
	return next(action);
};

const store = createStore(
	combineReducers({ heroes, filters }),
	compose(
		applyMiddleware(ReduxThunk, stringMiddleware),
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
);

export default store;

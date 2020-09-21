import reducers from '../reducers';
import { createStore, applyMiddleware } from "redux";
import promise from "redux-promise";

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
const store = createStoreWithMiddleware(reducers);

export default store;
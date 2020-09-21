import { combineReducers } from "redux";
import appRedcuer from "./appReducer";

const rootReducer = combineReducers({
    app: appRedcuer,
});

export default rootReducer;
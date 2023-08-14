import { combineReducers } from "redux";
import navbarReducer from "./navbar/navbarSlice";

const rootReducer = combineReducers({
  navbar: navbarReducer,
});

export default rootReducer;

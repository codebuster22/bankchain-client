import {CHANGE_SEARCH_FIELD,
    FETCH_NPA_PENDING, FETCH_NPA_SUCCESS, FETCH_NPA_FAILED} from './constants.js';
import {changeSearchField} from "./actions";

const initialSearchState = {
    searchField: ''
}

const searchNpa = (state=initialSearchState,action)=> {
    switch (action.type) {
        case CHANGE_SEARCH_FIELD:
            return Object.assign({},state,{searchField: action.payload});
        default:
            return state;
    }
}

const initialNpaState = {
    contracts: [],
}

const fetchNpa = (state=initialNpaState, action) =>{
    switch (action.type) {
        case FETCH_NPA_PENDING:
            return {...state};
        case FETCH_NPA_SUCCESS:
            return {...state,contracts: action.payload};
        case FETCH_NPA_FAILED:
            return {...state, error: action.payload};
        default:
            return state;
    }
}

export {searchNpa};
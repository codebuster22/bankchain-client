import {CHANGE_SEARCH_FIELD,
    FETCH_NPA_PENDING, FETCH_NPA_SUCCESS, FETCH_NPA_FAILED} from './constants.js';

const changeSearchField = (value) =>(
    {
        type: CHANGE_SEARCH_FIELD,
        payload: value
    }
);

const fetchNpa = () => async (dispatch) => {
    dispatch({
        type: FETCH_NPA_PENDING
    });
    try{
        const response = await fetch('http://localhost:3001/getAddress');
        const data = await response.json();
        dispatch({
            type: FETCH_NPA_SUCCESS,
            payload: data
        })
    }catch (e) {
        dispatch({
            type: FETCH_NPA_FAILED,
            payload: e
        })
    }
}

export {changeSearchField};
import {
    CHAT_USER, ACTIVE_USER, FULL_USER, ADD_LOGGED_USER, CREATE_GROUP,FETCH_DATA_REQUEST
} from './constants';


export const chatUser = () => ({
    type: CHAT_USER
});

export const activeUser = (userId) => ({
    type: ACTIVE_USER,
    payload: userId
});

/*export const setFullUser = (fullUser) => ({
    type: FULL_USER,
    payload: fullUser
});
*/

export const setFullUser = (fullUser, shouldFetchData = false) => ({
    type: FULL_USER,
    payload: fullUser,
    shouldFetchData
});


export const addLoggedinUser = (userData) => ({
    type: ADD_LOGGED_USER,
    payload: userData
});

export const createGroup = (groupData) => ({
    type: CREATE_GROUP,
    payload: groupData
})

// actions.js

export const fetchDataRequest = () => ({
    type: FETCH_DATA_REQUEST
});


export const fullUser = (payload) => {
    return {
        type: FULL_USER,
        payload
    };
};
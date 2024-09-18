
import { getFirebaseBackend } from "../../helpers/firebase";
import { all, call, fork, put, takeLatest,takeEvery } from 'redux-saga/effects';


import {
    CHAT_USER, ACTIVE_USER,FULL_USER, ADD_LOGGED_USER, CREATE_GROUP,FETCH_DATA_REQUEST
} from './constants';

import {
    chatUser,activeUser,addLoggedinUser,createGroup,setFullUser
} from './actions';


function* handleFullUserSaga(action) {
  if (action.shouldFetchData) {
      try {
          const firebaseBackend = getFirebaseBackend();
          const database = firebaseBackend.getDatabase();
          const snapshot = yield call(() => database.ref('/').get());
          const data = snapshot.val();
          const convertedData = yield call(convertFirebaseDataToState, data);
          //yield put({ type: FULL_USER, payload: convertedData });

          yield put(setFullUser(convertedData,true));
      } catch (error) {
          console.error("Error fetching data: ", error);
      }
  }
}

function * handleChatUserSaga(action) {
  try {
    const firebaseBackend = getFirebaseBackend();
    const database = firebaseBackend.getDatabase();
    const snapshot = yield call(() => database.ref('/').get());
    const data = snapshot.val();
    const convertedData = yield call(convertFirebaseDataToState, data);
    yield put(chatUser(convertedData));
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

function * handleActiveUserSaga(action) {
  try {
    const firebaseBackend = getFirebaseBackend();
    const database = firebaseBackend.getDatabase();
    const snapshot = yield call(() => database.ref('/').get());
    const data = snapshot.val();
    const convertedData = yield call(convertFirebaseDataToState, data);
    yield put(activeUser(convertedData));
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

function * handleAddLoggedUserSaga(action) {
  try {
    const firebaseBackend = getFirebaseBackend();
    const database = firebaseBackend.getDatabase();
    const snapshot = yield call(() => database.ref('/').get());
    const data = snapshot.val();
    const convertedData = yield call(convertFirebaseDataToState, data);
    yield put(addLoggedinUser(convertedData));
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

function * handleCreateGroupSaga(action) {
  try {
    const firebaseBackend = getFirebaseBackend();
    const database = firebaseBackend.getDatabase();
    const snapshot = yield call(() => database.ref('/').get());
    const data = snapshot.val();
    const convertedData = yield call(convertFirebaseDataToState, data);
    yield put(createGroup(convertedData));
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

// Watcher Sagas

function* watchFetchData() {
  yield takeLatest(FULL_USER, handleFullUserSaga);
}

// Watcher Sagas
function* watchChatUser() {
  yield takeLatest(CHAT_USER, handleChatUserSaga);
}

function* watchActiveUser() {
  yield takeLatest(ACTIVE_USER, handleActiveUserSaga);
}

function* watchAddLoggedUser() {
  yield takeLatest(ADD_LOGGED_USER, handleAddLoggedUserSaga);
}

function* watchCreateGroup() {
  yield takeLatest(CREATE_GROUP, handleCreateGroupSaga);
}


export default function* chatSaga() {
  yield all([
    fork(watchFetchData),
    // Add other watchers here
    fork(watchChatUser),
    fork(watchActiveUser),
    fork(watchAddLoggedUser),
    fork(watchCreateGroup)
    
  ]);
}

const convertFirebaseDataToState = firebaseData => {
  // Assuming firebaseData has 'users', 'groups', and 'contacts' as top-level keys
  const users = Object.values(firebaseData.users || {});
  const groups = Object.values(firebaseData.groups || {});
  const contacts = Object.values(firebaseData.contacts || {});

  return { users, groups, contacts };
};
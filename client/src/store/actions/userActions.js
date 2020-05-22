import {
  WILL_REGISTER_USER,
  SUCCESS_REGISTER_USER,
  FAIL_REGISTER_USER,
  WILL_LOGIN_USER,
  SUCCESS_LOGIN_USER,
  FAIL_LOGIN_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_FAVE,
  REMOVE_FAVE,
  FAVE_FAIL,
} from './types';

import { returnErrors } from '../actions/errActions';

import axios from 'axios';

// =========================================
// -------------- AUTH USER  ---------------
// =========================================
export const authUser = () => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json', //not sure this is necessary for json
      Authorization: 'Bearer ' + localStorage.getItem('token'), // if there isnt a token then it will read 'Bearer undefined'
    },
  };
  try {
    const res = await axios.get('/users/auth/', config);
    dispatch({
      type: AUTH_USER,
      payload: res.data, //this is the user that passport.js sends back, which will go into state.user.user (i think)
    });
  } catch (err) {
    console.log(err);
  }
};
// =========================================
// -------------- REGISTER -----------------
// =========================================
export const registerUser = ({
  avatar,
  username,
  email,
  password,
  firstName,
  lastName,
  country,
}) => async (dispatch) => {
  //this would be needed to send pictures to the server:
  // const config = {
  //   headers: {
  //     'content-type': 'multipart/form-data'
  //   }
  //}

  //prepate body and headers of POST request
  const body = {
    avatar: avatar,
    username: username,
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
    country: country,
  };

  try {
    dispatch({ type: WILL_REGISTER_USER });
    const res = await axios.post('/users/register/', body);
    dispatch({
      type: SUCCESS_REGISTER_USER,
      payload: res.data, //this is the token we are sending back with JWT
    });
    dispatch(authUser());
  } catch (err) {
    console.log(err);
    const errorMsg = err.response.data.errors[0].msg;
    const errorStat = err.response.status;
    dispatch(returnErrors(errorMsg, errorStat));
    dispatch({
      type: FAIL_REGISTER_USER,
    });
  }
};

// =========================================
// ---------------- LOGIN ------------------
// =========================================
export const loginUser = ({ email, password }) => async (dispatch) => {
  //prepate body and headers of POST request
  const body = { email, password };

  try {
    dispatch({ type: WILL_LOGIN_USER });
    const res = await axios.post('/users/login/', body);
    dispatch({
      type: SUCCESS_LOGIN_USER,
      payload: res.data, //this is the token we are sending back with JWT
    });
    dispatch(authUser());
  } catch (err) {
    const errorMsg = err.response.data.errors[0].msg;
    const errorStat = err.response.status;
    dispatch(returnErrors(errorMsg, errorStat));
    dispatch({
      type: FAIL_LOGIN_USER,
    });
  }
};

// =========================================
// ------------- LOGOUT USER  --------------
// =========================================
export const logoutUser = () => (dispatch) => {
  try {
    dispatch({ type: LOGOUT_USER });
  } catch (err) {
    console.log(err);
  }
};

// =========================================
// ------------ FAVE ITINERARY -------------
// =========================================
export const faveItinerary = ({ itinerary, user_id }) => async (dispatch) => {
  const itinerary_id = itinerary._id;
  const body = { itinerary_id, user_id };
  const config = {
    headers: {
      'Content-type': 'application/json', //not sure this is necessary for json
      Authorization: 'Bearer ' + localStorage.getItem('token'), // if there isnt a token then it will read 'Bearer undefined'
    },
  };
  try {
    const operation = await axios.put('/users/favorites', body, config);
    let msg = operation.data.msg;
    console.log(msg);
    if (msg === 'ADD') {
      dispatch({ type: ADD_FAVE, payload: itinerary });
    } else if (msg === 'REMOVE') {
      dispatch({ type: REMOVE_FAVE, payload: itinerary });
    }
  } catch (err) {
    dispatch({ type: FAVE_FAIL });
    console.log(err);
  }
};

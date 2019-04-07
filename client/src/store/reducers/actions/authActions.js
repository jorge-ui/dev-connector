import axios from 'axios'
import setAuthToken from '../../../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import {GET_ERRORS, SET_CURRENT_USER, SET_UPLOADED_PICTURE, DELETE_PICTURE, PICTURE_LOADING, CLEAR_ERRORS} from './types'
import {clearCurrentProfile} from './profileActions'

//===================================
// ACTIONS
//===================================

// Register user
export const registerUser = (userData, history) => (dispatch) => {
   axios.post('/api/users/register', userData)
      .then((res) => {
         history.push('/login')
      })
      .catch((err) => {
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      })
}

// Google sign in
export const googleSignIn = (googleUser) => (dispatch) => {
   var id_token = googleUser.getAuthResponse().id_token;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/users/login');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = () => {
         // Extract token from response
         const {token} = JSON.parse(xhr.responseText)
         // Save token to local storage
         localStorage.setItem('jwtToken', token)
         // Set token to auth header
         setAuthToken(token);
         // Decode token
         const decoded = jwt_decode(token)
         // Set current user 
         dispatch(setCurrentUser(decoded))
      };
      xhr.send('idtoken=' + id_token);
}

// Login user
export const loginUser = (credentials) => (dispatch) => {
   axios.post('/api/users/login', credentials)
      .then((res) => {
         // Extract token from response
         const {token} = res.data
         // Save token to local storage
         localStorage.setItem('jwtToken', token)
         // Set token to auth header
         setAuthToken(token);
         // Decode token
         const decoded = jwt_decode(token)
         // Set current user 
         dispatch(setCurrentUser(decoded))
      })
      .catch((err) => {
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      })
}


// Set current user
export function setCurrentUser(user) {
   return {
      type: SET_CURRENT_USER,
      payload: user
   }
}

// Upload picture
export const uploadPicture = (formdata) => (dispatch) => {
   dispatch({type: PICTURE_LOADING, payload: true})
   dispatch({type: CLEAR_ERRORS,})
   document.getElementById("pictureInput").setAttribute('disabled', '')
   axios.post('/api/users/picture', formdata)
      .then((res) => {
         dispatch({
            type: CLEAR_ERRORS,
         })
         dispatch({
            type: SET_UPLOADED_PICTURE,
            payload: res.data
         })
         document.getElementById("pictureInput").removeAttribute('disabled')
         document.getElementById("closeUploadModal").click()
      })
      .catch((err) => {
         dispatch({type: PICTURE_LOADING, payload: false})
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      })
}

// Delete picture
export const deletePicture = () => (dispatch) => {
   dispatch({type: PICTURE_LOADING, payload: true})
   document.getElementById("pictureInput").setAttribute('disabled', '')
   axios.delete('/api/users/picture')
   .then((res) => {
      dispatch({type: CLEAR_ERRORS,})
      dispatch({type: DELETE_PICTURE,})
      document.getElementById("pictureInput").removeAttribute('disabled')
      document.getElementById("closeUploadModal").click()
   })
   .catch(err => console.log(err))
}

// Get current user
export const getCurrentUser = () => (dispatch) => {
   axios.get('/api/users/current')
      .then((res) => {
         dispatch({
            type: SET_CURRENT_USER,
            payload: res.data
         })
      })
}

// Logout user
export const logoutUser = () => (dispatch) => {
   // Remove auth token from local storage
   localStorage.removeItem('jwtToken')
   // Remove auth token from header
   setAuthToken(false)
   // Clear current profile
   dispatch(clearCurrentProfile())
   // Set current user to empty
   dispatch(setCurrentUser({}))
}
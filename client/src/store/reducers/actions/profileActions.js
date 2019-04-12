import { GET_PROFILE,
         PROFILE_LOADING,
         GET_ERRORS,
         CREATE_PROFILE,
         PROFILE_NOT_FOUND,
         CLEAR_CURRENT_PROFILE,
         CLEAR_ERRORS,
         UPDATE_PROFILE,
         GET_ALL_PROFILES,
         CLEAR_ALL_PROFILE,
         SET_CURRENT_USER,
         EXP_LOADING,
         EDU_LOADING,} from './types'

import axios from 'axios'

//=====================================
// ACTIONS
//=====================================

// Get current profile
export const getCurrentProfile = () => (dispatch) => {
   dispatch(setPropfileLoading())
   axios.get('/api/profiles/current')
      .then((res) => {      
         dispatch({
            type: GET_PROFILE,
            payload: {
               current: res.data
            }
         })
      })
      .catch((err) => {
         dispatch({
            type: PROFILE_NOT_FOUND,
            payload: {
               current: {}
            }
         })
      })
}

// Get profile by handle
export const getPropfileByHandle = (handle) => (dispatch) => {
   dispatch(setPropfileLoading())
   axios.get(`/api/profiles/${handle}`)
      .then((res) => {      
         dispatch({
            type: GET_PROFILE,
            payload: {
               current: res.data
            }
         })
      })
      .catch((err) => {
         dispatch({
            type: PROFILE_NOT_FOUND,
            payload: {
               current: {}
            }
         })
      })
}

// Get all profiles
export const getAllProfiles = () => (dispatch) => {
   dispatch(setPropfileLoading())
   axios.get('/api/profiles/')
      .then((res) => {
         dispatch({
            type: GET_ALL_PROFILES,
            payload: res.data
         })
      })
      .catch(err => console.log("getAllProfiles err response", err.response))
}

// Set profile loading
const setPropfileLoading = () => {
   return {
      type: PROFILE_LOADING
   }
}

// Create profile
export const createProfile = (newProfile) => (dispatch) => {
   axios.post('/api/profiles', newProfile)
      .then((res) => {
         dispatch({
            type: CREATE_PROFILE,
            payload: {
               current: res.data
            }
         })
      })
      .catch((err) => {
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      })
}

// Update profile
export const updateProfile = (newProfile) => (dispatch) => {
   axios.put('/api/profiles', newProfile)
      .then((res) => {
         dispatch({
            type: UPDATE_PROFILE,
            payload: {
               current: res.data
            }
         })
      })
      .catch((err) => {
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      })
}

// Clear current profile
export const clearCurrentProfile = () => {
   return {
      type: CLEAR_CURRENT_PROFILE
   }
}

// Clear all profiles
export const clearAllProfiles = () => {
   return {
      type: CLEAR_ALL_PROFILE
   }
}

// Delete Account
export const deleteAccount = () => (dispatch) => {
   axios.delete('/api/profiles')
      .then((res) => {
         console.log("Success:", res.data)
         dispatch({
            type: SET_CURRENT_USER,
            payload: {}
         })
      })
}

//==========================================
// Experience and Education
//==========================================

// Add Experience
export const addExperience = (newExperience) => (dispatch) => {
   axios.post('/api/profiles/experience', newExperience)
      .then((res) => {
         dispatch({
            type: GET_PROFILE,
            payload: {
               current: res.data
            }
         })
      })
      .catch((err) => {
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      })
}

// Add Education
export const addEducation = (newEducation) => (dispatch) => {
   axios.post('/api/profiles/education', newEducation)
      .then((res) => {
         dispatch({
            type: GET_PROFILE,
            payload: {
               current: res.data
            }
         })
      })
      .catch((err) => {
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      })
}

// Delete experience
export const deleteExperience = (expId) => (dispatch) => {
   dispatch({
      type: EXP_LOADING,
      payload: expId,
   })
   axios.delete(('/api/profiles/experience/' + expId))
      .then((res) => {
         let $ = window.jQuery;
         $(`#tr-${expId}`).fadeOut(600, () => {
            dispatch({
               type: GET_PROFILE,
               payload: {
                  current: res.data
               }
            })
         })
      })
}

// Delete Education
export const deleteEducation = (eduId) => (dispatch) => {
   dispatch({
      type: EDU_LOADING,
      payload: eduId,
   })
   axios.delete(('/api/profiles/education/' + eduId))
      .then((res) => {
         let $ = window.jQuery;
         $(`#tr-${eduId}`).fadeOut(600, () => {
            dispatch({
               type: GET_PROFILE,
               payload: {
                  current: res.data
               }
            })
         })
      })
}

// Clear errors
export const clearErrors = () => {
   return {
      type: CLEAR_ERRORS
   }
}
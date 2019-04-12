import { POST_LOADING,
   GET_POST,
   GET_ALL_POSTS,
   ADD_POST,
   DELETE_POST,
   GET_ERRORS, 
   CLEAR_ERRORS,
   TOGGLE_LIKE,
   CLEAR_POST,
   ADD_COMMENT,
   DELETE_COMMENT
} from './types'
import axios from 'axios'

// Add post
export const addPost = (postData) => (dispatch) => {
   dispatch({
      type: CLEAR_ERRORS,
   })
   axios.post('/api/posts', postData)
      .then((res) => {
         dispatch({
            type: ADD_POST,
            payload: res.data
         })
      })
      .catch((err) => {
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      })
}

// Get all posts
export const getAllPosts = () => (dispatch) => {
   dispatch(setPostLoading())
   axios.get('api/posts/')
      .then((res) => {
         dispatch({
            type: GET_ALL_POSTS,
            payload: res.data
         })
      })
}

// Get single post
export const getPost = (id) => (dispatch) => {
   dispatch(setPostLoading())
   axios.get(`/api/posts/${id}`)
      .then((res) => {
         dispatch({
            type: GET_POST,
            payload: res.data
         })
      })
}

// Clear single post
export const clearPost = () => (dispatch) => {
   dispatch({type: CLEAR_POST})
}

// Delete post
export const deletePost = (postId) => (dispatch) => {
   axios.delete(`/api/posts/${postId}`)
      .then((res) => {
         let $ = window.jQuery
         $(`#post-${postId}`).animate({
            height: 0
         }, () => {
            $(`#post-${postId}`).fadeOut(250, () => {
               dispatch({
                  type: DELETE_POST,
                  payload: postId
               })
            })
         })
         
      })
      .catch((err) => {
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      })
}

// Toggle like
export const toggleLike = (id, isLiked) => (dispatch) => {
   axios.post(`/api/posts/like/${id}`)
      .then((res) => {
         dispatch({
            type: TOGGLE_LIKE,
            payload: {
               data: res.data,
               id: id
            }
         })
      })
}

// Add comment
export const addComment = (newComment, postId) => (dispatch) => {
   dispatch({
      type: CLEAR_ERRORS,
   })
   axios.post(`/api/posts/${postId}/comments`, newComment)
      .then((res) => {
         dispatch({
            type: ADD_COMMENT,
            payload: res.data,
         })
      })
      .catch((err) => {
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      })
}

// Delete comment
export const deleteComment =(postId, commentId) => (dispatch) => {
   axios.delete(`/api/posts/${postId}/comments/${commentId}`)
      .then((res) => {
         dispatch({
            type: DELETE_COMMENT,
            payload: commentId,
         })
      })
}

// Set post loading
const setPostLoading = () => ({
   type: POST_LOADING
})
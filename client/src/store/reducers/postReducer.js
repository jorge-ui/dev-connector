import { POST_LOADING,
         GET_POST,
         GET_ALL_POSTS,
         ADD_POST,
         DELETE_POST,
         TOGGLE_LIKE,
         CLEAR_POST,
         ADD_COMMENT,
         DELETE_COMMENT,
      } from './actions/types'

const initialState = {
   current: {},
   all: [],
   loading: false
}
//TODO: fix adding posts upon submit error
function postReducer(state = initialState, {type, payload}) {
   switch(type) {
      case GET_POST:
         return {
            ...state,
            current: payload,
            loading: false
         }
      case CLEAR_POST:
         return {
            ...state,
            current: {}
         }
      case ADD_POST:
         return {
            ...state,
            all: [payload, ...state.all]
         }
      case GET_ALL_POSTS:
         return {
            ...state,
            all: payload,
            loading: false
         }
      case POST_LOADING:
         return {
            ...state,
            loading: true
         }
      case DELETE_POST:
         return {
            ...state,
            all: state.all.filter(post => post._id !== payload)
         }
      case TOGGLE_LIKE:
         return {
            ...state,
            all: state.all.map((post) => {
               if(post._id === payload.id) {
                  return {...post, likes: payload.data}
               } else {
                  return {...post}
               }
            })
         }
      case ADD_COMMENT:
         return {
            ...state,
            current: {...state.current, comments: [payload, ...state.current.comments]}
         }
      case DELETE_COMMENT:
         return {
            ...state,
            current: {
               ...state.current,
               comments: state.current.comments.filter((comment) => {
                  return comment._id !== payload
               })
            }
         }
      default:
         return {...state}
   }
}

export default postReducer
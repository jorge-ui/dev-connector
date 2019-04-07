import { GET_PROFILE,
         PROFILE_LOADING,
         CREATE_PROFILE,
         PROFILE_NOT_FOUND,
         CLEAR_CURRENT_PROFILE,
         UPDATE_PROFILE,
         GET_ALL_PROFILES,
         CLEAR_ALL_PROFILE,} from './actions/types'

const initialState = {
   current: null,
   all: null,
   loading: false
}

export default function profileReducer(state = initialState, {type, payload}) {
   switch(type) {

      case GET_PROFILE:         
         return {
            ...state,
            ...payload,
            loading: false
         }
      
      case PROFILE_LOADING:         
         return {
            ...state,
            loading: true
         }

      case PROFILE_NOT_FOUND:         
         return {
            ...state,
            ...payload,
            loading: false
         }

      case CREATE_PROFILE:         
         return {
            ...state,
            ...payload
         }

      case CLEAR_CURRENT_PROFILE:
         return {
            ...state,
            current: null
         }

      case CLEAR_ALL_PROFILE:
         return {
            ...state,
            all: null
         }

      case UPDATE_PROFILE:
         return {
            ...state,
            ...payload,
            loading: false
         }

      case GET_ALL_PROFILES:
         return {
            ...state,
            all: payload,
            loading: false
         }
      
      default : return {...state}
   }
}
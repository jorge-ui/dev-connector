import { GET_PROFILE,
         PROFILE_LOADING,
         CREATE_PROFILE,
         PROFILE_NOT_FOUND,
         CLEAR_CURRENT_PROFILE,
         UPDATE_PROFILE,
         GET_ALL_PROFILES,
         CLEAR_ALL_PROFILE,
         EDU_LOADING,
         EXP_LOADING,} from './actions/types'

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

      case EXP_LOADING:
         return {
            ...state,
            current: {
               ...state.current,
               experience: state.current.experience.map((exp) => {
                  if(exp._id === payload) {
                     exp.loading = true
                  }
                  return exp
               }),
            }
         }
      case EDU_LOADING:
         return {
            ...state,
            current: {
               ...state.current,
               education: state.current.education.map((edu) => {
                  if(edu._id === payload) {
                     edu.loading = true
                  }
                  return edu
               }),
            }
         }
      default : return {...state}
   }
}
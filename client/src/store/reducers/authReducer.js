import { SET_CURRENT_USER, SET_UPLOADED_PICTURE, DELETE_PICTURE, PICTURE_LOADING } from "./actions/types";
import isEmpty from '../../validation/isEmpty'

const initialState = {
   isAuthenticated: false,
   user: {},
}

export default function(state = initialState, {type, payload}) {
   switch(type) {
      case SET_CURRENT_USER:
         return {
            ...state,
            isAuthenticated: !isEmpty(payload),
            user: payload
         }
      case PICTURE_LOADING: 
         return {
            ...state,
            user: {
               ...state.user,
               picture: {
                  ...state.user.picture,
                  loading: payload
               }
            }
         }
      case SET_UPLOADED_PICTURE:
         return {
            ...state,
            user: {
               ...state.user,
               picture: {
                  ...payload,
                  loading: false
               }
            }
         }
      case DELETE_PICTURE: 
      return {
         ...state,
         user: {
            ...state.user,
            picture: {url: null, public_id: null, loading: false}
         }
      }
      default:
         return state;
   }
}
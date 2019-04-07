import { GET_ERRORS, CLEAR_ERRORS } from './actions/types'

const initialState = {}


export default function(state = initialState, {type, payload}) {
   switch(type) {
      case GET_ERRORS:
         return payload
      case CLEAR_ERRORS:
         return {}
      default:
         return state
   }
}
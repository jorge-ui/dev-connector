import React from 'react'
import {Route, Redirect} from 'react-router-dom'

const PrivateRoute = ({render, auth, ...rest}) => {
   if(!auth.isAuthenticated) {
      render = () => <Redirect to="login"/>
   }
   return(<Route {...rest} render={render} />)
}


export default PrivateRoute
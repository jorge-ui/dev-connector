import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {loginUser, googleSignIn} from '../../store/reducers/actions/authActions'
import InputFieldGroup from '../common/InputFieldGroup'
import {clearErrors} from '../../store/reducers/actions/profileActions'
import {GoogleLogin} from 'react-google-login'


class Login extends Component {
   constructor() {
      super()
      this.state = {
         email: '',
         password: '',
         errors: {},
         googleSignedIn: false
      }
      this._isMounted = false
      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
   }
   responseGoogle(googleUser) {
      this.props.googleSignIn(googleUser)
   }

   
   logoutGoogle(res) {
      console.log(res)
   }

   componentDidMount() {
      this._isMounted = true
      if(this.props.auth.isAuthenticated) {
         this.props.history.push('/dashboard')
      }
   }

   componentWillReceiveProps(nextProps) {
      if(nextProps.auth.isAuthenticated) {
         this.props.history.push('/dashboard');
      }
      this.setState({errors: nextProps.errors ? nextProps.errors : {}})
   }

   
   onChange(e) {
      this.setState({[e.target.name]: e.target.value})
   }
   
   onSubmit(e) {
      e.preventDefault()
      
      var credentials = {
         email: this.state.email,
         password: this.state.password
      }
      
      this.props.onLoginUser(credentials)
   }

   componentWillUnmount() {
      this._isMounted = false
      this.props.onClearErrors()
   }
   
   render() {
      var {errors, googleSignedIn} = this.state;
      return (
         <div className="login">
            <div className="container">
               <div className="row">
               <div className="col-md-8 m-auto">
                  <h1 className="display-4 text-center">Log In</h1>
                  <p className="lead text-center">Sign in to your DevConnector account</p>
                  <form onSubmit={this.onSubmit}>

                     <InputFieldGroup
                        type={"email"}
                        placeholder={"Email Address"}
                        name={"email"}
                        value={this.state.email}
                        onChange={this.onChange}
                        error={errors.email}
                        id={"emailField"}
                     />

                     <InputFieldGroup
                        type={"password"}
                        placeholder={"Password"}
                        name={"password"}
                        value={this.state.password}
                        onChange={this.onChange}
                        error={errors.password}
                        id={"passwordField"}
                     />
                     <input type="submit" className="btn btn-info btn-block mt-4" />
                  </form>
                     <div className="w-100 text-center mt-3"><em>or</em></div>
                     <div className="d-flex justify-content-center mt-3">
                        <GoogleLogin
                           clientId="48398124661-gd6p9j8ad7sbrl5uvls2tbrsfi5pmidc.apps.googleusercontent.com"
                           onSuccess={this.responseGoogle.bind(this)}
                           onFailure={this.responseGoogle.bind(this)}
                           buttonText={googleSignedIn ? 'Signed in' : 'Sign in with Google'}
                        />
                     </div>
               </div>
               </div>
            </div>
         </div>
      )
   }
}

Login.propTypes = {
   onLoginUser: PropTypes.func.isRequired,
   auth: PropTypes.object.isRequired,
   errors: PropTypes.object.isRequired,
   onClearErrors: PropTypes.func.isRequired,
   googleSignIn: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   auth: state.auth,
   errors: state.errors
})
const mapActionsToProps = {
   onLoginUser: loginUser,
   onClearErrors: clearErrors,
   googleSignIn,
}

export default connect(mapStateToProps, mapActionsToProps)(Login);
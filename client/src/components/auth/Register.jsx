import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom' //to redirect
import classnames from 'classnames'
import {connect} from 'react-redux'
import {registerUser} from '../../store/reducers/actions/authActions'
import InputFieldGroup from '../common/InputFieldGroup'

class Register extends Component {
   constructor() {
      super()
      this.state = {
         name: '',
         email: '',
         password: '',
         password2: '',
         errors: {},
      }
      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
   }

   componentDidMount() {      
      if(this.props.auth.isAuthenticated) {
         this.props.history.push('/dashboard')
      }
   }

   //Component methods
   componentWillReceiveProps(nextProps) {
      this.setState({errors: nextProps.errors ? nextProps.errors : {}})
   }

   onChange(e) {      
      this.setState({[e.target.name]: e.target.value})
   }

   onSubmit(e) {
      e.preventDefault();

      var newUser = {
         name: this.state.name,
         email: this.state.email,
         password: this.state.password,
         password2: this.state.password2
      }

      this.props.onRegisterUser(newUser, this.props.history);
   }

   render() {
      var {errors} = this.state;
      return (
         <div className="container">
            <div className="register">
               <div className="container">
                  <div className="row">
                  <div className="col-md-8 m-auto">
                     <h1 className="display-4 text-center">Sign Up</h1>
                     <p className="lead text-center">Create your DevConnector account</p>
                     <form onSubmit={this.onSubmit}>

                        <InputFieldGroup
                           type={'text'}
                           placeholder={"Name"}
                           name={"name"}
                           value={this.state.name}
                           onChange={this.onChange}
                           error={errors.name}
                        />

                        <InputFieldGroup
                           type={"email"}
                           placeholder={"Email Address"}
                           name={"email"}
                           value={this.state.email}
                           onChange={this.onChange}
                           error={errors.email}
                        />

                        <InputFieldGroup
                           type={"password"}
                           placeholder={"Password"}
                           name={"password"}
                           value={this.state.password}
                           onChange={this.onChange}
                           error={errors.password}
                        />

                        <InputFieldGroup
                           type={"password"}
                           placeholder={"Confirm Password"}
                           name={"password2"}
                           value={this.state.password2}
                           onChange={this.onChange}
                           error={errors.password2}
                        />

                        <input type="submit" className={classnames("btn btn-info btn-block mt-4", {
                           'disabled': this.props.auth.isLoading
                        })} />
                     </form>
                  </div>
                  </div>
               </div>
            </div>
         </div>
      )
   }
}

Register.propTypes = {
   onRegisterUser: PropTypes.func.isRequired,
   auth: PropTypes.object.isRequired,
   errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
   auth: state.auth,
   errors: state.errors
})
const mapActionsToProps = {
   onRegisterUser: registerUser
}

export default connect(
   mapStateToProps,
   mapActionsToProps,
   )(withRouter(Register));
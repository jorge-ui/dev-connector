import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import setAuthToken from './utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import {connect} from 'react-redux'
import {logoutUser, getCurrentUser, setCurrentUser} from './store/reducers/actions/authActions'
import {clearCurrentProfile,} from './store/reducers/actions/profileActions'
import './css/bootstrap.min.css'
import './css/App.css'
// Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/auth/Dashboard';
import ProfileForm from './components/profile/ProfileForm';
// import ShowProfile from './components/profile/ShowProfile';
import PrivateRoute from './components/common/PrivateRoute'
import ExperienceForm from './components/profile/ExperienceForm';
import EducationForm from './components/profile/EducationForm';
import ShowProfile from './components/profile/byHandle/ShowProfile';
import DeveloperProfiles from './components/profile/developers/DeveloperProfiles';
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
// Redux detup
import store from './store';
import PostsFeed from './components/posts/PostsFeed';
import ShowPost from './components/post/ShowPost';

library.add(fab, fas)
dom.watch()

// Check for jwt token
if(localStorage.jwtToken) {
   // Set auth token on header
   setAuthToken(localStorage.jwtToken)
   // Decode token
   const decoded = jwt_decode(localStorage.jwtToken)

   let currentTime = Date.now / 1000;
   if(currentTime > decoded.expired) {
      // Logout user
      store.dispatch(logoutUser())
      // TODO: Clear current profile
      store.dispatch(clearCurrentProfile())
      // Redirect to login
      window.location.href = '/login'
   }
}


class App extends Component {
   componentDidMount() {
      if(localStorage.jwtToken) {
         this.props.getCurrentUser()
      }
   }
   render() {      
      return (
         <Router>
            <div className="App">
               <Navbar auth={this.props.auth} profile={this.props.profile} logoutUser={this.props.logoutUser} clearCurrentProfile={this.props.clearCurrentProfile}/>
               <Route exact path="/" component={Landing} />
               <Route exact path="/register" component={Register} />
               <Route exact path="/login" component={Login} />
               <Route exact path="/developers" component={DeveloperProfiles} />
               <Route exact path="/developers/:handle" component={ShowProfile} />
               <Switch>
                  <PrivateRoute exact path="/dashboard" component={Dashboard} auth={this.props.auth}/>
               </Switch>
               <Switch>
                  <PrivateRoute exact path="/dashboard/new" component={ProfileForm} auth={this.props.auth}/>
               </Switch>
               <Switch>
                  <PrivateRoute exact path="/dashboard/edit" component={ProfileForm} auth={this.props.auth}/>
               </Switch>
               <Switch>
                  <PrivateRoute exact path="/dashboard/add-experience" component={ExperienceForm} auth={this.props.auth}/>
               </Switch>
               <Switch>
                  <PrivateRoute exact path="/dashboard/add-education" component={EducationForm} auth={this.props.auth}/>
               </Switch>
               <Switch>
                  <PrivateRoute exact path="/feed" component={PostsFeed} auth={this.props.auth}/>
               </Switch>
               <Switch>
                  <PrivateRoute exact path="/post/:id" component={ShowPost} auth={this.props.auth}/>
               </Switch>
               <Footer/>
            </div>
         </Router>
      );
   }
}

const mapStateToProps = (state) => ({
   auth: state.auth,
   profile: state.profile,
})

const mapActionsToProps = {
   logoutUser,
   clearCurrentProfile,
   getCurrentUser,
   setCurrentUser,
}

export default connect(mapStateToProps, mapActionsToProps)(App)

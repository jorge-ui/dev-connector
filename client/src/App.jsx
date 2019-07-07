import React, { Component, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Switch} from 'react-router-dom'
import setAuthToken from './utils/setAuthToken'
// import jwt_decode from 'jwt-decode'
import './css/bootstrap.min.css'
import './css/App.css'
// Redux detup
import store from './store';
import PostsFeed from './components/posts/PostsFeed';
import ShowPost from './components/post/ShowPost';
import {connect} from 'react-redux'
import {logoutUser, getCurrentUser, setCurrentUser} from './store/reducers/actions/authActions'
import {clearCurrentProfile,} from './store/reducers/actions/profileActions'
// Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Spinner from './components/common/Spinner/Spinner';
// Lazy components
const Route = lazy(() => import('react-router-dom/Route'))
const PrivateRoute = lazy(() => import('./components/common/PrivateRoute'))
const Register = lazy(() => import('./components/auth/Register'))
const Login = lazy(() => import('./components/auth/Login'))
const Dashboard = lazy(() => import('./components/auth/Dashboard'))
const ProfileForm = lazy(() => import('./components/profile/ProfileForm'))
const ExperienceForm = lazy(() => import('./components/profile/ExperienceForm'))
const EducationForm = lazy(() => import('./components/profile/EducationForm'))
const ShowProfile = lazy(() => import('./components/profile/byHandle/ShowProfile'))
const DeveloperProfiles = lazy(() => import('./components/profile/developers/DeveloperProfiles'))

class App extends Component {
   componentDidMount() {
      let {jwtToken} = localStorage
      if(jwtToken) {
         setAuthToken(jwtToken)
         let decoded = require('jwt-decode')(jwtToken)
         let currentTime = Date.now / 1000;
         if(currentTime > decoded.expired) {
            // Logout user
            store.dispatch(logoutUser())
            // Clear current profile
            store.dispatch(clearCurrentProfile())
            // Redirect to login
            window.location.href = '/login'
         } else {
            this.props.getCurrentUser()
         }
      }
   }
   render() {      
      return (
         <Suspense fallback={<Spinner/>}>
            <Router>
               <div className="App">
                  <Navbar auth={this.props.auth} profile={this.props.profile} logoutUser={this.props.logoutUser} clearCurrentProfile={this.props.clearCurrentProfile}/>
                  <Route exact path="/" render={props => <Landing {...props}/>} />
                  <Route exact path="/register" render={props => <Register {...props}/>} />
                  <Route exact path="/login" render={props => <Login {...props}/>} />
                  <Route exact path="/developers" render={props => <DeveloperProfiles {...props}/>} />
                  <Route exact path="/developers/:handle" render={props => <ShowProfile {...props}/>} />
                  <Switch>
                     <PrivateRoute exact path="/dashboard"
                        render={props => <Dashboard {...props}/>} auth={this.props.auth}/>

                     <PrivateRoute exact path="/dashboard/new"
                        render={props => <ProfileForm {...props}/>} auth={this.props.auth}/>

                     <PrivateRoute exact path="/dashboard/edit"
                        render={props => <ProfileForm {...props}/>} auth={this.props.auth}/>

                     <PrivateRoute exact path="/dashboard/add-experience"
                        render={props => <ExperienceForm {...props}/>} auth={this.props.auth}/>

                     <PrivateRoute exact path="/dashboard/add-education"
                        render={props => <EducationForm {...props}/>} auth={this.props.auth}/>

                     <PrivateRoute exact path="/feed"
                        render={props => <PostsFeed {...props}/>} auth={this.props.auth}/>

                     <PrivateRoute exact path="/post/:id"
                        render={props => <ShowPost {...props}/>} auth={this.props.auth}/>
                  </Switch>
                  <Footer/>
               </div>
            </Router>
         </Suspense>
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

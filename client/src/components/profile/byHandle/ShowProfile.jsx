import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import profileDefault from '../../common/profileDefault.png'
//SubComponents
import ProfileHeader from './ProfileHeader'
import ProfileAbout from './ProfileAbout'
import ProfileCreds from './ProfileCreds'
import ProfileGithub from './ProfileGithub'
import Spinner from '../../common/Spinner/Spinner'
import {getPropfileByHandle} from '../../../store/reducers/actions/profileActions'
import isEmpty from '../../../validation/isEmpty';
import {Link} from 'react-router-dom'


class ShowProfile extends Component {
   componentDidMount() {
      this.props.getPropfileByHandle(this.props.match.params.handle)
   }

   render() {
      const {current: profile, loading} = this.props.profile
      const {isAuthenticated, user} = this.props.auth
      let renderContent;
      if(isEmpty(profile) || loading) {
         renderContent = <Spinner/>
      } else {
         renderContent = (
            <div id="profile">
               {/* <!-- Profile Header --> */}
               <ProfileHeader 
                  name={profile.user.name}
                  company={profile.company}
                  location={profile.location}
                  status={profile.status}
                  profilePicture={(profile.user.picture && profile.user.picture.url) || profileDefault}
                  social={profile.social}
               />
               
               {/* <!-- Profile About --> */}
               <ProfileAbout 
                  bio={profile.bio}
                  name={profile.user.name}
                  skills={profile.skills}
               />
      
               {/* <!-- Profile Creds --> */}
               <ProfileCreds
                  experience={profile.experience}
                  education={profile.education}
               />
      
               {/* <!-- Profile Github --> */}
               {profile.githubUsername ? (<ProfileGithub username={profile.githubUsername} />) : null}
            </div>
         )
      }
      return (
         <div className="profile">
            <div className="container">
               <div className="row">
               <div className="col-md-12">
                  <div className="clearfix">
                     <div className="float-left">
                        <Link to="/developers" className="btn btn-light mb-3">Back To Profiles</Link>
                     </div>
                     {isAuthenticated && (user.id === profile.user._id) && (
                        <div className="float-right">
                           <Link to="/dashboard/edit" className="btn btn-light mb-3">Edit My Profiles</Link>
                        </div>
                     )}
                  </div>
                  {renderContent}
               </div>
               </div>
            </div>
         </div>

      )
   }
}

ShowProfile.propTypes = {
   profile: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   getPropfileByHandle: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   profile: state.profile,
   auth: state.auth,
})

const mapActionsToProps = {
   getPropfileByHandle
}

export default connect(mapStateToProps, mapActionsToProps)(ShowProfile)
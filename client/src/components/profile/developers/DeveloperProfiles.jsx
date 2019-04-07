import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProfileCard from './subComponents/ProfileCard'
import {connect} from 'react-redux'
import {getAllProfiles, clearAllProfiles} from '../../../store/reducers/actions/profileActions'
import Spinner from '../../common/Spinner/Spinner'

class DeveloperProfiles extends Component {
   componentWillUnmount() {
      this.props.onClearAllProfiles()
   }

   componentDidMount() {
      this.props.onGetAllProfiles()
   }

   render() {
      const developers = this.props.profile.all
      const {loading} = this.props.profile
      let renderContent;

      if(loading) {
         renderContent = <Spinner/>
      } else {
         renderContent = (
            <div id="developers">
               {developers && developers.map((profile) => {
                  return <ProfileCard {...profile} key={profile._id}/>
               })}
            </div>
         )
      }

      return (
         <div className="profiles">
            <div className="container">
               <div className="row">
               <div className="col-md-12">
                  <h1 className="display-4 text-center">Developer Profiles</h1>
                  <p className="lead text-center">Browse and connect with developers</p>
         
                  {/* Profile Cards */}
                  {renderContent}
               </div>
               </div>
            </div>
         </div>
         
      )
   }
}

DeveloperProfiles.propTypes = {
   profile: PropTypes.object.isRequired,
   onGetAllProfiles: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   profile: state.profile
})

const mapActionsToProps = {
   onGetAllProfiles: getAllProfiles,
   onClearAllProfiles: clearAllProfiles
}

export default connect(mapStateToProps, mapActionsToProps)(DeveloperProfiles)
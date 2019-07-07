import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import profileDefault from '../common/profileDefault.png'


class Navbar extends Component {

   logoutUserClick = () => {
      if(this.props.auth.user.googleId) {
         let auth2 = window.gapi.auth2.getAuthInstance();
         auth2.signOut()
         .then(() => {
            console.log('Google user signed out.')
            this.props.logoutUser()
         })
      } else {
         this.props.logoutUser()
      }
   }

   onClick = (e) => {
      e.preventDefault()
      if(e.target.localName === 'a') {
         !this.props.auth.isAuthenticated && document.querySelector('.navbar-toggler').click()
      }
   }

   render = () => {
      const {isAuthenticated, user} = this.props.auth;
      const dropdownMenu = (
         <div className="nav-item dropdown float-left">
            <div className="text-light btn bg-transparent nav-link dropdown-toggle" data-display="static" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
               <span className="text-secondary">
                  <img
                     src={(user.picture && user.picture.url) || profileDefault} 
                     className="rounded-circle d-inline-block"
                     style={{width: 30, height: 30, marginLeft: '7px'}}
                     alt={"profilePic"}
                  />
               </span> {user.name}
            </div>
            <div className="dropdown-menu dropdown-menu-right shadow" aria-labelledby="dropdownMenuButton">
               <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
               <Link className={`dropdown-item ${!user.handle && "disabled"}`} to={`/developers/${user.handle}`}>My Profile</Link>
               <Link className="dropdown-item d-block d-md-none" to="/feed" style={{cursor: "pointer"}}>Posts Feed</Link>
               <Link className="dropdown-item d-block d-md-none" to="/developers">Developers</Link>

               <div style={{cursor: "pointer"}} onClick={this.logoutUserClick} className="dropdown-item">Logout</div>
            </div>
         </div>
      )
      const authLinks = (
         <ul className="navbar-nav ml-auto">
            <li className="nav-item">
               <Link to="/feed" style={{cursor: "pointer"}} className="nav-link">Posts Feed</Link>
            </li>
            {/* Dropdown menu */}
            <div className="d-none d-md-inline-block">
               {dropdownMenu}
            </div>
         </ul> 
      );
      const guestLinks = (
         <ul className="navbar-nav ml-auto">
            <li className="nav-item">
               <Link className="nav-link" to="/register">Sign Up</Link>
            </li>
            <li className="nav-item">
               <Link className="nav-link" to="/login">Login</Link>
            </li>
         </ul>
      );

      return (
         <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
            <div className="container d-flex align-items-center">
               <Link className="navbar-brand" to="/">DevConnector</Link>
               {this.props.auth.isAuthenticated && (<div className="ml-5 pl-2 d-inline-block d-md-none">
                  {dropdownMenu}
               </div>)}
               {!isAuthenticated && (<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
                  <span className="navbar-toggler-icon"></span>
               </button>)}
         
               <div className="collapse navbar-collapse" id="mobile-nav" onClick={this.onClick}>
                  <ul className="navbar-nav mr-auto">
                     <li className="nav-item">
                        <Link className="nav-link" to="/developers">Developers</Link>
                     </li>
                  </ul>
                  {isAuthenticated ? authLinks : guestLinks}
               </div>
            </div>
         </nav>
      )
   }
}

Navbar.propTypes = {
   auth: PropTypes.object.isRequired,
   logoutUser: PropTypes.func.isRequired,
   clearCurrentProfile: PropTypes.func.isRequired
}

export default Navbar
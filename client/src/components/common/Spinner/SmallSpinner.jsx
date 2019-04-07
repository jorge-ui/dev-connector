import React from 'react'
import spinner from './spinner.gif'
export default function Spinner() {
   return (
      <div className="loadingOverlay d-flex align-items-center">
         <img
            src={spinner}
            style={{width: '100%', margin: 'auto', display: 'block', position: 'absolute'}}
            alt="Loading..."/>
      </div>
   )
}
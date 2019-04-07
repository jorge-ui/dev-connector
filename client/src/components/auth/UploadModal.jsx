import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'


class UploadModal extends Component {
   constructor(props) {
      super(props)
      this.fileInput = React.createRef()
      this.handleFile = this.handleFile.bind(this)
      this.state = {
         file: null
      }
   }
   handleFile(e) {
      this.setState({
         file: e.target.files[0]
      })
   }

   deletePicture() {
      this.props.deletePicture()
   }

   onUploadSubmit(e) {
      e.preventDefault()
      const {file} = this.state
      let formdata = new FormData()
      formdata.append('picture', file)
      this.props.uploadPicture(formdata)
   }

   render() {
      const {error, picture} = this.props
      return (
         <div className="modal fade" id="imageUploadModal" tabIndex="-1" role="dialog" aria-labelledby="imageUploadModal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
               <div className="modal-content">
                  <form onSubmit={this.onUploadSubmit.bind(this)} encType="multipart/form-data">
                  <div className="modal-header">
                     <h5 className="modal-title" id="exampleModalCenterTitle">Upload Profile Picture</h5>
                     <button id="closeUploadModal" type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                     </button>
                  </div>
                  <div className="modal-body">
                  <div className="input-group mb-3">
                     <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroupFileAddon01">Upload</span>
                     </div>
                     <div className="custom-file">
                        <input 
                           type="file"
                           accept="images/*"
                           ref={this.fileInput}
                           onChange={(e) => this.handleFile(e)}
                           name="picture"
                           className={classNames("custom-file-input", {
                              'is-invalid': error,
                              'disabled': picture.loading
                           })}
                           id="pictureInput"
                           aria-describedby="inputGroupFileAddon01"/>
                        <label className="custom-file-label" htmlFor="pictureInput">{(this.fileInput.current && (this.fileInput.current.files.length > 0)) ? this.fileInput.current.files[0].name : "Choose file"}</label>
                     </div>
                  </div>
                     {error && (<div className='text-danger text-center'>{error}</div>)}
                  </div>
                  <div className="modal-footer container d-block">
                     {picture.loading ? (
                     <div className="spinner-grow text-info mx-auto d-block" role="status">
                        <span className="sr-only">Loading...</span>
                     </div>
                     ) : (
                     <div className="picture-buttons row">
                        {(picture && picture.url) && (
                        <div className="col">
                           <div onClick={this.deletePicture.bind(this)} className="btn btn-danger d-block w-100">Remove Picture</div>
                        </div>)}
                        <div className="col">
                           <button type="submit" className="btn btn-success d-block w-100">Upload</button>
                        </div>
                     </div>)}
                  </div>
                  </form>
               </div>
            </div>
         </div>
      )
   }
}

UploadModal.propTypes = {
   error: PropTypes.string,
   picture: PropTypes.object.isRequired,
   uploadPicture: PropTypes.func.isRequired,
   deletePicture: PropTypes.func.isRequired,
}

export default UploadModal
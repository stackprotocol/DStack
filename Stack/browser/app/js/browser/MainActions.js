import React from "react"
import { connect } from "react-redux"
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap"
import web from "../web"
import * as actionsBuckets from "../buckets/actions"
import * as uploadsActions from "../uploads/actions"
import { getPrefixWritable } from "../objects/selectors"

export const MainActions = ({
  prefixWritable,
  uploadFile,
  showMakeBucketModal
}) => {
  const uploadTooltip = <Tooltip id="tt-upload-file">Upload file</Tooltip>
  const makeBucketTooltip = (
    <Tooltip id="tt-create-bucket">Create bucket</Tooltip>
  )
  const onFileUpload = e => {
    e.preventDefault()
    let files = e.target.files
    let filesToUploadCount = files.length
    for (let i = 0; i < filesToUploadCount; i++) {
      uploadFile(files.item(i))
    }
    e.target.value = null
  }

  const loggedIn = web.LoggedIn()

  if (loggedIn || prefixWritable) {
    return (
      <Dropdown dropup className="feb-actions" id="fe-action-toggle">
        <Dropdown.Toggle noCaret className="feba-toggle">
          <span>
            <i className="fas fa-plus" />
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <OverlayTrigger placement="left" overlay={uploadTooltip}>
            <a href="#" className="feba-btn feba-upload">
              <input
                type="file"
                onChange={onFileUpload}
                style={{ display: "none" }}
                id="file-input"
                multiple={true}
              />
              <label htmlFor="file-input">
                {" "}
                <i className="fas fa-cloud-upload-alt" />{" "}
              </label>
            </a>
          </OverlayTrigger>
          {loggedIn && (
            <OverlayTrigger placement="left" overlay={makeBucketTooltip}>
              <a
                href="#"
                id="show-make-bucket"
                className="feba-btn feba-bucket"
                onClick={e => {
                  e.preventDefault()
                  showMakeBucketModal()
                }}
              >
                <i className="far fa-hdd" />
              </a>
            </OverlayTrigger>
          )}
        </Dropdown.Menu>
      </Dropdown>
    )
  } else {
    return <noscript />
  }
}

const mapStateToProps = state => {
  return {
    prefixWritable: getPrefixWritable(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    uploadFile: file => dispatch(uploadsActions.uploadFile(file)),
    showMakeBucketModal: () => dispatch(actionsBuckets.showMakeBucketModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainActions)

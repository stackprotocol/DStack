import React from "react"
import { connect } from "react-redux"
import ClickOutHandler from "react-onclickout"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { getCurrentBucket } from "../buckets/selectors"
import * as actionsObjects from "./actions"
import * as actionsBuckets from "../buckets/actions"

export class Path extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
      path: ""
    }
  }
  stopEditing() {
    this.setState({
      isEditing: false
    })
  }
  onPrefixClick(e, prefix) {
    e.preventDefault()
    const { selectPrefix } = this.props
    selectPrefix(prefix)
  }
  onEditClick(e) {
    e.preventDefault()
    const { currentBucket, currentPrefix } = this.props
    this.setState(
      {
        isEditing: true,
        path: `${currentBucket}/${currentPrefix}`
      },
      () => {
       
        this.pathInput.focus()
        this.pathInput.setSelectionRange(
          this.state.path.length,
          this.state.path.length
        )
      }
    )
  }
  onKeyDown(e) {
   
    if (e.keyCode === 27) {
      this.stopEditing()
    }
  }
  onInputClickOut() {
    this.stopEditing()
  }
  bucketExists(bucketName) {
    const { buckets } = this.props
    return buckets.includes(bucketName)
  }
  async onSubmit(e) {
    e.preventDefault()
    const { makeBucket, selectBucket } = this.props
   
    let path = this.state.path
    if (!path.endsWith("/")) {
      path += "/"
    }
    const splittedPath = path.split("/")
    if (splittedPath.length > 0) {
     
      if (splittedPath[0]) {
        const bucketName = splittedPath[0]
        const prefix = splittedPath.slice(1).join("/")
        if (!this.bucketExists(bucketName)) {
          await makeBucket(bucketName)
        }
       
        if (this.bucketExists(bucketName)) {
         
          selectBucket(bucketName, prefix)
        }
        this.stopEditing()
      }
    }
  }
  render() {
    const pathTooltip = <Tooltip id="tt-path">Choose or create new path</Tooltip>
    const { currentBucket, currentPrefix } = this.props
    let dirPath = []
    let path = ""
    if (currentPrefix) {
      path = currentPrefix.split("/").map((dir, i) => {
        if (dir) {
          dirPath.push(dir)
          let dirPath_ = dirPath.join("/") + "/"
          return (
            <span key={i}>
              <a href="" onClick={e => this.onPrefixClick(e, dirPath_)}>
                {dir}
              </a>
            </span>
          )
        }
      })
    }
    return (
      <h2>
        {this.state.isEditing ? (
          <ClickOutHandler onClickOut={() => this.onInputClickOut()}>
            <form onSubmit={e => this.onSubmit(e)}>
              <input
                className="form-control form-control--path"
                type="text"
                placeholder="Choose or create new path"
                ref={node => (this.pathInput = node)}
                onKeyDown={e => this.onKeyDown(e)}
                value={this.state.path}
                onChange={e => this.setState({ path: e.target.value })}
              />
            </form>
          </ClickOutHandler>
        ) : (
          <React.Fragment>
            <span className="main">
              <a href="" onClick={e => this.onPrefixClick(e, "")}>
                {currentBucket}
              </a>
            </span>
            {path}
            <OverlayTrigger placement="bottom" overlay={pathTooltip}>
              <a href="" onClick={e => this.onEditClick(e)} className="fe-edit">
                <i className="fas fa-folder-plus" />
              </a>
            </OverlayTrigger>
          </React.Fragment>
        )}
      </h2>
    )
  }
}

const mapStateToProps = state => {
  return {
    buckets: state.buckets.list,
    currentBucket: getCurrentBucket(state),
    currentPrefix: state.objects.currentPrefix
  }
}

const mapDispatchToProps = dispatch => {
  return {
    makeBucket: bucket => dispatch(actionsBuckets.makeBucket(bucket)),
    selectBucket: (bucket, prefix) =>
      dispatch(actionsBuckets.selectBucket(bucket, prefix)),
    selectPrefix: prefix => dispatch(actionsObjects.selectPrefix(prefix))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Path)

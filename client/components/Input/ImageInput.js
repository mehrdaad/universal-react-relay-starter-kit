import React from 'react'
import PropTypes from 'prop-types'
import { HOC } from 'formsy-react'
import S3Uploader from 'react-s3-uploader'

import Button from '../Button'

class FileInput extends React.Component {
  static propTypes = {
    setValue: PropTypes.func.isRequired,
    label: PropTypes.node,
    fullWidth: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.object,
  }

  static defaultProps = {
    label: null,
    fullWidth: false,
    style: null,
  }

  constructor() {
    super()
    this.state = {
      fileKey: null,
      imageSrc: null,
    }
  }

  onUploadStart = (file, next) => {
    console.log('upload start')
    next(file)
  }

  onUploadProgress = (percent, message) => {
    console.log('upload progress', percent, message)
  }

  onUploadError = (message) => {
    console.log('upload error', message)
  }

  onUploadFinish = ({ fileKey, publicUrl }) => {
    console.log('upload finish', ...arguments)
    const imageSrc = publicUrl.replace('/s3/', '/image/')
    this.setState({ fileKey, imageSrc })
    this.props.setValue({ fileKey, imageSrc })
  }

  render() {
    return (
      <div style={this.props.style}>
        <Button
          label={this.state.file ? this.state.file.name : this.props.label}
          fullWidth={this.props.fullWidth}
          onClick={this.openDialog}
        />

        <div
          style={{
            width: '100%',
            height: 'auto',
            marginTop: 20,
            display: this.state.imageSrc ? 'block' : 'none',
          }}
        >
          <img
            style={{ width: '100%' }}
            src={this.state.imageSrc}
            alt={this.state.file ? this.state.file.name : 'new image'}
          />
        </div>

        <S3Uploader
          signingUrl="/image/sign"
          signingUrlMethod="GET"
          accept="image/*"
          preprocess={this.onUploadStart}
          onProgress={this.onUploadProgress}
          onError={this.onUploadError}
          onFinish={this.onUploadFinish}
          uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}  // this is the default
          contentDisposition="auto"
          scrubFilename={filename => filename.replace(/[^\w\d_\-.]+/ig, '')}
          signingUrlWithCredentials
        />
      </div>
    )
  }
}

export default HOC(FileInput)
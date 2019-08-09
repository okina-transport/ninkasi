import React from 'react';
import Dropzone from 'react-dropzone';
import Button from 'muicss/lib/react/button';
import Progress from 'react-progressbar';
import rolesParser from "../roles/rolesParser";
import {connect} from "react-redux";

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      user: '',
      description: ''
    };
  }

  handleOnDrop(acceptedFiles, user) {
    if (acceptedFiles.length) {
      var arrayFile = Array.from(acceptedFiles);
      this.setState({
        files: arrayFile,
        user: user.tokenParsed.preferred_username
      });
    }
  }

  handleDescription(description){
    this.setState({
      description: description
    });
  }

  render() {
    const dropStyle = {
      height: '150px',
      borderWidth: 1,
      borderColor: '#666',
      borderStyle: 'dashed',
      borderRadius: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };

    const filesStyle = {
      marginTop: '5%',
      minHeight: '300px',
      maxHeight: '300px'
    };

    const uploadButtonStyle = {
      width: 100,
      fontSize: '0.8em',
      textAlign: 'center',
      marginLeft: 'auto',
      marginTop: 10
    };

    const { files, user, description } = this.state;
    const { fileUploadProgress, handleFileUpload, kc } = this.props;

    return (
      <div>
        <div
            style={{
          maxWidth: '33%',
          height: '50px',
          border: '1px dashed #666',
          borderRadius: '2px',
          margin: '20px auto'
            }}>
          <input
              style={{
            marginLeft: '10px',
            marginTop: '15px',
              }}
              type="file" onChange={(e) => this.handleOnDrop(e.target.files, kc)}
          />
        </div>
        <div>
          <div
              style={{
                maxWidth: '33%',
                margin: '20px auto'
              }}>
            <div
                style={{
                  textTransform: 'uppercase',
                }}
            >Description (Facultatif)
            </div>
            <div
            style={{
              height: '125px'
            }}>
              <textarea
                  style={{
                    width: '100%',
                    height: '125px'
                  }}
                  disabled={!files.length}
                  onChange={(e) => this.handleDescription(e.target.value)}
              />
            </div>
            <Button
                disabled={!files.length}
                style={uploadButtonStyle}
                color="primary"
                onClick={() => files.length && handleFileUpload(files, user, description)}
            >
              Upload
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  kc: state.UserReducer.kc,
});

export default connect(mapStateToProps)(FileUpload);

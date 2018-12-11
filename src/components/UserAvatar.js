import React, { Component } from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';
import PropTypes from 'prop-types';

// import { Query, Mutation } from 'react-apollo';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';

const mapStateToProps = ({ user }) => {
  const props = {};
  if (user) {
    props.accessToken = user.access_token;
    props.myGcID = user.profile.sub;
  }
  return props;
};

class UserAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: '',
    };
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleUpload() {
    this.setState({ fileUrl: 'ha!' });
  }

  render() {
    const {
      myGcID,
      accessToken,
      edit,
      name,
      avatar,
      gcID,
    } = this.props;

    const canEdit = (accessToken !== '') && edit && (gcID === myGcID);

    const avatarComp = (canEdit) ? (
      <div>
        <div className="query">
          {(() => {
            if (avatar) {
                      return (
                        <div>
                          <img
                            src={avatar}
                            alt={name}
                          />
                        </div>
                      );
                    }
                    return (
                      <div>
                        No AVATAR
                      </div>
                    );
                    })()}

          <div className="mutate">
            <Button>
              <label htmlFor="avatarUploadTest">
                Upload
                {this.state.fileUrl}
                <input
                  type="file"
                  id="avatarUploadTest"
                  style={{ display: 'none' }}
                  required
                  onChange={({ target }) => {
               console.log(target.files[0]);
               this.handleUpload();
              }}
                />
              </label>
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <div>{(() => {
        if (avatar) {
                  return (
                    <div>
                      <img
                        src={avatar}
                        alt={name}
                      />
                    </div>
                  );
                }
                return (
                  <div>
                    No AVATAR
                  </div>
                );
                })()}
      </div>
    );
    return (
      <div>
        {avatarComp}
      </div>
    );
  }
}

export default connect(mapStateToProps)(LocalizedComponent(UserAvatar));

UserAvatar.defaultProps = {
  edit: false,
  name: 'No photo',
  gcID: '',
  accessToken: '',
  myGcID: '',
  avatar: 'https://avatars0.githubusercontent.com/u/7603237?s=460&v=4',
};

UserAvatar.propTypes = {
  edit: PropTypes.bool,
  gcID: PropTypes.string,
  name: PropTypes.string,
  avatar: PropTypes.string,
  accessToken: PropTypes.string,
  myGcID: PropTypes.string,
};

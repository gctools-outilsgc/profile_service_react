/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';


const style = {
  active: {
    position: 'fixed',
    display: 'block',
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0',
    zIndex: '999',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
};

class LoadingOverlay extends React.Component {
  render() {
    const {
      active,
      message,
    } = this.props;
    return (
      <div style={active ? style.active: {display:'none'}}>
        <span className="alert alert-info">
          {message}
        </span>
      </div>
    );
  }
}

LoadingOverlay.defaultProps = {
  active: false,
  message: 'Loading...',
};

LoadingOverlay.propTypes = {
  active: PropTypes.bool,
  message: PropTypes.string,
};

export default LocalizedComponent(LoadingOverlay);

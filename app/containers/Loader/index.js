import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoadingIndicator from 'components/LoadingIndicator';

export function Loader(props) {
  const { loading } = props;
  return (
    loading && <LoadingIndicator />
  );
}

Loader.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  loading: state.get('global').get('ui').get('loading'),
});

export default connect(mapStateToProps, null)(Loader);

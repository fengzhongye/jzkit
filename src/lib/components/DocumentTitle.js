import React from 'react';
import PropTypes from 'prop-types';
import withSideEffect from './side-effect';

function reducePropsToState(propsList){
  let innermostProps = propsList[propsList.length - 1];
  if(innermostProps){
    return innermostProps.title;
  }
}

function handleStateChangeOnClient(title){
  let nextTitle = title || '';
  if(nextTitle !== document.title){
    document.title = nextTitle;
  }
}

const propTypes = {
  title: PropTypes.string.isRequired
};

class DocumentTitle extends React.PureComponent{
  render(){
    if(this.props.children){
      return React.Children.only(this.props.children);
    } else {
      return null;
    }
  }
}
DocumentTitle.propTypes = propTypes;
DocumentTitle.displayName = 'DocumentTitle';
export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(DocumentTitle);

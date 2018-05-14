import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import values from 'lodash/values';

const propTypes = {
  componentName: PropTypes.string,
  type: PropTypes.oneOf(['button', 'reset', 'submit']),
  block: PropTypes.bool,
  href: PropTypes.string,
  disabled: PropTypes.bool,
  prefixClass: PropTypes.string
}

const defaultProps = {
  componentName: 'button',
  disabled:false,
  block:false,
  prefixClass: 'jz-button',
  href: null,
  type: 'button',
}

class Button extends React.PureComponent {
  getClassNames(){
    const {
      block,
      className,
      prefixClass
    } = this.props;
    return classNames({
      'jz-button': true,
      [`${prefixClass}-block`]: block
    }, className);
  }
  renderButton(){
    // 解构赋值
    let {
      disabled,
      componentName: Component,
      type,
      ...props
    } = this.props;
    const elementProps = omit(props, Object.keys(propTypes));
    return (
      <Component {...elementProps} disabled={disabled} type={type} className={this.getClassNames()}/>
    )
  }
  render() {
    return this.renderButton();
  }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;

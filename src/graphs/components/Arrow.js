import geometryUtils from 'elements/geometry-utils';
import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'components/CustomPropTypes';

export default class Arrow extends React.Component {
  static propTypes = {
    to: CustomPropTypes.position.isRequired,
    color: PropTypes.string,
    thickness: PropTypes.number,
    angle: PropTypes.number,
  };

  static defaultProps = {
    color: '#c7c7c7',
    thickness: 1,
    angle: 0,
  };

  render() {
    const { to, color, thickness, angle } = this.props;
    const angleInDegrees = geometryUtils.radiansToDegrees(angle);
    return (
      <path
        d={`M${to.x} ${to.y} l -10 -5 z l -10 5 z`}
        stroke={color}
        strokeWidth={thickness}
        transform={`rotate(${angleInDegrees} ${to.x} ${to.y})`}
      />
    );
  }
};

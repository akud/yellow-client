import React from 'react';
import PropTypes from 'prop-types';
import CircleDefinition from '../CircleDefinition';
import ElementProps from './ElementProps';

import logging from '@akud/logging';

const LOGGER = new logging.Logger('Circle');

export default class Circle extends React.Component {
  static propTypes = Object.assign(
    {
      color: PropTypes.string,
      radius: PropTypes.number,
    },
    ElementProps.BasePropTypes
  );

  static defaultProps = Object.assign(
    {
      color: '#4286f4',
      radius: 10,
    },
    ElementProps.DefaultBaseProps
  );

  componentDidMount() {
    const { id, registerShape, radius } = this.props;
    registerShape(id, new CircleDefinition({ radius }));
  }

  render() {
    const { color, radius, position, id } = this.props;
    return (
      <circle
        r={radius}
        fill={color}
        cx={position.x}
        cy={position.y}
        data-element-id={id}
      />
    );
  }
}

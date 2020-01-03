import React from 'react';
import PropTypes from 'prop-types';

import Node from './Node';
import Circle from '../elements/Circle';

export default class CircleNode extends React.Component {
  static propTypes = {
    nodeId: PropTypes.string.isRequired,
    color: PropTypes.string,
    radius: PropTypes.number,
    link: PropTypes.string,
  };

  static defaultProps = {
    color: '#4286f4',
    radius: 10,
    link: '',
  }

  render() {
    const { color, radius, nodeId, link } = this.props;
    return (
      <Node nodeId={nodeId} link={link}>
        <Circle color={color} radius={radius} />
      </Node>
    );
  }
}

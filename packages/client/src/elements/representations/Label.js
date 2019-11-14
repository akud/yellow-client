import React from 'react';
import RectangleDefinition from '../RectangleDefinition';
import PropTypes from 'prop-types';

import ElementGroup from './ElementGroup';
import ElementProps from './ElementProps';

import logging from '@akud/logging';

const LOGGER = new logging.Logger('Label');

export default class Label extends React.Component {
  static propTypes = Object.assign(
    {
      text: PropTypes.string.isRequired,
      padding: PropTypes.number,
      border: PropTypes.bool,
    },
    ElementProps.BasePropTypes
  );

  static defaultProps = Object.assign(
    {
      padding: 0,
      border: false,
    },
    ElementProps.DefaultBaseProps
  );

  refCallback = element => {
    if (element) {
      const { id, registerShape, padding } = this.props;
      const rect = element.getBoundingClientRect();
      this.setState({ width: rect.width, height: rect.height });
      registerShape(id, new RectangleDefinition({
        width: rect.width + padding,
        height: rect.height + padding,
      }));
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  render() {
    const { id, position, border, config, text, padding } = this.props;
    const { width, height } = this.state;
    const x = position.x - width / 2;
    const y = position.y + height / 4;
    return (
      <ElementGroup className="label" data-element-id={id}>
        { border && this.renderBorder({ position, width, height, padding }) }
        <text x={x} y={y} ref={this.refCallback}>{text}</text>
      </ElementGroup>
    );
  }

  renderBorder({ position, width, height, padding }) {
    width = width + padding;
    height = height + padding;
    const x = position.x - width / 2;
    const y = position.y - height / 2;
    return <rect x={x} y={y} width={width} height={height} stroke="black" fillOpacity={0} />;
  }
}

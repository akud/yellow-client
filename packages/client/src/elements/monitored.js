import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';

import RectangleDefinition from './geometry/RectangleDefinition';
import PointDefinition from './geometry/PointDefinition';

import ElementGroup from './ElementGroup';
import ElementProps from './ElementProps';
import ElementPropTypes from './ElementPropTypes';
import ElementContext from './ElementContext';
import WindowContext from './WindowContext';

import monitorElementShape from './geometry/monitor-element-shape';

import utils from '../utils';

/**
 * Higher-Order Component that wraps a component and monitors the svg element shape
 */
export default (ComponentClass) => {
  class MonitoredComponentClass extends React.Component {
    static contextType = ElementContext;

    static propTypes = Object.assign(
      {},
      ElementProps.BasePropTypes,
      utils.filterKeys(
        ComponentClass.propTypes,
        'width',
        'height',
        ...Object.keys(ElementProps.BasePropTypes)
      )
    );

    static defaultProps = Object.assign(
      {},
      ElementProps.DefaultBaseProps,
      utils.filterKeys(
        ComponentClass.defaultProps,
        'width',
        'height',
        ...Object.keys(ElementProps.DefaultBaseProps)
      )
    );

    constructor(props) {
      super(props);
      this.shapeRef = React.createRef();
      this.state = {
        width: 0,
        height: 0,
      };
    }

    componentDidMount() {
      this.shapeMonitor = monitorElementShape(
        this.shapeRef,
        ({ width, height }) => {
          this.setState({ width, height });
          this.registerShape({ width, height })
        }
      );
    }

    componentWillUnmount() {
      if (this.shapeMonitor) {
        this.shapeMonitor.stop();
      }
    }

    render() {
      return (
        <WindowContext.Consumer>
          {
            (windowContext) => {
              const { width, height } = this.determineSize(windowContext);
              return (
                <ComponentClass
                  width={width}
                  height={height}
                  shapeRef={this.shapeRef}
                  {...this.props}
                />
              );
            }
          }
        </WindowContext.Consumer>
      );
    }

    determineSize(windowContext) {
      if (this.state.width && this.state.height) {
        return {
          width: this.state.width,
          height: this.state.height,
        };
      } else {
        return {
          width: windowContext.width,
          height: windowContext.height,
        };
      }
    }

    registerShape({ width, height }) {
      const { registerShape } = this.context;
      const { id } = this.props;
      if (registerShape) {
        registerShape(id, this.constructShape({ width, height }));
      }
    }

    constructShape({ width, height }) {
      if (width && height) {
        return new RectangleDefinition({ width, height });
      } else {
        return new PointDefinition();
      }
    }
  }
  hoistNonReactStatic(MonitoredComponentClass, ComponentClass);
  return MonitoredComponentClass;
}


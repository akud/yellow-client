import React from 'react';
import PropTypes from 'prop-types';

import ForceSimulation from '../ForceSimulation';
import SimulationContext from './SimulationContext';
import SimulatedElement from './SimulatedElement';

import utils from '../../utils';

let contextIdSequence = 0;

export default class SimulatedLayout extends React.Component {
  static propTypes = {
    SimulationClass: PropTypes.func,
  }

  static defaultProps = {
    SimulationClass: ForceSimulation,
  }

  constructor(props) {
    super(props);
    this.contextId = 'simulation-context-' + (++contextIdSequence);

    const simulation = new props.SimulationClass().onNewLayout(
      s => this.setState({ contextValue: this.wrapSimulation(s) })
    );

    this.state = {
      contextValue: this.wrapSimulation(simulation)
    };
  }

  render() {
    const { children } = this.props;
    const { contextValue } = this.state;
    return (
      <SimulationContext.Provider value={contextValue}>
        {
          utils.makeArray(children).map((c, i) => {
            const id = c.props.id || this.contextId + '-' + i;
            return (
              <SimulatedElement
                id={id}
                key={id}
                onShapeRegistration={c.props.onShapeRegistration || (() => {})}
                render={({ position, velocity, registerShape }) => React.cloneElement(
                  c,
                  { position, velocity, registerShape }
                )}
              />
            );
          })
        }
      </SimulationContext.Provider>
    );
  }

  wrapSimulation(simulation) {
    return {
      contextId: this.contextId,
      registerElement: (elementId, shape) => simulation.registerElement(elementId, shape),
      getElementIds: () => simulation.getElementIds(),
      getElementData: elementId => simulation.getElementData(elementId),
      registerRule: (rule) => simulation.registerRule(rule),
      setRepellingForceStrength: (strength) => simulation.setRepellingForceStrength(strength),
    };
  }
}

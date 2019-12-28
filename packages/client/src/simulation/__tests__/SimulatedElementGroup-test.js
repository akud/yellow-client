jest.mock('../force/ForceSimulation');
jest.mock('../force/PositioningRules');
jest.mock('../force/LinkingRule');

import Orientation from '../Orientation';
import SimulatedElementGroup from '../SimulatedElementGroup';

import Circle from '../../elements/Circle';
import CircleDefinition from '../../elements/geometry/CircleDefinition';

import { createRelativePositioningRule } from '../force/PositioningRules';
import { createLinkingRule } from '../force/LinkingRule';
import MockSimulation, {
  getElementData,
  registerElement,
  registerRule,
  registerGroup,
  resetMockSimulation,
} from '../force/ForceSimulation'
import SimulationContext from '../SimulationContext';

import React from 'react';
import { mount } from 'enzyme';

describe('SimulatedElementGroup', () => {

  const newElementData = opts => Object.assign({
    position: newPosition(),
    velocity: newPosition(),
    shape: new CircleDefinition({ radius: 4 }),
  }, opts);

  beforeEach(() => {
    resetMockSimulation();
    createRelativePositioningRule.mockReset();
    createLinkingRule.mockReset();
    getElementData.mockImplementation(newElementData);
  });

  it('registers children in the simulation and passes data to them', () => {
    const elementData = newElementData();

    getElementData.mockReturnValue(elementData);

    const wrapper = mount(
      <SimulationContext.Provider value={new MockSimulation()}>
        <SimulatedElementGroup id='2'>
          <Circle radius={4.5}/>
        </SimulatedElementGroup>
      </SimulationContext.Provider>
    );

    expect(wrapper.find('Circle').length).toBe(1);
    expect(wrapper.find('Circle').prop('position')).toEqual(elementData.position);
    expect(wrapper.find('Circle').prop('id')).toEqual('2-primary');

    expect(getElementData).toHaveBeenCalledOnceWith('2-primary');
    expect(registerElement).toHaveBeenCalledOnceWith(
      '2-primary', new CircleDefinition({ radius: 4.5 })
    );
  });

  it('assigns element ids to children based on orientation', () => {
    const primaryElement = newElementData();
    const subElement1 = newElementData();
    const subElement2 = newElementData();

    getElementData.mockImplementation((elementId) => ({
      '2-0': subElement1,
      '2-primary': primaryElement,
      '2-2': subElement2,
    })[elementId]);

    const wrapper = mount(
      <SimulationContext.Provider value={new MockSimulation()}>
        <SimulatedElementGroup id='2'>
          <Circle radius={1} orientation={Orientation.TOP_LEFT} />
          <Circle radius={2} orientation={Orientation.PRIMARY} />
          <Circle radius={3} orientation={Orientation.TOP_RIGHT} />
        </SimulatedElementGroup>
      </SimulationContext.Provider>
    );

    expect(wrapper.find('Circle').length).toBe(3);

    expect(wrapper.find('Circle').at(0).prop('position')).toEqual(subElement1.position);
    expect(wrapper.find('Circle').at(1).prop('position')).toEqual(primaryElement.position);
    expect(wrapper.find('Circle').at(2).prop('position')).toEqual(subElement2.position);

    expect(wrapper.find('Circle').at(0).prop('id')).toEqual('2-0');
    expect(wrapper.find('Circle').at(1).prop('id')).toEqual('2-primary');
    expect(wrapper.find('Circle').at(2).prop('id')).toEqual('2-2');

    expect(getElementData).toHaveBeenCalledWith('2-0');
    expect(getElementData).toHaveBeenCalledWith('2-primary');
    expect(getElementData).toHaveBeenCalledWith('2-2');

    expect(registerElement).toHaveBeenCalledWith(
      '2-0', new CircleDefinition({ radius: 1 })
    );
    expect(registerElement).toHaveBeenCalledWith(
      '2-primary', new CircleDefinition({ radius: 2 })
    );
    expect(registerElement).toHaveBeenCalledWith(
      '2-2', new CircleDefinition({ radius: 3 })
    );
    expect(registerElement).toHaveBeenCalledTimes(3);
  });

  it('can infer the primary element', () => {
    const primaryElement = newElementData();
    const subElement1 = newElementData();
    const subElement2 = newElementData();

    getElementData.mockImplementation((elementId) => ({
      'inferred-0': subElement1,
      'inferred-primary': primaryElement,
      'inferred-2': subElement2,
    })[elementId]);

    const wrapper = mount(
      <SimulationContext.Provider value={new MockSimulation()}>
        <SimulatedElementGroup id='inferred'>
          <Circle radius={1} orientation={Orientation.TOP_LEFT} />
          <Circle radius={2} />
          <Circle radius={3} orientation={Orientation.TOP_RIGHT} />
        </SimulatedElementGroup>
      </SimulationContext.Provider>
    );

    expect(wrapper.find('Circle').length).toBe(3);

    expect(wrapper.find('Circle').at(0).prop('position')).toEqual(subElement1.position);
    expect(wrapper.find('Circle').at(1).prop('position')).toEqual(primaryElement.position);
    expect(wrapper.find('Circle').at(2).prop('position')).toEqual(subElement2.position);

    expect(wrapper.find('Circle').at(0).prop('id')).toEqual('inferred-0');
    expect(wrapper.find('Circle').at(1).prop('id')).toEqual('inferred-primary');
    expect(wrapper.find('Circle').at(2).prop('id')).toEqual('inferred-2');

    expect(getElementData).toHaveBeenCalledWith('inferred-0');
    expect(getElementData).toHaveBeenCalledWith('inferred-primary');
    expect(getElementData).toHaveBeenCalledWith('inferred-2');

    expect(registerElement).toHaveBeenCalledWith(
      'inferred-0', new CircleDefinition({ radius: 1 })
    );
    expect(registerElement).toHaveBeenCalledWith(
      'inferred-primary', new CircleDefinition({ radius: 2 })
    );
    expect(registerElement).toHaveBeenCalledWith(
      'inferred-2', new CircleDefinition({ radius: 3 })
    );
    expect(registerElement).toHaveBeenCalledTimes(3);
  });

  it('registers data with the simulation to set up element bindings', () => {
    const linkingRule1 = jest.fn();
    const linkingRule2 = jest.fn();
    const linkingRule3 = jest.fn();
    const relativePositioningRule1 = jest.fn();
    const relativePositioningRule2 = jest.fn();

    createLinkingRule
      .mockReturnValueOnce(linkingRule1)
      .mockReturnValueOnce(linkingRule2)
      .mockReturnValueOnce(linkingRule3);
    createRelativePositioningRule
      .mockReturnValueOnce(relativePositioningRule1)
      .mockReturnValueOnce(relativePositioningRule2);

    getElementData.mockImplementation((elementId) => ({
      'rules-0': newElementData({ shape: new CircleDefinition({ radius: 3 }) }),
      'rules-primary': newElementData({ shape: new CircleDefinition({ radius: 4 }) }),
      'rules-2': newElementData({ shape: new CircleDefinition({ radius: 5 }) }),
      'rules-3': newElementData({ shape: new CircleDefinition({ radius: 6 }) }),
    })[elementId]);

    const wrapper = mount(
      <SimulationContext.Provider value={new MockSimulation()}>
        <SimulatedElementGroup
          id='rules'
          bindingStrength={4.3}
        >
          <Circle radius={3} orientation={Orientation.TOP_LEFT} />
          <Circle radius={4} />
          <Circle radius={5} orientation={Orientation.TOP_RIGHT} />
          <Circle radius={6} />
        </SimulatedElementGroup>
      </SimulationContext.Provider>
    );

    expect(registerGroup).toHaveBeenCalledOnceWith(
      'rules', ['rules-0', 'rules-primary', 'rules-2', 'rules-3']
    );

    expect(registerRule).toHaveBeenCalledWith(
      'rules:link:rules-primary-rules-0', linkingRule1
    );
    expect(registerRule).toHaveBeenCalledWith(
      'rules:link:rules-primary-rules-2', linkingRule2
    );
    expect(registerRule).toHaveBeenCalledWith(
      'rules:link:rules-primary-rules-3', linkingRule3
    );
    expect(registerRule).toHaveBeenCalledWith(
      'rules:positioning:rules-primary-rules-0', relativePositioningRule1
    );
    expect(registerRule).toHaveBeenCalledWith(
      'rules:positioning:rules-primary-rules-2', relativePositioningRule2
    );
    expect(registerRule).toHaveBeenCalledTimes(5);

    expect(createLinkingRule).toHaveBeenCalledWith({
      between: ['rules-primary', 'rules-0'],
      distance: 7,
      strength: 4.3,
    });
    expect(createLinkingRule).toHaveBeenCalledWith({
      between: ['rules-primary', 'rules-2'],
      distance: 9,
      strength: 4.3,
    });
    expect(createLinkingRule).toHaveBeenCalledWith({
      between: ['rules-primary', 'rules-3'],
      distance: 10,
      strength: 4.3,
    });
    expect(createRelativePositioningRule).toHaveBeenCalledWith({
      baseElementId: 'rules-primary',
      targetElementId: 'rules-0',
      orientation: Orientation.TOP_LEFT,
    });
    expect(createRelativePositioningRule).toHaveBeenCalledWith({
      baseElementId: 'rules-primary',
      targetElementId: 'rules-2',
      orientation: Orientation.TOP_RIGHT,
    });
  });
});

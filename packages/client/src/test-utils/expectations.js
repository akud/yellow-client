const diff = require('jest-diff');

export const toHaveBeenCalledTimes = function(mock, n) {
  if (!this) { return; }
  const received = mock.mock.calls.length;

  const pass = this.isNot ? received !== n : received === n;

  return expectationResult.call(this, {
    expected: n,
    received,
    pass,
    name: 'toHaveBeenCalledTimes',
    description: n + ' calls',
  });
}

export const toHaveBeenCalledOnce = function(mock) {
  if (!this) { return; }
  const received = mock.mock.calls.length;

  const pass = this.isNot ? received !== 1 : received === 1;

  return expectationResult.call(this, {
    expected: 1,
    received,
    pass,
    name: 'toHaveBeenCalledOnce',
    description: 'one call',
  });
};

export const toHaveBeenCalledOnceWith = function(mock, ...expectedArgs) {
  if (!this) { return; }
  const callCount = mock.mock.calls.length;
  if (callCount !== 1) {
    return expectationResult.call(this, {
      expected: 1,
      received: callCount,
      pass: this.isNot ? true : false,
      name: 'toHaveBeenCalledOnceWith',
      description: 'one call with ' + this.utils.stringify(expectedArgs),
    });
  }

  const actualArgs = mock.mock.calls[0];

  return expectationResult.call(this, {
    expected: expectedArgs,
    received: actualArgs,
    pass: this.equals(expectedArgs, actualArgs),
    name: 'toHaveBeenCalledOnceWith',
    description: 'one call with ' + this.utils.stringify(expectedArgs),
  });
};

export const toAlmostEqual = function(received, expected, precision) {
  if (!this) { return; }

  precision = precision || 4;

  let pass;
  if (typeof expected == 'number') {
    pass = expected.toFixed(precision) === (received || 0).toFixed(precision);
  } else if (Array.isArray(expected)) {
    pass = expected.every(
      (element, index) => element.toFixed(precision) === (received || [])[index].toFixed(precision)
    );
  } else {
    pass = Object.keys(expected).every(
      (key) => expected[key].toFixed(precision) === (received || {})[key].toFixed(precision)
    );
  }

  pass = this.isNot ? !pass : pass;

  return expectationResult.call(this, {
    expected,
    received,
    pass,
    name: 'toAlmostEqual',
    description: 'almost ' + JSON.stringify(expected)
  });
}

const expectationResult = function({ expected, received, pass, name, description }) {
  const options = {
    comment: description,
    isNot: this.isNot,
    promise: this.promise,
  };

  const message = pass
    ? () =>
    this.utils.matcherHint(name, undefined, undefined, options) +
    '\n\n' +
    `Expected: ${this.utils.printExpected(expected)}\n` +
    `Received: ${this.utils.printReceived(received)}`
    : () => {
      const difference = diff(expected, received, {
        expand: this.expand,
      });
      return (
        this.utils.matcherHint(name, undefined, undefined, options) +
        '\n\n' +
        (difference && difference.includes('- Expect')
          ? `Difference:\n\n${difference}`
          : `Expected: ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`)
      );
    };

  return {actual: received, message, pass};
}


export default {
  toHaveBeenCalledTimes,
  toHaveBeenCalledOnce,
  toHaveBeenCalledOnceWith,
  toAlmostEqual,
}
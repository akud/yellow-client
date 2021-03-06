import utils from '../utils';

describe('utils', () => {
  describe('requireCondition', () => {
    it('throws if the condition is not met', () => {
      expectThrows(utils.requireCondition, [false, 'message'], 'message');
    });

    it('does nothing if the condition is met', () => {
      utils.requireCondition(true, 'hello');
    });
  });

  describe('requirePresent', () => {
    it('requires the argument to be present', () => {
      expectThrows(utils.requirePresent, ['name', undefined], 'Expected name to be present; got undefined.');
      expectThrows(utils.requirePresent, ['name', null], 'Expected name to be present; got null.');
      expectReturnsArgument(utils.requirePresent, ['name', 'asdf']);
    });

    it('handles only one argument', () => {
      expectHandlesOnlyOneArgument(utils.requirePresent, [
        { input: undefined, isValid: false},
        { input: null, isValid: false},
        { input: 'asdf', isValid: true},
      ]);
    });
  });

  describe('requireFunction', () => {
    it('requires the argument to be a function', () => {
      expectThrows(utils.requireFunction, ['name', undefined], 'Expected name to be a function; got undefined.');
      expectThrows(utils.requireFunction, ['name', null], 'Expected name to be a function; got null.');
      expectThrows(utils.requireFunction, ['name', 'asdf'], 'Expected name to be a function; got "asdf".');
      expectReturnsArgument(utils.requireFunction, ['name', function() {}]);
    });

    it('handles only one argument', () => {
      expectHandlesOnlyOneArgument(utils.requireFunction, [
        { input: undefined, isValid: false},
        { input: null, isValid: false},
        { input: 'asdf', isValid: false},
        { input: function() {}, isValid: true},
      ]);
    });
  });

  describe('requireArray', () => {
    it('requires the argument to be an array', () => {
      expectThrows(utils.requireArray, ['name', undefined], 'Expected name to be an array; got undefined.');
      expectThrows(utils.requireArray, ['name', 'asdf'], 'Expected name to be an array; got "asdf".');
      expectReturnsArgument(utils.requireArray, ['name', []]);
      expectReturnsArgument(utils.requireArray, ['name', ['1']]);
      expectReturnsArgument(utils.requireArray, ['name', ['1', '2']]);

      expectHandlesOnlyOneArgument(utils.requireArray, [
        { input: undefined, isValid: false},
        { input: 'asdf', isValid: false},
        { input: ['asdf'], isValid: true},
      ]);
    });
  });

  describe('requireArrayOfLength', () => {
    it('requires the argument to be an array of the specified length', () => {
      expectThrows(utils.requireArrayOfLength, ['name', undefined, 1], 'Expected name to be an array; got undefined.');
      expectThrows(utils.requireArrayOfLength, ['name', 'asdf', 1], 'Expected name to be an array; got "asdf".');
      expectThrows(utils.requireArrayOfLength, ['name', [], 1], 'Expected name to be an array of length 1; got [].');
      expectThrows(utils.requireArrayOfLength, ['name', ['1', '2'], 1], 'Expected name to be an array of length 1; got ["1","2"].');
      expectReturnsArgument(utils.requireArrayOfLength, ['name', ['1'], 1]);
      expectReturnsArgument(utils.requireArrayOfLength, [['1'], 1]);
    });
  });

  describe('requireOneOf', () => {
    it('requires the argument to be in the specified collection', () => {
      const allowedValues = [ 'asdf', 'hijk' ];

      expectThrows(utils.requireOneOf, [ 'asdf', ['a', 'b']], 'Expected argument to be one of ["a","b"]; got "asdf".');
      expectReturnsArgument(utils.requireOneOf, [ 'a', ['a', 'b']]);
    });
  });

  describe('requireInstanceOf', () => {
    it('requires the argument to be an instance of the supplied class', () => {
      expectThrows(utils.requireInstanceOf, ['asdf', Number]);
      expectReturnsArgument(utils.requireInstanceOf, [new Number(34), Number]);
    });
  });

  describe('requirePositionObject', () => {
    it('requires the argument to be a position object', () => {
      const allowedValues = [ 'asdf', 'hijk' ];

      expectThrows(utils.requirePositionObject, [ 'asdf' ], 'Expected argument to be a position object; got "asdf".');
      expectThrows(utils.requirePositionObject, [ { a: 'b' } ], 'Expected argument to be a position object; got {"a":"b"}.');
      expectReturnsArgument(utils.requirePositionObject, [{ x: 45, y: 345 }]);
    });
  });

  describe('requireGreaterThanZero', () => {
    it('requires the argument to be a number greater than zero', () => {
      expectThrows(utils.requireGreaterThanZero, [ 'asdf' ], 'Expected argument to be a number greater than zero; got "asdf".');
      expectThrows(utils.requireGreaterThanZero, [ -42 ], 'Expected argument to be a number greater than zero; got -42.');
      expectThrows(utils.requireGreaterThanZero, [ 0 ], 'Expected argument to be a number greater than zero; got 0.');
      expectReturnsArgument(utils.requireGreaterThanZero, [ 12 ]);
    });
  });

  describe('requireNonNegative', () => {
    it('requires the argument to be a number greater than or equal to zero', () => {
      expectThrows(utils.requireNonNegative, [ 'asdf' ], 'Expected argument to be a number greater than or equal to zero; got "asdf".');
      expectThrows(utils.requireNonNegative, [ -42 ], 'Expected argument to be a number greater than or equal to zero; got -42.');
      expectReturnsArgument(utils.requireNonNegative, [ 0 ]);
      expectReturnsArgument(utils.requireNonNegative, [ 12 ]);
    });
  });

  describe('requireBetween', () => {
    it('requires the argument to be a number in the specified range', () => {
      expectThrows(utils.requireBetween, [ 'asdf', 0, 5], 'Expected argument to be a number between 0 and 5; got "asdf".');
      expectThrows(utils.requireBetween, [ -42, 0, 10 ], 'Expected argument to be a number between 0 and 10; got -42.');
      expectReturnsArgument(utils.requireBetween, [ 1, 1, 10 ]);
      expectReturnsArgument(utils.requireBetween, [ 5, 1, 10 ]);
      expectReturnsArgument(utils.requireBetween, [ 10, 1, 10 ]);
      expectThrows(utils.requireBetween, [ 11, 0, 10 ], 'Expected argument to be a number between 0 and 10; got 11.');
    });
  });

  describe('makeArray', () => {
    it('returns the argument if it is an array', () => {
      expect(utils.makeArray(['a', 's', 'd', 'f'])).toEqual(['a', 's', 'd', 'f']);
    });

    it('wraps the argument if it is not an array', () => {
      expect(utils.makeArray({'a': 's', 'd': 'f'})).toEqual([{'a': 's', 'd': 'f'}]);
    });
  });

  describe('flatten', () => {
    it('flattens out nested arrays', () => {
      const input = [
        [ '1', '2', '3' ],
        '4',
        '5',
      ];
      expect(utils.flatten(input)).toEqual(['1', '2', '3', '4', '5']);
    });
  });

  describe('isWithin', () => {
    it('indicates if the two arguments are within the tolerance threshold of each other', () => {
      expect(utils.isWithin(4.5, 5.1, 0.75)).toBe(true);
      expect(utils.isWithin(5.1, 4.5, 0.75)).toBe(true);

      expect(utils.isWithin(4.5, 5.1, 0.5)).toBe(false);
      expect(utils.isWithin(5.1, 4.5, 0.5)).toBe(false);
    });
  });

  describe('filterKeys', () => {
    it('returns a copy of the object without the specified keys', () => {
      const original = {
        foo: 'bar',
        remove: 'this',
        filter: 'this too',
        keep: 'this'
      };
      const filtered = utils.filterKeys(original, 'remove', 'filter');
      expect(filtered).toEqual({ foo: 'bar', keep: 'this' });
      expect(original).toEqual({
        foo: 'bar',
        remove: 'this',
        filter: 'this too',
        keep: 'this'
      });
    });
  });

  const expectHandlesOnlyOneArgument = (func, testCases) => {
    testCases.forEach(testCase => {
      testCase = Object.assign(
        {},
        testCase,
        { input: [testCase.input] }
      );
      return expectHandlesTestCase(func, testCase)
    });
  };

  const expectHandlesTestCase = (func, testCase) => {
    if (testCase.isValid) {
      expectReturnsArgument(func, testCase.input);
    } else {
      expectThrows(func, testCase.input, testCase.message);
    }
  };

  const expectThrowsOnOneInput = (func, input, expectedMessage) => {
    expectThrows(func, [input], expectedMessage);
  }

  const expectThrows = (func, input, expectedMessage) => {
    if (!Array.isArray(input)) {
      input = [input];
    }
    expectedMessage = expectedMessage || 'Expected';
    const assertionError = `Expected an error containing '${expectedMessage}' on input ${input}`;
    expect(() => func(...input), assertionError).toThrow(expectedMessage);
  };

  const expectReturnsArgument = (func, input) => {
    if (!Array.isArray(input)) {
      input = [input];
    }

    const expected = hasNameArg(input) ? input[1] : input[0];
    const assertionErrorMessage = `Expected to return input value ${JSON.stringify(expected)} on input ${JSON.stringify(input)}`;
    expect(func(...input), assertionErrorMessage).toEqual(expected);
  };

  const hasNameArg = (input) => {
    return input.length >= 2 && input[0] === 'name';
  }
});

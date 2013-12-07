'use strict';

var arykow = {
  npm: require('../lib/arykow-npm.js')
};

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['list'] = {
  setUp: function(done) {
    done();
  },
  'success': function(test) {
    arykow.npm.list().addFilters('arykow', 'http').execute(function() {
      test.expect(6);

      var parameters = [];
      Array.prototype.push.apply(parameters, arguments);

      test.notEqual(parameters.length, 0, 'error should be defined.');
      var error = parameters.shift();
      test.equal(error, null, 'error should be null.');

      test.notEqual(parameters.length, 0, 'result should be defined.');
      var result = parameters.shift();
      test.notEqual(result, null, 'result should not be null.');

      test.equal(Object.keys(result).length, 1, '1 package should be listed.');

      test.equal(parameters.length, 0, 'other parameters should not be defined.');
      test.done();
    });
  },
  'failure': function(test) {
    arykow.npm.list().execute(function() {
      test.expect(5);

      var parameters = [];
      Array.prototype.push.apply(parameters, arguments);

      test.notEqual(parameters.length, 0, 'error should be defined.');
      var error = parameters.shift();
      test.equal(error, null, 'error should be null.');

      test.notEqual(parameters.length, 0, 'result should be defined.');
      var result = parameters.shift();
      test.notEqual(result, null, 'result should not be null.');

      test.equal(parameters.length, 0, 'other parameters should not be defined.');
      test.done();
    });
  },
};

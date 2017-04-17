/*!
 * bootprint <https://github.com/nknapp/bootprint>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

const util = require('../lib/util')

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-as-promised'))
const expect = chai.expect

describe('The utils:', function () {
  function nodeFn (value, callback) {
    if (value instanceof Error) {
      process.nextTick(callback(value))
    } else {
      process.nextTick(callback(null, value))
    }
  }

  describe('The c2b-function should return a callback that', function () {
    function testC2B (value) {
      return new Promise((resolve, reject) => nodeFn(value, util.c2p(resolve, reject)))
    }

    it('rejects a promise if the callback passes an error (as first argument)', function () {
      return expect(testC2B(new Error('some error'))).to.be.rejectedWith('some error')
    })

    it('resolves a promise if the callback passes `null` as first argument', function () {
      return expect(testC2B('abc')).to.eventually.deep.equal('abc')
    })
  })
})

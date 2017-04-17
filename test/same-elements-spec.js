/*!
 * bootprint <https://github.com/nknapp/bootprint>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

var chai = require('chai')
chai.use(require('dirty-chai'))
var expect = chai.expect
var sameElements = require('../lib/same-elements')

describe('The "same-elements" module', function () {
  it('should return true for to identical arrays', function () {
    let anArray = ['a', 'b', 'c']
    expect(sameElements(anArray, anArray)).to.be.true()
  })

  it('should return true for to equal arrays', function () {
    expect(sameElements(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.true()
  })

  it('should return true for to arrays that only differ in the order of elements', function () {
    expect(sameElements(['b', 'a', 'c'], ['a', 'b', 'c'])).to.be.true()
  })

  it('should return true for to arrays that only differ in the number of occurences of an element', function () {
    expect(sameElements(['b', 'a', 'a', 'c'], ['a', 'b', 'c'])).to.be.true()
  })

  it('should return false for arrays that have different elements', function () {
    expect(sameElements(['b', 'a', 'd'], ['a', 'b', 'c'])).to.be.false()
  })

  it('should return false for arrays that have missing elements', function () {
    expect(sameElements(['b', 'a', 'd'], ['a', 'b'])).to.be.false()
  })

  it('should return false for arrays that have additional elements', function () {
    expect(sameElements(['a', 'b'], ['b', 'a', 'd'])).to.be.false()
  })
})

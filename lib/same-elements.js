/**
 * Returns true, if both arrays contain the same elements
 * @param array1
 * @param array2
 */
function sameElements (array1, array2) {
  if (array1 === array2) {
    return true
  }
  var set1 = new Set(array1)
  var set2 = new Set(array2)

  if (set1.size !== set2.size) {
    return false
  }

  for (let item of set1) {
    if (!set2.has(item)) {
      return false
    }
  }
  return true
}

module.exports = sameElements

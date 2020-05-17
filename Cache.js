const flatCache = require('flat-cache')
// https://github.com/royriojas/flat-cache/issues/38
// https://gist.github.com/p1ho/1c7d81db13be872440699202fef1c474

module.exports = class Cache {
  constructor (name, path, cacheTime = 0) {
    this.name = name
    this.path = path
    this.cache = flatCache.load(name, path)
    this.expire = cacheTime === 0 ? false : cacheTime * 1000 * 60
  }
  getKey (key) {
    var now = new Date().getTime()
    var value = this.cache.getKey(key)
    if (value === undefined) {
      return undefined
    } else if (value.expire !== false && value.expire < now) {
        console.log('Cache value for ' + key + ' present but expired')
        this.cache.removeKey(key)
        return undefined
    } else {
      return value.data
    }
  }
  setKey (key, value) {
    var now = new Date().getTime()
    this.cache.setKey(key, {
      expire: this.expire === false ? false : now + this.expire,
      data: value
    })
  }
  removeKey (key) {
    this.cache.removeKey(key)
  }
  save () {
    this.cache.save(true)
  }
  remove () {
    flatCache.clearCacheById(this.name, this.path)
  }
};
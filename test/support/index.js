
const itt = (name, fn) => /^#skip/.test(name)
  ? it.skip(name, fn)
  : /^#only/.test(name)
    ? it.only(name, fn)
    : it(name, fn)

module.exports = { itt }

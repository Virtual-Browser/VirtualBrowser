const proxyCheck = require('advanced-proxy-checker')

module.exports.checkProxy = async function (proxyUrl) {
  const result = await proxyCheck.full(proxyUrl)

  return result
}

const path = require('path')

class FileAccessImpl {
  asFileUri(url) {
    return path.join(__dirname, '../../..', url)
  }
}

module.exports = {
  FileAccess: new FileAccessImpl()
}

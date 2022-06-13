
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./remark-plate.cjs.production.min.js')
} else {
  module.exports = require('./remark-plate.cjs.development.js')
}

'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"http://dev.kousensys.com/icappapi/v1/"',
  API_SIGNATURE_KEY: '"9d133961c41bb38dc4dd0b6d758af6d499dd2e96"',
  ROUTER_BASE: '"/ic_mobile/"',
  WXAPPID: '"wx38456ee91aa7a158"',
  SITE_URL: '"http://dev.kousensys.com/ic_mobile/"'
})

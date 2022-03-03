/**
 * downloads and processes a rss feed
 */
/* eslint-disable no-console */

const superagent = require('superagent')
const { toJs, toObj } = require('../promises')

const FEED_URL = 'https://news.ycombinator.com/rss'

const log = (arg) => console.log(JSON.stringify(arg, null, 2))

const main = async () => {
  const text = await superagent.get(FEED_URL).then(res => res.body.toString())
  const obj = await toJs(text)
  const simple = toObj(obj, { elems: false, attrs: false })

  log(text)
  log(obj)
  log(simple)
}

main().catch(console.error)

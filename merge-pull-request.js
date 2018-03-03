const fetch = require('node-fetch')
const ms = require('ms')
const argv = require('minimist')(process.argv.slice(2))
const pollFetch = require('./utils/pollFetch')

const branch = argv.b || argv.branch

if (!branch) {
  throw new Error('`branch` must be required `npm run create-pull-request -- -b $BRANCH`')
}

const baseOpts = {
  method: 'GET',
  timeout: 30000,
  headers: {
    Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
  },
}

let number

fetch(
  `https://api.github.com/repos/sugarshin/blog.sugarshin.net/pulls`,
  Object.assign(
    {},
    baseOpts,
    { body: JSON.stringify({ head: branch, base: 'master' }) }
  )
)
.then(res => res.json())
.then(pullRequests => {
  number = pullRequests.find(p => p.head.ref === branch).number
  return pollFetch(
    `https://api.github.com/repos/sugarshin/blog.sugarshin.net/pulls/${number}`,
    Object.assign({}, baseOpts),
    res => res.mergeable === true && res.mergeable_state === 'clean',
    ms('1m')
  )
})
.then(res => {
  return fetch(
    `https://api.github.com/repos/sugarshin/blog.sugarshin.net/pulls/${number}/merge`,
    Object.assign(
      {},
      baseOpts,
      { method: 'PUT' }
    )
  )
})
.then(res => res.json())
.then(json => {
  if (json.merged === true) {
    console.log(json.message)
  } else {
    throw json
  }
})
.catch(err => {
  throw new Error(err.message || 'pull request merging failed')
})

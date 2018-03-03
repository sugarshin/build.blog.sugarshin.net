const fetch = require('node-fetch')
const argv = require('minimist')(process.argv.slice(2))

const title = argv.t || argv.title
const branch = argv.b || argv.branch

if (!branch || !title) {
  throw new Error('`branch` and `title` must be required `npm run create-pull-request -- -b $BRANCH -t $TITLE`')
}

fetch(
  `https://api.github.com/repos/sugarshin/blog.sugarshin.net/pulls`,
  {
    method: 'POST',
    timeout: 10000,
    headers: {
      Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ title, head: branch, base: 'master' })
  }
)
.then(res => res.json())
.then(json => {
  console.log(`Successfully ${json.html_url}`)
})
.catch(err => {
  throw new Error('pull request creation failed')
})

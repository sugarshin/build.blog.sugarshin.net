const fetch = require('node-fetch')

const pollFetch = (url, options, comparator, timeout = 10000) => {
  let timerID
  return new Promise((resolve, reject) => {
    const f = () => {
      fetch(url, options)
      .then(res => res.json())
      .then(json => {
        if (comparator(json)) {
          clearTimeout(timerID)
          resolve(json)
        } else {
          timerID = setTimeout(() => {
            console.log('[INFO] retry...')
            f()
          }, timeout)
        }
      })
      .catch(err => {
        clearTimeout(timerID)
        reject(new Error(`${url} polling failed`))
      })
    }

    f()
  })
}

module.exports = pollFetch

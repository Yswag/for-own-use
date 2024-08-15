const api = 'https://api.zhconvert.org/convert'
const body = JSON.parse($response.body)
const lines = body.body.map((line) => line.content.replace(/\n/g, 'ykusu'))

convert(lines.join('\n'))
  .then((text) => {
    let newlines = text.split('\n')
    body.body.forEach((line, index) => {
      line.content = newlines[index].replace(/ykusu/g, '\n')
    })
    $done({ status: 200, body: JSON.stringify(body) })
  })
  .catch((error) => {
    console.error(error)
    $done({})
  })

function convert(text) {
  return new Promise((resolve, reject) => {
    const request = {
      url: api,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `converter=Taiwan&text=${encodeURIComponent(text)}`,
    }
    $httpClient.post(request, (error, response, data) => {
      if (error) {
        reject(error)
      } else {
        try {
          let obj = JSON.parse(data)
          let convertedText = obj.data.text
          resolve(convertedText)
        } catch (error) {
          reject(error)
        }
      }
    })
  })
}

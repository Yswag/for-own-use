if (typeof $request !== 'undefined') {
  let url = $request.url
  let b64 = url.split('/').pop()
  let obj = atob(b64)

  obj = JSON.parse(obj)

  $done({
    status: "HTTP/1.1 307 Temporary Redirect",
    headers: { "Location": obj.d.url },
  })
} else {
  console.log('csdn.req.js 用於 rewrite 重寫規則，勿直接運行)
  $done()
}

$persistentStore.write(null, 'tf_request_id')
let url = $request.url
let key = url.replace(/(.*accounts\/)(.*)(\/apps)/, '$2')
let session_id = $request.headers['X-Session-Id']
let session_digest = $request.headers['X-Session-Digest']
let request_id = $request.headers['X-Request-Id']
$persistentStore.write(key, 'tf_key')
$persistentStore.write(session_id, 'tf_session_id')
$persistentStore.write(session_digest, 'tf_session_digest')
$persistentStore.write(request_id, 'tf_request_id')
if ($persistentStore.read('tf_request_id') !== null) {
  $notification.post('請關閉本腳本', '信息獲取成功','')
} else {
  $notification.post('信息獲取失敗','請打開MITM H2開關並添加testflight.apple.com','')
}
$done({})
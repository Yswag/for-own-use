!(async () => {
ids = $persistentStore.read('APP_ID')
if (ids == '') {
	$notification.post('所有TF已加入完畢','模組已自動關閉','')
	$done($httpAPI('POST', '/v1/modules', {'AutoJoinTF': 'false'}))
} else {
	ids = ids.split(',')
	for await (const ID of ids) {
		await autoPost(ID)
	}
}
$done()
})();

function autoPost(ID) {
  let Key = $persistentStore.read('tf_key')
  let testurl = 'https://testflight.apple.com/v3/accounts/' + Key + '/ru/'
  let header = {
    'X-Session-Id': `${$persistentStore.read('tf_session_id')}`,
    'X-Session-Digest': `${$persistentStore.read('tf_session_digest')}`,
    'X-Request-Id': `${$persistentStore.read('tf_request_id')}`
  }
  return new Promise(function(resolve) {
    $httpClient.get({url: testurl + ID,headers: header}, function(error, resp, data) {
      if (error === null) {
        let jsonData = JSON.parse(data)
        if (jsonData.data.status == 'FULL') {
          console.log(ID + ' ' + jsonData.data.message)
          resolve();
        } else {
          $httpClient.post({url: testurl + ID + '/accept',headers: header}, function(error, resp, body) {
            let jsonBody = JSON.parse(body)
            $notification.post(jsonBody.data.name, 'TestFlight加入成功', '')
            console.log(jsonBody.data.name + ' TestFlight加入成功')
						ids = $persistentStore.read('APP_ID')
						ids = ids.split(',')
						ids.splice(ids.indexOf(ID), 1)
						ids = ids.toString()
						$persistentStore.write(ids,'APP_ID')
						resolve()
          });
        }
      } else {
        if (error =='The request timed out.') {
          resolve();
        } else {
          $notification.post('自動加入TF', error,'')
          console.log(ID + ' ' + error)
          resolve();
        }
      }
    })
  })
}
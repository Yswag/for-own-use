const { url } = $request
let headers
try {
	switch (true) {
		// 美劇星球播放防盜
		case url.includes('tencent-1257389134'):
			headers = getHeaders($response)
			headers['content-type'] = 'application/vnd.apple.mpegURL'
			$done({ headers: headers })
			break
		// 短劇天堂添加 referer
		case url.includes('api.emasmr.com'):
			headers = getHeaders($request)
			headers['user-agent'] =
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
			headers['referer'] = 'https://duanjutt.tv/'
			$done({ headers: headers })
			break
	}
} catch (e) {
	console.log(e)
}

function getHeaders(obj) {
	let headers = {}
	for (let key in obj.headers) {
		headers[key.toLowerCase()] = obj.headers[key]
	}
	return headers
}
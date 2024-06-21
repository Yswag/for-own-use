if (!$response.status === 200) $done({})
if ($response.body === undefined) $done({})

let body = JSON.parse($response.body)

// 直播頻道不修改
if (body.id === '2') $done({})

body.section[0].item = body.section[0].item.filter((e) => e.isVod === true)

//body.section.forEach((e) => {
// Banner輪播
//	if (e.title.includes('輪播')) {
//		let banners = e.item
//		let cleanItem = []
//		banners.forEach((e) => {
//			if (e.isVod === true) cleanItem.push(e)
//		})

//		e.item = cleanItem
//	}
//})

$done({ body: JSON.stringify(body) })

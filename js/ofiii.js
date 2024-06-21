if (!$response.status === 200) $done({})
if ($response.body === undefined) $done({})

let body = JSON.parse($response.body)

body.section.forEach((e) => {
	// Banner輪播
	if (e.sectionId === '1') {
		let banners = e.item
		let cleanItem = []
		banners.forEach((e) => {
			if (e.isVod === true) cleanItem.push(e)
		})

		e.item = cleanItem
	}
})

$done({ body: JSON.stringify(body) })
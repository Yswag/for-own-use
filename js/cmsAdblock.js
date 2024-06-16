// 海外看
let haiwaikan = [
	":16.0599,",
	":15.2666,",
	":15.1666,",
	":15.08,",
	":12.33,",
	":10.85,",
	":10.3333,",
	":10.106555,",
	//":10.100000,",
	":10.0099,",
	":8.641966,",
	":8.1748,",
	":7.907899,",
	":5.939267,",
	":5.538866,",
	":5.53,",
	":3.970633,",
	":3.937267,",
	":3.93,",
	":3.136466,",
	":3.103100,",
	":3.10,",
	":2.936266,",
	":2.602600,",
	":2.235567,",
	":2.002000,",
	":2.00,",
	":1.968633,",
	":1.96,",
	":1.36,",
	":1.334666,",
	":1.768432,",
	":1.368033,",
	":0.266932,",
	":0.26,",
	
	":2.002,",
	":3.937,",
	":1.968,",
	":0.266,",
	":10.100,",
];

// 量子資源
let lzzy = [];

// 非凡資源
let ffzy = [
	//":6.400000,",
	//":3.700000,",
	//":2.800000,",
	//":1.766667,",
];

// 暴風影視
let bfeng = ["/adjump/"];

// 快看影視
let kuaikan = [];

// ikun
let ikun = ['9898kb']

// 魔都
let modu = ['11425kb']

// 360
let lyhuicheng = ['11978kb']

// U酷資源
let ukzy = []

// 櫻花資源
let yhzy = []

// 91麻豆
let t097img = ['y.ts']

if ($response.body === undefined || !$response.body.includes('#EXTM3U')) $done({})

const url = $request.url
const lines = $response.body.split('\n')

let adCount = 0

switch (true) {
	case url.includes('m3u.haiwaikan'):
		hostsCount(haiwaikan, /^https?:\/\/(.*?)\//)
		filterAds(haiwaikan)
		break
	case url.includes('wgslsw'):
		hostsCount(yhzy, /^https?:\/\/(.*?)\//)
		filterAds(yhzy)
		break
	case url.includes('v.cdnlz'):
	case url.includes('lz-cdn'):
	case url.includes('lzcdn'):
		length()
		filterAds(lzzy)
		break
	case url.includes('ffzy'):
		length()
		filterAds(ffzy)
		break
	case url.includes('bfengbf.com'):
		filterAds(bfeng)
		break
	case url.includes('kuaikan'):
		hostsCount(kuaikan, /(.+)\/hls\//)
		filterAds(kuaikan)
		break
	case url.includes('bfikuncdn'):
		vodId(ikun, 15)
		filterAds(ikun)
		break
	case url.includes('modujx'):
		vodId(modu, 15)
		filterAds(modu)
		break
	case url.includes('lyhuicheng'):
		vodId(lyhuicheng, 15)
		filterAds(lyhuicheng)
		break
	case url.includes('ukzy'):
		vodId(ukzy, 15)
		filterAds(ukzy)
		break
	case url.includes('97img'):
		filterAds(t097img)
		break
    	case url.includes('askzy'):
	case url.includes('bfbfhao'):
	case url.includes('cl9987'):
	case url.includes('ykv3'):
	case url.includes('sybf'):
	case url.includes('bfnxxcdn'):
	case url.includes('huangguam3u'):
		vodId(ukzy, 15)
		filterAds(ukzy)
		break
	default:
		$done({})
		break
}

function filterAds(valuesToRemove) {
	for (let i = lines.length - 1; i >= 0; i--) {
		if (valuesToRemove.some((value) => lines[i].includes(value))) {
			let value = valuesToRemove.find((value) => lines[i].includes(value))
			console.log('Match:' + value)
			if (value.includes('kb')) {
				console.log('Remove ad(by bitrate):' + lines[i])
				lines.splice(i - 1, 2)
				adCount++
			} else if (!lines[i].startsWith('#')) {
				console.log('Remove ad(by url):' + lines[i])
				lines.splice(i - 1, 2)
				adCount++
			} else if (i < lines.length - 1 && lines[i + 1].endsWith('.ts')) {
				console.log('Remove ad(by duration):' + lines[i + 1])
				lines.splice(i, 2)
				adCount++
			}
		}
	}

	console.log(`移除廣告${adCount}行`)
	$done({ body: lines.join('\n') })
}

function hostsCount(name, regex) {
	const hostsCount = {}
	lines.forEach((line) => {
		if (line.includes('.ts')) {
			const hostname = line.match(regex)[1]
			hostsCount[hostname] = (hostsCount[hostname] || 0) + 1
		}
	})

	console.log(hostsCount)
	const keys = Object.keys(hostsCount)
	if (keys.length > 1) {
		keys.sort((a, b) => hostsCount[b] - hostsCount[a])
		let temp = keys.slice(1)
		name.push(...temp)
	} else return
}

function vodId(name, length) {
	const vodIds = {}
	lines.forEach((line) => {
		if (line.includes('.ts') || line.includes('.jpg')) {
			const vodId = line.slice(0, length)
			vodIds[vodId] = (vodIds[vodId] || 0) + 1
		}
	})
	console.log(vodIds)
	const keys = Object.keys(vodIds)

	if (keys.length > 1) {
		keys.sort((a, b) => vodIds[b] - vodIds[a])
		let temp = keys.slice(1)
		name.push(...temp)
	} else return
}

function length() {
	const fileLength = {}
	let files = lines.filter((i) => !i.startsWith('#'))

	files.forEach((file) => {
		fileLength[file.length] = (fileLength[file.length] || 0) + 1
	})
	console.log(fileLength)

	const keys = Object.keys(fileLength)
	if (keys.length > 1) {
		keys.sort((a, b) => fileLength[b] - fileLength[a])
		let ad = keys.slice(1)[0]
		console.log(ad)
		for (let i = lines.length - 1; i >= 0; i--) {
			if (lines[i].length == ad && lines[i].endsWith('.ts')) {
				console.log('Remove ad(by file length):' + lines[i])
				lines.splice(i - 1, 2)
				adCount++
			}
		}
	} else return
}
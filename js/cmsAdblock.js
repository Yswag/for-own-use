const haiwaikan = [
	":16.0599,",
	":15.2666,",
	":15.1666,",
	":15.08,",
	":12.33,",
	":10.85,",
	":10.3333,",
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
];

const lzzy = [
	":7.166667,",
	":7.041667,",
	//":4.800000,",
	":4.166667,",
	":2.833333,",
	":2.733333,",
	":2.500000,",
	":0.458333,",
];

const ffzy = [
	":6.400000,",
	":3.700000,",
	":2.800000,",
	":1.766667,",
];

const url = $request.url;
const lines = $response.body.split("\n");

let indexesToRemove = [];
let website = "";
let adCount = 0;

switch (true) {
	case url.includes("v.cdnlz"):
	case url.includes("lz-cdn"):
		filterAds(lzzy);
		removeAds();
		website = "量子資源";
		break;
	case url.includes("m3u.haiwaikan"):
		haiwaikanHostsCount();
		filterAds(haiwaikan);
		removeAds();
		website = "海外看";
		break;
	case url.includes("ffzy"):
		filterAds(ffzy);
		removeAds();
		website = "非凡資源";
		break;
	default:
		break;
}

function filterAds(valuesToRemove) {
	for (let i = lines.length - 1; i >= 0; i--) {
		if (valuesToRemove.some((value) => lines[i].includes(value))) {
			indexesToRemove.push(i);
		}
	}
}

function removeAds() {
	indexesToRemove.forEach((indexToRemove) => {
		if (indexToRemove !== -1 && lines[indexToRemove].endsWith(".ts")) {
			//hostname
			lines.splice(indexToRemove - 1, 2);
			adCount++;
		} else if (indexToRemove !== -1 && lines[indexToRemove + 1].endsWith(".ts")) {
			//duration
			lines.splice(indexToRemove, 2);
			adCount++;
		}
	});
}

function haiwaikanHostsCount() {
	const hostsCount = {};
	lines.forEach((line) => {
		if (line.includes(".ts")) {
			const hostname = new URL(line).hostname;
			hostsCount[hostname] = (hostsCount[hostname] || 0) + 1;
		}
	});

	const keys = Object.keys(hostsCount);
	if (keys.length >= 2) {
		haiwaikan.push(keys[1]);
	} else return;
}

console.log(`移除${website}廣告${adCount}行`);
$done({ body: lines.join("\n") });

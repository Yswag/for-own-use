let m3u8 = $response.body;
let lines = m3u8.split("\n");

// 需要移除的值
let valuesToRemove = [
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
	":3.970633,",
	":3.937267,",
	":3.136466,",
	":3.103100,",
	":2.936266,",
	":2.602600,",
	":2.235567,",
	":2.002000,",
	":1.968633,"
	":1.334666,",
	":1.768432,",
	":1.368033,",
	":0.266932,",
];

let indexesToRemove = [];
for (let i = lines.length - 1; i >= 0; i--) {
	if (valuesToRemove.some((value) => lines[i].includes(value))) {
		indexesToRemove.push(i);
	}
}

indexesToRemove.forEach((indexToRemove) => {
	// 其實下一行一定是ts吧
	if (indexToRemove !== -1 && lines[indexToRemove + 1].endsWith(".ts")) {
		lines.splice(indexToRemove, 2); // 移除該行和下一行的 .ts
	}
});

let modifiedM3u8 = lines.join("\n");

$done({ body: modifiedM3u8 });
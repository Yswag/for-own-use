let haha = JSON.parse($response.body);
let startTime = Date.now();
let currentIndex = 0;

// 每次發送的行數
const batchSize = 20;
// 最大併發請求數量
const maxRequests = 2;
let currentRequests = 0;

$notification.post("bilibilicc", "", "開始轉換");

// 主處理函數
async function processContent() {
	while (currentIndex < haha.body.length) {
		let requests = [];
		// 控制併發請求數量
		for (let i = 0; i < maxRequests && currentIndex < haha.body.length; i++) {
			let batch = haha.body.slice(currentIndex, currentIndex + batchSize);
			let originalContents = batch.map((item) => {
				// 將換行符 "\n" 替換為 "ykusu"
				return item.content.replace(/\n/g, "ykusu");
			});
			requests.push(translateBatch(originalContents, currentIndex));
			currentIndex += batchSize;
		}
		try {
			await Promise.all(requests); // 等待所有併發請求完成
		} catch (error) {
			console.log("Error: " + error);
		}
	}
	// 將 "ykusu" 替換回換行符 "\n"
	haha.body.forEach((item) => {
		item.content = item.content.replace(/ykusu/g, "\n");
	});
	// 所有內容處理完成後，輸出結果並結束
	let endTime = Date.now();
	let elapsedTime = (endTime - startTime) / 1000;
	$notification.post(
		"Bilibili簡轉繁",
		"用時：" + elapsedTime.toFixed(2) + "秒",
		"繁化結束，共處理：" + currentIndex + "行"
	);
	$done({ body: JSON.stringify(haha) });
}

async function translateBatch(texts, index) {
	return new Promise((resolve, reject) => {
		let apiUrl = "http://api.zhconvert.org/convert?converter=Taiwan&text=";
		let url = apiUrl + encodeURIComponent(texts.join("\n"));

		// 發送翻譯請求
		$httpClient.get(url, function (error, response, data) {
			if (error) {
				reject(error);
			} else {
				let result = JSON.parse(data);
				let translatedContents = result.data.text.split("\n");
				// 更新翻譯結果
				for (let i = 0; i < translatedContents.length; i++) {
					if (haha.body[index + i]) {
						haha.body[index + i].content = translatedContents[i];
					} else {
						console.log("Index out of range:", index + i);
					}
				}
				resolve(); // 完成翻譯請求
			}
		});
	});
}

processContent();

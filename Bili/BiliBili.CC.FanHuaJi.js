let haha = JSON.parse($response.body);
let startTime = Date.now();
let currentIndex = 0;
let activeRequests = 0;

const batchSize = 200;
const maxRequests = 10;

//$notification.post("bilibilicc", "", "開始轉換");

async function processContent() {
    while (currentIndex < haha.body.length || activeRequests > 0) {
        while (activeRequests < maxRequests && currentIndex < haha.body.length) {
            let batch = haha.body.slice(currentIndex, currentIndex + batchSize);
            let originalContents = batch.map((item) => {
                // 將換行符 "\n" 替換為無意義字
                return item.content.replace(/\n/g, "ykusu");
            });
            translateBatch(originalContents, currentIndex);
            currentIndex += batchSize;
            activeRequests++;
        }
        await delay(100); // 等待一小段時間，以避免過多的輪詢
    }
	// 將 "ykusu" 替換回換行符 "\n"
	haha.body.forEach((item) => {
		item.content = item.content.replace(/ykusu/g, "\n");
	});
	let endTime = Date.now();
	let elapsedTime = (endTime - startTime) / 1000;
	//$notification.post(
	//	"Bilibili簡轉繁",
	//	"用時：" + elapsedTime.toFixed(2) + "秒",
	//	"繁化結束，共處理：" + currentIndex + "行"
	//);
	$done({ body: JSON.stringify(haha) });
}

async function translateBatch(texts, index) {
    let apiUrl = "http://api.zhconvert.org/convert?converter=Taiwan&text=";
    let url = apiUrl + encodeURIComponent(texts.join("\n"));

    $httpClient.get(url, function (error, response, data) {
        if (error) {
            console.log("Error: " + error);
        } else {
            let result = JSON.parse(data);
            let translatedContents = result.data.text.split("\n");

            for (let i = 0; i < translatedContents.length; i++) {
                if (haha.body[index + i]) {
                    haha.body[index + i].content = translatedContents[i];
                } else {
                    console.log("Index out of range:", index + i);
                }
            }
        }
        activeRequests--;
    });
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

processContent();
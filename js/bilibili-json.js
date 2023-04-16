const url = $request.url;
const method = $request.method;
const notifyTitle = "bilibili-json";
console.log(`b站json-2023.04.16`);
if (!$response.body) {
	// 有undefined的情况
	console.log(`$response.body為undefined:${url}`);
	$done({});
}
if (method !== "GET") {
	$notification.post(notifyTitle, "method錯誤:", method);
}
let body = JSON.parse($response.body);

if (url.includes("x/resource/top/activity")) {
	// 活動icon
	if (body.data) {
		body.data.hash = "9453";
		body.data.online.icon = "";
	} else $done({});
} else if (!body.data) {
	console.log(url);
	console.log(`body:${$response.body}`);
	$notification.post(notifyTitle, url, "data字段錯誤");
} else {
	if (url.includes("x/v2/splash")) {
		console.log("開屏頁" + (url.includes("splash/show") ? "show" : "list"));
		if (!body.data.show) {
			// 有時候返回的數據没有show字段
			console.log("數據無show字段");
		} else {
			delete body.data.show;
			// console.log("成功");
		}
	} else if (url.includes("x/v2/account/mine")) {
		let newSet = new Set([396, 397, 398, 399, 410]);
		if (body.data?.sections_v2) {
			body.data.sections_v2.forEach((element, index) => {
				let items = element.items.filter((e) => newSet.has(e.id));
				body.data.sections_v2[index].button = {};
				body.data.sections_v2[index].tip_icon = "";
				body.data.sections_v2[index].be_up_title = "";
				body.data.sections_v2[index].tip_title = "";
				if (
					body.data.sections_v2[index].title === "推荐服务" ||
					body.data.sections_v2[index].title === "更多服务" ||
					body.data.sections_v2[index].title === "创作中心"
				) {
					body.data.sections_v2[index].title = "";
					body.data.sections_v2[index].type = "";
				}

				body.data.sections_v2[index].items = items;
				body.data.vip_section_v2 = "";
				body.data.vip_section = "";
				body.data.live_tip = "";
				body.data.answer = "";

				if (body.data.vip.status) {
					return false;
				} else {
					body.data.vip_type = 2;
					body.data.vip.type = 2;
					body.data.vip.status = 1;
					body.data.vip.vip_pay_type = 1;
					body.data.vip.due_date = 2208960000;
				}
			});
		}
	} else if (url.includes("resource/show/tab/v2")) {
		// console.log("tab修改");
		// 頂部右上角
		if (!body.data.top) {
			// console.log(`body:${$response.body}`);
			$notification.post(notifyTitle, "tab", "top字段錯誤");
		} else {
			body.data.top = body.data.top.filter((item) => {
				if (item.name === "游戏中心") {
					// console.log("去除右上角遊戲中心");
					return false;
				}
				return true;
			});
			fixPos(body.data.top);
		}
		// tab
		if (!body.data.tab) {
			// console.log(`body:${$response.body}`);
			$notification.post(notifyTitle, "tab", "tab字段錯誤");
		} else {
			const tabList = new Set([2036, 2037, 774, 801]);
			const tabNameList = new Set(["直播", "推薦", "韓綜", "動畫"]);
			let tab = body.data.tab.filter((e) => {
				return tabNameList.has(e.name) || tabList.has(e.id);
			});
			let newTab = [
				{
					id: 1050,
					icon: "http://i0.hdslb.com/bfs/archive/38d2c2669a68eae8a53fc9afaa193aafa5265a78.png",
					tab_id: "ive",
					name: "IVE",
					uri: "bilibili://pegasus/vertical/168073",
					pos: 3,
				},
				{
					id: 1272,
					icon: "http://i0.hdslb.com/bfs/archive/38d2c2669a68eae8a53fc9afaa193aafa5265a78.png",
					tab_id: "stayc",
					name: "STAYC",
					uri: "bilibili://pegasus/vertical/16961522",
					pos: 4,
				},
				{
					id: 1271,
					icon: "http://i0.hdslb.com/bfs/archive/38d2c2669a68eae8a53fc9afaa193aafa5265a78.png",
					tab_id: "le",
					name: "LESSERAFIM",
					uri: "bilibili://pegasus/vertical/25270553",
					pos: 5,
				},
			];
			tab.splice(2, 0, ...newTab);
			body.data.tab = tab;
			fixPos(body.data.tab);
		}
		// 底部tab欄
		if (!body.data.bottom) {
			// console.log(`body:${$response.body}`);
			$notification.post(notifyTitle, "tab", "bottom字段錯誤");
		} else {
			body.data.bottom = body.data.bottom.filter((item) => {
				if (item.name === "发布") {
					// console.log("去除發布");
					return false;
				} else if (item.name === "会员购") {
					// console.log("去除會員購");
					return false;
				}
				return true;
			});
			fixPos(body.data.bottom);
		}
	} else if (url.includes("x/v2/feed/index?")) {
		// console.log("推薦頁");
		let items = [];
		for (let i of body.data.items)
			if (!i.hasOwnProperty("banner_item")) {
				if (
					!(
						!i.hasOwnProperty("ad_info") &&
						-1 === i.card_goto?.indexOf("ad") &&
						["small_cover_v2", "large_cover_v1", "large_cover_single_v9"].includes(i.card_type)
					)
				)
					continue;
				else if (i.uri.includes("bilibili://story")) {
					i.uri = i.uri.replace("bilibili://story", "bilibili://video");
				} else items.push(i);
			}
		body.data.items = items;
	} else if (url.includes("x/v2/feed/index/story")) {
		let items = [];
		for (let i of body.data.items) i.hasOwnProperty("ad_info") || -1 !== i.card_goto.indexOf("ad") || items.push(i);
		body.data.items = items;
	} else if (url.includes("x/v2/account/myinfo")) {
		body.data.vip.type = 2;
		body.data.vip.status = 1;
		body.data.vip.vip_pay_type = 1;
		body.data.vip.due_date = 4669824160;
	} else if (url.includes("x/v2/search/square")) {
		body.data = body.data.filter((n) => n.type == "history");
	} else {
		$notification.post(notifyTitle, "路徑匹配錯誤:", url);
	}
}

body = JSON.stringify(body);
$done({ body });

function fixPos(arr) {
	for (let i = 0; i < arr.length; i++) {
		// 修復pos
		arr[i].pos = i + 1;
	}
}
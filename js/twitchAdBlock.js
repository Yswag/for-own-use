const url = $request.url;
const newURL = removeUrlParameter(removeUrlParameter(url, "token"), "sig"); // 移除網址中的敏感資訊
// ttv lol 的 api 需要 Twitch token 才能看 vod
const playlist = newURL.slice("https://usher.ttvnw.net/api/channel/hls/".length);

$httpClient.get("https://as.luminous.dev/ping", function (error, response, data) {
	if (response.status != 200) {
		$notification.post("Twitch去廣告", "", "伺服器異常，嘗試eu.luminous.dev...");
		$httpClient.get("https://eu.luminous.dev/ping", function (error, response, data) {
			if (response.status != 200) {
				$notification.post("Twitch去廣告", "", "luminous.dev伺服器異常，返回原始連結");
				$done({});
			} else if (response.status === 200) {
				let proxy = "https://eu.luminous.dev/playlist/" + encodeURIComponent(playlist);
				$done({ url: proxy });
			}
		});
	} else if (response.status === 200) {
		let proxy = "https://as.luminous.dev/playlist/" + encodeURIComponent(playlist);
		$done({
			url: proxy,
			
		});
	}
});

function removeUrlParameter(url, parameter) {
	let urlParts = url.split("?");
	if (urlParts.length >= 2) {
		let urlBase = urlParts.shift();
		let queryString = urlParts.join("?");
		let prefix = encodeURIComponent(parameter) + "=";
		let parts = queryString.split(/[&;]/g);
		for (let i = parts.length; i-- > 0; ) {
			if (parts[i].lastIndexOf(prefix, 0) !== -1) {
				parts.splice(i, 1);
			}
		}
		url = urlBase + "?" + parts.join("&");
	}
	return url;
}

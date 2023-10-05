const url = $request.url;
const newURL = removeUrlParameters(url, ["token", "sig", "p", "play_session_id"]); // 移除網址中的敏感資訊

if (url.includes("https://usher.ttvnw.net/api/channel/hls")) {
	const live = newURL.slice("https://usher.ttvnw.net/api/channel/hls/".length);
	$httpClient.get("https://eu.luminous.dev/ping", function (error, response) {
		if (response.status != 200) {
			$done({});
		} else {
			const proxy = `https://eu.luminous.dev/live/${encodeURIComponent(live)}`;
			$done({
				status: 302,
				headers: {
					Location: proxy,
				},
			});
		}
	});
} else if (url.includes("https://usher.ttvnw.net/vod")) {
	const vod = newURL.slice("https://usher.ttvnw.net/vod/".length);
	$httpClient.get("https://eu.luminous.dev/ping", function (error, response) {
		if (response.status != 200) {
			$done({});
		} else {
			const proxy = `https://eu.luminous.dev/vod/${encodeURIComponent(vod)}`;
			$done({
				status: 302,
				headers: {
					Location: proxy,
				},
			});
		}
	});
}

function removeUrlParameters(url, parameters) {
	let urlParts = url.split("?");
	if (urlParts.length >= 2) {
		let urlBase = urlParts.shift();
		let queryString = urlParts.join("?");
		let parts = queryString.split(/[&;]/g);
		parts = parts.filter((part) => {
			for (let j = 0; j < parameters.length; j++) {
				const parameter = parameters[j];
				let prefix = encodeURIComponent(parameter) + "=";
				if (part.lastIndexOf(prefix, 0) === 0) {
					return false;
				}
			}
			return true;
		});
		url = urlBase + "?" + parts.join("&");
	}
	return url;
}
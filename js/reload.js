!(async () => {
	let panel = { title: "Profile Reload" },
		showServer = true,
		dnsCache;
	if (typeof $argument != "undefined") {
		let arg = Object.fromEntries($argument.split("&").map((item) => item.split("=")));
		if (arg.title) panel.title = arg.title;
		if (arg.icon) panel.icon = arg.icon;
		if (arg.color) panel["icon-color"] = arg.color;
		if (arg.server == "false") showServer = false;
	}
	if (showServer) {
		dnsCache = (await httpAPI("/v1/dns", "GET")).dnsCache;
		dnsCache = [...new Set(dnsCache.map((d) => d.server))].toString().replace(/,/g, "\n");
	}
	if ($trigger == "button") {
		await httpAPI("/v1/profiles/reload");
		await httpAPI("/v1/dns/flush");
		$notification.post("Reload Profile", "配置重載成功，DNS 緩存已清理");
	}
	let delay = ((await httpAPI("/v1/test/dns_delay")).delay * 1000).toFixed(0);
	panel.content = `DNS delay: ${delay}ms${dnsCache ? `\nserver:\n${dnsCache}` : ""}`;
	$done(panel);
})();

function httpAPI(path = "", method = "POST", body = null) {
	return new Promise((resolve) => {
		$httpAPI(method, path, body, (result) => {
			resolve(result);
		});
	});
}

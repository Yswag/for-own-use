if ($response.status === 403 || $response.headers["cf-mitigated"] === "challenge") {
	flaresolverr();
} else $done({});

function flaresolverr() {
	let flaresolverrUrl = $argument;
	let request = {
		url: flaresolverrUrl,
		headers: {
			"Content-Type": "application/json",
		},
		body: {
			cmd: "request.get",
			url: $request.url,
			maxTimeout: 100000,
		},
		timeout: 30
	};
	$httpClient.post(request, function (error, response, data) {
		let body = JSON.parse(data);
		if (error) {
			console.log("error:" + error);
			$done({});
		} else if (body.status === "ok") {
			let cookies = "";
			$notification.post("flaresolverr", "Solved!", "");
			body.solution.cookies.forEach(function (k) {
				if (k.name == "cf_clearance") {
					cookies = k.name+"="+k.value;
				}
			});
			let response = {
				status: 200,
				headers: {
					"Set-Cookie": cookies,
				},
				body: body.solution.response,
			};
			$done(response);
		} else $done({});
	});
}

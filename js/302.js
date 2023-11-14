let url = $request.url;
let headers = $response.headers;

if ($response.status === 302) {
	$done({
		url: headers.Location,
	});
} else {
	$done({});
}
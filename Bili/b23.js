const obj = JSON.parse($response.body);
const regex = /https:\/\/b23\.tv\/\w+/;
const b23 = regex.exec(obj.data.content);
const b23wtf = $argument;
const request = {
	url: `${b23wtf}/api?full=${b23}&status=200`,
	headers: null
};

$httpClient.get(request,function(error, response, data){
	if (response.headers.hasOwnProperty("Location")) {
		obj.data.content = response.headers.Location;
		//$notification.post("b23","成功",response.headers.Location);
		$done({
			body: JSON.stringify(obj)
		});
	} else {
		$notification.post("error");
		$done({});
	}
});
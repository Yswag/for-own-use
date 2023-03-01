/*
作者：mieqq
  Surge 腳本實現 Qx 的 response-body、和request-body 重寫類型
  
  如 Qx：
https://service.ilovepdf.com/v1/user url response-body false response-body true
   
  可改寫為 Surge：
[Script] 
test = type=http-response,pattern=https://service.ilovepdf.com/v1/user,requires-body=1,script-path=https://raw.githubusercontent.com/mieqq/mieqq/master/replace-body.js, argument=false->true

argument=要匹配值=作為替換的值
支持正則：如argument=\w+->test
支持正則修飾符：如argument=/\w+/g->test
支持多參數，如：argument=匹配值1->替換值1&匹配值2->替換值2

支持改寫響應體和請求體（type=http-response 或 http-request）注意必須打開需要body（requires-body=1）

tips 
修改json格式的鍵值對可以這樣：
argument=("key")\s?:\s?"(.+?)"->$1: "new_value"

s修飾符可以讓.匹配換行符，如 argument=/.+/s->hello
  
*/

function getRegexp(re_str) {
	let regParts = re_str.match(/^\/(.*?)\/([gims]*)$/);
	if (regParts) {
		return new RegExp(regParts[1], regParts[2]);
	} else {
		return new RegExp(re_str);
	}
}
String.prototype.replaceAll = function(s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
}
let body;
if (typeof $argument == "undefined") {
	console.log("requires $argument");
} else {
	$argument = $argument.replaceAll("，，", ",")
	console.log($argument);
	if ($script.type === "http-response") {
		body = $response.body;
	} else if ($script.type === "http-request") {
		body = $request.body;
	} else {
		console.log("script type error");
	}
}

console.log($script.type)

if (body) {
	$argument.split("&").forEach((item) => {
		if (item) {
			try {
				let [match, replace] = item.split("->");
				let re = getRegexp(match);
				body = body.replaceAll(re, replace);
			} catch (e) {
				console.error(item)
				console.error(e)
			}
		}
	});
	$done({ body });
} else {
	console.log("Not Modify");
	$done({});
}
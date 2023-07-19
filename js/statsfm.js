/*
[Script]
statfm = type=http-response,pattern=^https?:\/\/api\.stats\.fm\/api\/v1\/me$,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Yswag/for-own-use/main/js/statsfm.js,script-update-interval=0

[MITM]
hostname = api.stats.fm
*/


let body = JSON.parse($response.body);
body.item.isPro = true;
body.item.isPlus = true;
body.item.hasSwipefy = true;
body.item.displayName = "栗子";
$done({body:JSON.stringify(body)});
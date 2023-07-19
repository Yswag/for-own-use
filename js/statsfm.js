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
body.item.customId = "kimgiwon04";
#body.item.profile.bio = "";
#body.item.profile.theme = "pink";
#body.item.image = "https:\/\/media.discordapp.net\/attachments\/1052344286676529152\/1100829429749530694\/b99069341754db48.png";
$done({body:JSON.stringify(body)});
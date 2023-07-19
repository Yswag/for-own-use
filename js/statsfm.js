/*
[Script]
statfm = type=http-response,pattern=^https?:\/\/api\.stats\.fm\/api\/v1\/me$,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Yswag/for-own-use/main/js/statsfm.js,script-update-interval=0

[MITM]
hostname = api.stats.fm
*/


let data = JSON.parse($response.body);
data.item.isPro = true;
data.item.isPlus = true;
data.item.hasSwipefy = true;
data.item.displayName = "iwannaknow你行不行";
data.item.customId = "kimgiwon_04";
#data.item.profile.bio = "";
#data.item.profile.theme = "pink";
#data.item.image = "https:\/\/media.discordapp.net\/attachments\/1052344286676529152\/1100829429749530694\/b99069341754db48.png";
$done({ body: JSON.stringify(data) });
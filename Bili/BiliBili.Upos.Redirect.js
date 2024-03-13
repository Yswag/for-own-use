const hk = [
	"cn-hk-eq-01-01.bilivideo.com",
	"cn-hk-eq-01-02.bilivideo.com",
	"cn-hk-eq-01-03.bilivideo.com",
	"cn-hk-eq-01-04.bilivideo.com",
	"cn-hk-eq-01-05.bilivideo.com",
	"cn-hk-eq-01-06.bilivideo.com",
	"cn-hk-eq-01-07.bilivideo.com",
	"cn-hk-eq-01-08.bilivideo.com",
	"cn-hk-eq-01-09.bilivideo.com",
	"cn-hk-eq-01-10.bilivideo.com",
	"cn-hk-eq-01-11.bilivideo.com",
	"cn-hk-eq-01-12.bilivideo.com",
	"cn-hk-eq-01-13.bilivideo.com",
];

let path = $request.url.split("/").slice(3).join("/");
let newHost = hk[Math.floor(Math.random() * hk.length)];
let newUrl = `http://${newHost}/${path}`;

$done({
	response: {
		status: 302,
		headers: {
			Location: newUrl,
		},
	},
});
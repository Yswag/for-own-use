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
];

let url = new URL($request.url);
let goodHost = hk[Math.floor(Math.random() * hk.length)];
let newUrl = url.toString().replace(url.host, goodHost);

$done({
	response: {
		status: 302,
		headers: {
			Location: newUrl,
		},
	},
});
var obj = {
  cacheExpirationDays: 365,
  message: 'Device Valid',
  "resultCode": 'GOOD'
};

var str = JSON.stringify(obj);

$done({ body: str, status: 200 });
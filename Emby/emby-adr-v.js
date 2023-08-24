var obj = {
  featId: '',
  registered: true,
  expDate: '2099-01-01',
  key: ''
};

var str = JSON.stringify(obj);

$done({ body: str, status: 200 });
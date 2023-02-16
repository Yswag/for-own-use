if ($response.body.includes("adEvents")) {
  let body = JSON.parse($response.body);
  switch (true) {
    case body.data.subredditInfoByName:
      body.data.subredditInfoByName.elements.edges = body.data.subredditInfoByName.elements.edges.filter((n) => !n.node.adEvents);
      break;
    case body.data.home:
      body.data.home.elements.edges = body.data.home.elements.edges.filter((n) => !n.node.adEvents);
      body.data.home.elements.edges = body.data.home.elements.edges.filter((n) => n.node.__typename !== "PostRecommendation");
      break;
  }
  $done({ body: JSON.stringify(body) });
} else {
  $done({});
}
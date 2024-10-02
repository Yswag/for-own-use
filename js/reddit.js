let body = JSON.parse($response.body)

for (let key in body.data) {
  let edges = body.data[key]?.elements?.edges

  if (edges) {
    edges = edges.filter((e) => {
      if (e.node.adPayload) {
        console.log('Remove feed Ads: ' + e.node.id)
        return false
      }
      return true
    })
    body.data[key].elements.edges = edges
  }
}

if (body.data?.children?.commentsPageAds?.length) {
  body.data.children.commentsPageAds = []
  console.log('Remove comment page Ads.')
}

$done({
  body: JSON.stringify(body),
})
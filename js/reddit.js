let body = JSON.parse($response.body)

switch (true) {
  // home
  case body.data.homeV3 !== undefined:
    let homeV3Edges = body.data.homeV3.elements.edges
    homeV3Edges = homeV3Edges.filter((e) => {
      if (e.node.adPayload) {
        console.log('Remove home feed Ads: ' + e.node.id)
        return false
      }
      return true
    })
    body.data.homeV3.elements.edges = homeV3Edges
    break

  case body.data.home !== undefined:
    let homeEdges = body.data.home.elements.edges
    homeEdges = homeEdges.filter((e) => {
      if (e.node.__typename === 'AdPost') {
        console.log('Remove home feed Ads: ' + e.node.id)
        return false
      }
      return true
    })
    body.data.home.elements.edges = homeEdges
    break

  case body.data.popularV3 !== undefined:
    let popularEdges = body.data.popularV3.elements.edges
    popularEdges = popularEdges.filter((e) => {
      if (e.node.adPayload) {
        console.log('Remove popular feed Ads: ' + e.node.id)
        return false
      }
      return true
    })
    body.data.popularV3.elements.edges = popularEdges
    break

  case body.data.newsV3 !== undefined:
    let newsEdges = body.data.newsV3.elements.edges
    newsEdges = newsEdges.filter((e) => {
      if (e.node.adPayload) {
        console.log('Remove news feed Ads: ' + e.node.id)
        return false
      }
      return true
    })
    body.data.newsV3.elements.edges = newsEdges
    break

  // subreddit
  case body.data.subredditV3 !== undefined:
    let subredditEdges = body.data.subredditV3.elements.edges
    subredditEdges = subredditEdges.filter((e) => {
      if (e.node.adPayload) {
        console.log('Remove subreddit feed Ads: ' + e.node.id)
        return false
      }
      if (e.node.communityRecommendations) {
        console.log('Remove community recommendations.')
        return false
      }
      return true
    })
    body.data.subredditV3.elements.edges = subredditEdges
    break

  // post
  case body.data.children?.commentsPageAds !== undefined:
    if (body.data.children.commentsPageAds.length) {
      body.data.children.commentsPageAds = []
      console.log('Remove comment page Ads.')
    }
    break

  default:
    break
}

$done({
  body: JSON.stringify(body),
})

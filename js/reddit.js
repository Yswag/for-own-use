let body = JSON.parse($response.body)

switch (true) {
  // home
  case body.data.homeV3 !== undefined:
    let homeEdges = body.data.homeV3.elements.edges
    homeEdges = homeEdges.filter((e) => {
      if (e.node.adPayload) {
        console.log('Remove home feed Ads: ' + e.node.id)
        return false
      }
      return true
    })
    body.data.homeV3.elements.edges = homeEdges
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

  case body.data.identity !== undefined:
    body.data.identity.redditor.profile.isSubscribed = true
    break

  default:
    break
}

$done({
  body: JSON.stringify(body),
})

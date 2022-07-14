if (typeof $response !== 'undefined') {
  let body = $response.body

  if (/</html>|</body>/.test(body)) {
    const cookieMod = {
      get(key){
        if (typeof $store !== "undefined") return $store.get(key)
        if (typeof $prefs !== "undefined") return $prefs.valueForKey(key)
        if (typeof $persistentStore !== "undefined") return $persistentStore.read(key)
        if (typeof localStorage !== "undefined") return localStorage.getItem(key)
      }
    }

    let config = {
      recommendblock: cookieMod.get('csdn_recommend_block') === 'false' ? false : true,     // 是否移除推薦文章。默認 true
      logshow: cookieMod.get('csdn_log_show') === 'false' ? false : true,   // 是否顯示 JS 注入成功的 log。默認 true
    }

    body = body.replace('</head>', <style type="text/css">*{min-width: initial !important;box-sizing:border-box}html{overflow-y:auto!important}body{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;position:absolute!important;top:0!important;width: 100%;}.more-toolbox,.blog-footer-bottom,.csdn-side-toolbar,.slide-content-box,.blog-tags-box,.operating,#blog_detail_zk_collection,.article-copyright,#csdn-toolbar,aside,.tool-box,.template-box,.item-m,.dec,.more,.tool-item,.passport-login-container,.signin,#blogColumnPayAdvert${ config.recommendblock ? ',.recommend-box,.recommend-tit-mod' : '' }{display:none !important}main,.content{width:100% !important}.blog_title_box{width:unset !important}#mainBox {margin-left: 0;max-width: 100%;}.blog-content-box,.main_father,.recommend-item-box{padding: 8px 2px 0 4px!important;}.hljs-ln{overflow-x: auto !important;display: flex;flex-wrap: wrap;}.htmledit_views code ol li {display: inline-flex;width: 100%;}.article-type-img {position: absolute;right: 0;margin-right: 0!important;background: #de3e31d6;border-radius: 15px 5px 5px 15px;}.time{position: absolute!important;top:-1.8em;right:0;}.article-bar-top{align-items: center;}pre,code{user-select: text!important;}</style></head>)

    if (config.logshow) {
      console.log('CSDN 手機網頁優化')
    }
  }
  $done({ body })
} else {
  console.log('csdn.res.js 用於 rewrite 重寫規則，請勿直接運行)
  $done()
}

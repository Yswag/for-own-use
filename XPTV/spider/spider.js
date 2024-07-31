const $ = new Env('XPTV-sources', { logLevel: 'info' })

!(async () => {
    await importRemoteUtils('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js', '', 'CryptoJS', 'crypto-js')
    await importRemoteUtils('https://cdn.jsdelivr.net/gh/Yuheng0101/X@main/Utils/cheerio.js', 'createCheerio', 'cheerio')
    await importRemoteUtils('https://cdn.jsdelivr.net/gh/Yuheng0101/X@main/Utils/Buffer.min.js', 'loadBuffer', 'Buffer')

    const URI = new URIs()
    const { url } = $request
    const queryParams = URI.parse(url).query
    let spiderInstance
    switch (true) {
        case url.includes('/bttwo/'):
            spiderInstance = new bttwoClass()
            break
        case url.includes('/saohuo/'):
            spiderInstance = new saohuoClass()
            break
        case url.includes('/subaibai/'):
            spiderInstance = new sbbClass()
            break
        case url.includes('/hjkk/'):
            spiderInstance = new hjkkClass()
            break
        case url.includes('/nkvod/'):
            spiderInstance = new nkvodClass()
            break
        case url.includes('/kmeiju/'):
            spiderInstance = new kmeijuClass()
            break
        case url.includes('/duanjutt/'):
            spiderInstance = new duanjuttClass()
            break
        case url.includes('/sx/'):
            spiderInstance = new sxClass()
            break
        case url.includes('/anfuns/'):
            spiderInstance = new anfunsClass()
            break
        case url.includes('/6080/'):
            spiderInstance = new newvisionClass()
            break
        case url.includes('/zeqaht/'):
            spiderInstance = new zeqahtClass()
            break
        case url.includes('/mgtimi/'):
            spiderInstance = new mgtimiClass()
            break
        case url.includes('/dsakf23665/'):
            spiderInstance = new dsakf23665Class()
            break
        case url.includes('/nono/'):
            spiderInstance = new nonoClass()
            break
        case url.includes('getJSON'):
            getJSON()
            break

        default:
            $.logErr('No matching spiderInstance found for the URL: ' + url)
            $.done()
            return
    }

    await handleRequest(spiderInstance, queryParams)
})().catch((e) => $.logErr(e))

async function handleRequest(spiderInstance, queryParams) {
    const ac = queryParams?.ac || ''
    if (ac === 'list' || ac === '') {
        let res = await spiderInstance.getClassList()
        $.isQuanX()
            ? $.done({ status: 'HTTP/1.1 200', body: res })
            : $.done({
                  response: {
                      status: 200,
                      headers: {
                          'Content-Type': 'text/html;charset=utf-8',
                      },
                      body: res,
                  },
              })
    } else if (ac === 'detail') {
        const ids = queryParams.ids
        const wd = queryParams.wd
        if (ids) {
            let res = await spiderInstance.getVideoDetail(queryParams)
            $.isQuanX()
                ? $.done({ status: 'HTTP/1.1 200', body: res })
                : $.done({
                      response: {
                          status: 200,
                          headers: {
                              'Content-Type': 'text/html;charset=utf-8',
                          },
                          body: res,
                      },
                  })
        } else if (wd) {
            let res = await spiderInstance.searchVideo(queryParams)
            $.isQuanX()
                ? $.done({ status: 'HTTP/1.1 200', body: res })
                : $.done({
                      response: {
                          status: 200,
                          headers: {
                              'Content-Type': 'text/html;charset=utf-8',
                          },
                          body: res,
                      },
                  })
        } else {
            let res = await spiderInstance.getVideoList(queryParams)
            $.isQuanX()
                ? $.done({ status: 'HTTP/1.1 200', body: res })
                : $.done({
                      response: {
                          status: 200,
                          headers: {
                              'Content-Type': 'text/html;charset=utf-8',
                          },
                          body: res,
                      },
                  })
        }
    } else if (ac === 'play') {
        let res = await spiderInstance.getVideoPlayUrl(queryParams)
        let playUrl = JSON.parse(res).data
        $.isQuanX()
            ? $.done({ status: 'HTTP/1.1 302', headers: { Location: playUrl } })
            : $.done({
                  response: {
                      status: 302,
                      headers: {
                          Location: playUrl,
                      },
                  },
              })
    }
}

function getJSON() {
    const subs = {
        sites: [
            { name: '文才|偽', type: 1, api: `https://ykusu.ykusu/zeqaht/provide/vod` },
            //{ name: '速訊影院|偽', type: 1, api: `http://hd.suxun.site/api.php/provide/vod` },
            { name: '兩個BT|偽', type: 1, api: `https://ykusu.ykusu/bttwo/provide/vod` },
            { name: '燒火電影|偽', type: 1, api: `https://ykusu.ykusu/saohuo/provide/vod` },
            { name: '素白白影視|偽', type: 1, api: `https://ykusu.ykusu/subaibai/provide/vod` },
            { name: 'anfuns|偽', type: 1, api: `https://ykusu.ykusu/anfuns/provide/vod` },
            // { name: '耐看點播|偽', type: 1, api: `https://ykusu.ykusu/nkvod/provide/vod` },
            { name: '韓劇看看|偽', type: 1, api: `https://ykusu.ykusu/hjkk/provide/vod` },
            { name: '短劇天堂|偽', type: 1, api: `https://ykusu.ykusu/duanjutt/provide/vod` },
            // { name: '美劇星球|偽', type: 1, api: `https://ykusu.ykusu/kmeiju/provide/vod` },
            // { name: 'timimg|偽', type: 1, api: `https://vipcj.timizy.top/api.php/provide/vod/from/mgtv` },
            { name: '小螞蟻|偽', type: 1, api: `http://dsakf23665.com/api.php/provide/vod/from/NBY` },
            { name: '4K測試|偽', type: 1, api: `http://dsakf23665.com/api.php/provide/vod/from/4kvip` },
            { name: 'NO視頻|偽', type: 1, api: `https://ykusu.ykusu/nono/api.php/provide/vod` },
        ],
    }
    return $.isQuanX() ? $.done({ status: 'HTTP/1.1 200', body: JSON.stringify(subs) }) : $.done({ response: { status: 200, body: JSON.stringify(subs) } })
}

function bttwoClass() {
    return new (class {
        constructor() {
            this.url = 'https://www.bttwoo.com'
            this.headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            }
            this.ignoreClassName = ['首页', '热门下载', '公告求片']
        }

        async getClassList() {
            let webUrl = this.url
            let backData = {}
            try {
                const pro = await $.http.get({ url: webUrl, headers: this.headers })

                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allClass = _$('.navlist a')
                    let list = []
                    allClass.each((index, element) => {
                        let isIgnore = this.isIgnoreClassName(_$(element).text())
                        if (isIgnore) {
                            return
                        }
                        let type_name = _$(element).text()
                        let url = _$(element).attr('href') ?? ''

                        url = this.combineUrl(url)

                        if (url.length > 0 && type_name.length > 0) {
                            let videoClass = {}
                            videoClass.type_id = index
                            videoClass.type_name = type_name.trim()
                            list.push(videoClass)
                        }
                    })

                    let allVideo = _$('.mi_btcon')
                    let videos = []
                    allVideo.each((index, element) => {
                        let videoList = _$(element).find('.bt_img ul li')
                        videoList.each((i, e) => {
                            let vodUrl = _$(e).find('a').attr('href') ?? ''
                            let vodPic = _$(e).find('img').attr('data-original') ?? ''
                            let vodName = _$(e).find('img').attr('alt') ?? ''
                            let vodDiJiJi = _$(e).find('.jidi span').text() ?? ''

                            let videoDet = {}
                            let match = vodUrl.match(/movie\/(.+)\.html/)
                            if (match) {
                                videoDet.vod_id = +match[1]
                            }
                            videoDet.vod_pic = vodPic
                            videoDet.vod_name = vodName
                            videoDet.vod_remarks = vodDiJiJi.trim()
                            videos.push(videoDet)
                        })
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = 1
                    backData.list = videos
                    backData.class = list
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoList(queryParams) {
            const page = queryParams.pg
            const type = queryParams.t
            let realTypeName = ''
            if (type === '') return this.getClassList()
            switch (type) {
                case '1':
                    realTypeName = '/new-movie'
                    break
                case '3':
                    realTypeName = '/hot-month'
                    break
                case '4':
                    realTypeName = '/zgjun'
                    break
                case '5':
                    realTypeName = '/meiju'
                    break
                case '6':
                    realTypeName = '/jpsrtv'
                    break
            }
            let listUrl = this.removeTrailingSlash(this.url) + realTypeName + '/page/' + page.toString()
            let backData = {}
            try {
                let pro = await $.http.get({ url: listUrl, headers: this.headers })

                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allVideo = _$('div.bt_img > ul').find('li')
                    let lastPage = _$('.pagenavi_txt a[title="跳转到最后一页"]').attr('href')
                    if (lastPage) {
                        let parts = lastPage.split('/')
                        lastPage = parts[parts.length - 1]
                    } else {
                        lastPage = '1'
                    }
                    let videos = []
                    allVideo.each((index, element) => {
                        let vodUrl = _$(element).find('.dytit a').attr('href') || ''
                        let vodPic = _$(element).find('.thumb').attr('data-original') || ''
                        let vodName = _$(element).find('.dytit').text() || ''
                        let vodDiJiJi = _$(element).find('.jidi span').text() || ''

                        let videoDet = {}
                        videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                        videoDet.vod_pic = vodPic
                        videoDet.vod_name = vodName
                        videoDet.vod_remarks = vodDiJiJi.trim()
                        videos.push(videoDet)
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = page.toString()
                    backData.pagecount = +lastPage
                    backData.limit = videos.length.toString()
                    backData.total = videos.length * lastPage
                    backData.list = videos
                }
            } catch (e) {
                $.logErr('Error fetching list:', e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async getVideoDetail(queryParams) {
            const ids = queryParams.ids
            let backData = {}
            try {
                let webUrl = this.url + `/movie/${ids}.html`
                let pro = await $.http.get({ url: webUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    // let document = parse(proData)
                    let _$ = $.cheerio.load(proData)

                    // let juJiDocment = document.querySelector('.paly_list_btn')?.querySelectorAll('a') ?? []
                    let juJiDocument = _$('.paly_list_btn').find('a')

                    let vod_play_url = ''
                    juJiDocument.each((index, element) => {
                        vod_play_url += _$(element).text()
                        vod_play_url += '$'
                        vod_play_url += 'https://ykusu.ykusu/bttwo/provide/vod?ac=play&url=' + encodeURIComponent(_$(element).attr('href')) + '&n=.m3u8'
                        vod_play_url += '#'
                    })

                    let temp = {
                        code: 1,
                        msg: '数据列表',
                        page: 1,
                        pagecount: 1,
                        limit: '20',
                        total: 1,
                        list: [
                            {
                                vod_id: 1,
                                vod_name: '',
                                vod_pic: '',
                                vod_remarks: '',
                                type_name: '',
                                vod_year: '',
                                vod_area: '',
                                vod_actor: '',
                                vod_director: '',
                                vod_content: '',
                                vod_play_from: '',
                                vod_play_url: '',
                            },
                        ],
                    }
                    temp.list[0].vod_play_url = vod_play_url
                    temp.list[0].vod_id = +ids
                    backData = temp
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let url = decodeURIComponent(queryParams.url)

            try {
                let html = await $.http.get({ url: url, headers: this.headers })

                let data = html.body
                if (data) {
                    let isPlayable = data.split('window.wp_nonce=')[1]
                    if (isPlayable) {
                        let text = isPlayable.split('eval')[0]
                        let code = text.match(/var .*?=.*?"(.*?)"/)[1]
                        let key = text.match(/var .*?=md5.enc.Utf8.parse\("(.*?)"/)[1]
                        let iv = text.match(/var iv=.*?\((\d+)/)[1]

                        text = this.aesCbcDecode(code, key, iv)
                        let playurl = text.match(/url: "(.*?)"/)[1]

                        backData.data = playurl
                        // $.log('playUrl: ' + playurl)
                    } else {
                        $.msg('該片在線播放需要兩個BT的VIP會員')
                        // backData.error = '該片需兩個BT的VIP會員才能收看'
                        backData.data = 'https://shattereddisk.github.io/rickroll/rickroll.mp4'
                    }
                    // } else backData.data = 'https://bit.ly/3BlS71b'
                } else backData.data = 'https://shattereddisk.github.io/rickroll/rickroll.mp4'
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async searchVideo(queryParams) {
            const pg = queryParams.pg
            const wd = queryParams.wd
            let backData = {}
            let url = this.removeTrailingSlash(this.url) + `/xssssearch?q=${wd}$f=_all&p=${pg}`

            try {
                let pro = await $.http.get({ url: url, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allVideo = _$('div.bt_img > ul').find('li')
                    let videos = []
                    allVideo.each((index, element) => {
                        let vodUrl = _$(element).find('.dytit a').attr('href') || ''
                        let vodPic = _$(element).find('.thumb').attr('data-original') || ''
                        let vodName = _$(element).find('.dytit').text() || ''
                        let vodDiJiJi = _$(element).find('.jidi span').text() || ''

                        let videoDet = {}
                        videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                        videoDet.vod_pic = vodPic
                        videoDet.vod_name = vodName
                        videoDet.vod_remarks = vodDiJiJi.trim()
                        videos.push(videoDet)
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = $.toStr(pg)
                    // backData.pagecount = +lastPage;
                    backData.limit = videos.length.toString()
                    // backData.total = videos.length * lastPage;
                    backData.list = videos
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        aesCbcDecode(ciphertext, key, iv) {
            const encryptedHexStr = $.CryptoJS.enc.Base64.parse(ciphertext)
            const encryptedBase64Str = $.CryptoJS.enc.Base64.stringify(encryptedHexStr)

            const keyHex = $.CryptoJS.enc.Utf8.parse(key)
            const ivHex = $.CryptoJS.enc.Utf8.parse(iv)

            const decrypted = $.CryptoJS.AES.decrypt(encryptedBase64Str, keyHex, {
                iv: ivHex,
                mode: $.CryptoJS.mode.CBC,
                padding: $.CryptoJS.pad.Pkcs7,
            })

            const plaintext = decrypted.toString($.CryptoJS.enc.Utf8)
            return plaintext
        }

        combineUrl(url) {
            if (url === undefined) {
                return ''
            }
            if (url.indexOf(this.url) !== -1) {
                return url
            }
            if (url.startsWith('/')) {
                return this.url + url
            }
            return this.url + '/' + url
        }

        isIgnoreClassName(className) {
            return this.ignoreClassName.some((element) => className.includes(element))
        }

        removeTrailingSlash(str) {
            if (str.endsWith('/')) {
                return str.slice(0, -1)
            }
            return str
        }
    })()
}

function saohuoClass() {
    return new (class {
        constructor() {
            this.url = 'https://saohuo.tv'
            this.headers = {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
            }
            this.ignoreClassName = ['最新', '最热']
        }

        async getClassList() {
            let webUrl = this.url
            let backData = {}
            try {
                const pro = await $.http.get({ url: webUrl, headers: this.headers })

                let proData = await pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allClass = _$('nav.top_bar > a')
                    let list = []
                    allClass.each((index, element) => {
                        let isIgnore = this.isIgnoreClassName(_$(element).text())
                        if (isIgnore) {
                            return
                        }
                        let type_name = _$(element).text()
                        let url
                        if (type_name === '动漫') {
                            url = '/list/4.html'
                        } else url = _$(element).attr('href') || ''

                        // url = this.combineUrl(url)
                        url = url.match(/list\/(.*)\.html/)[1]

                        if (url.length > 0 && type_name.length > 0) {
                            let videoClass = {}
                            videoClass.type_id = +url
                            videoClass.type_name = type_name.trim()
                            list.push(videoClass)
                        }

                        if (type_name === '电影') {
                            let cat = [
                                { type_id: 6, type_name: '喜剧' },
                                { type_id: 7, type_name: '爱情' },
                                { type_id: 8, type_name: '恐怖' },
                                { type_id: 9, type_name: '动作' },
                                { type_id: 10, type_name: '科幻' },
                                { type_id: 11, type_name: '战争' },
                                { type_id: 12, type_name: '犯罪' },
                                { type_id: 13, type_name: '动画' },
                                { type_id: 14, type_name: '奇幻' },
                                { type_id: 15, type_name: '剧情' },
                                { type_id: 16, type_name: '冒险' },
                                { type_id: 17, type_name: '悬疑' },
                                { type_id: 18, type_name: '惊悚' },
                                { type_id: 19, type_name: '其它電影' },
                            ]
                            list.push(...cat)
                        } else if (type_name === '电视剧') {
                            let cat = [
                                { type_id: 20, type_name: '大陆' },
                                { type_id: 21, type_name: 'TVB' },
                                { type_id: 22, type_name: '韩剧' },
                                { type_id: 23, type_name: '美剧' },
                                { type_id: 24, type_name: '日剧' },
                                { type_id: 25, type_name: '英剧' },
                                { type_id: 26, type_name: '台剧' },
                                { type_id: 27, type_name: '其它剧' },
                            ]
                            list.push(...cat)
                        }
                    })

                    let allVideo = _$('ul.v_list').eq(0).find('.v_img')
                    let videos = []
                    allVideo.each((index, element) => {
                        let vodUrl = _$(element).find('a').attr('href') || ''
                        let vodPic = _$(element).find('img').attr('data-original') || ''
                        let vodName = _$(element).find('a').attr('title') || ''
                        let vodDiJiJi = _$(element).find('.v_note').text() || ''

                        let videoDet = {}
                        videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                        videoDet.vod_pic = vodPic
                        videoDet.vod_name = vodName
                        videoDet.vod_remarks = vodDiJiJi.trim()
                        videos.push(videoDet)
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = 1
                    backData.list = videos
                    backData.class = list
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoList(queryParams) {
            let page = queryParams.pg
            let type = queryParams.t

            if (type === '') return this.getClassList()

            let listUrl = this.removeTrailingSlash(this.url) + '/list/' + type + '-' + page.toString() + '.html'
            let backData = {}
            try {
                let pro = await $.http.get({ url: listUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allVideo = _$('ul.v_list div.v_img')
                    let lastPage = _$('section.page span').text() || ''
                    if (lastPage) {
                        let parts = lastPage.split('/')
                        lastPage = parts[parts.length - 1]
                    } else {
                        lastPage = '1'
                        // console.log('lastpage not found, using default value');
                    }
                    let videos = []
                    allVideo.each((index, element) => {
                        let vodUrl = _$(element).find('a').attr('href') || ''
                        let vodPic = _$(element).find('img').attr('data-original') || ''
                        let vodName = _$(element).find('a').attr('title') || ''
                        let vodDiJiJi = _$(element).find('.v_note').text() || ''

                        let videoDet = {}
                        videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                        videoDet.vod_pic = vodPic
                        videoDet.vod_name = vodName
                        videoDet.vod_remarks = vodDiJiJi.trim()
                        videos.push(videoDet)
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = page.toString()
                    backData.pagecount = +lastPage
                    backData.limit = videos.length.toString()
                    backData.total = videos.length * lastPage
                    backData.list = videos
                }
            } catch (e) {
                $.logErr('Error fetching list:', e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async getVideoDetail(queryParams) {
            let ids = queryParams.ids
            let backData = {}
            try {
                let webUrl = this.url + `/movie/${ids}.html`
                let pro = await $.http.get({ url: webUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)

                    let play_from = []
                    _$('ul.from_list')
                        .find('li')
                        .each((i, e) => play_from.push(_$(e).text()))

                    let juJiDocment = _$('#play_link').find('li')
                    // let vod_play_from = '';
                    let vod_play_url = ''
                    juJiDocment.each((index, element) => {
                        let playLinkList = juJiDocment.eq(index)
                        // let playLinks = _$(playLinkList).find('a').toArray()
                        let playLinks = _$(playLinkList).find('a')
                        let from = play_from[index]

                        // _$(playLinks.reverse()).each((index, element) => {
                        playLinks.each((index, element) => {
                            vod_play_url += from + '-' + _$(element).text()
                            vod_play_url += '$'
                            vod_play_url +=
                                'https://ykusu.ykusu/saohuo/provide/vod?ac=play&url=' + encodeURIComponent(this.url + _$(element).attr('href')) + '&n=.m3u8'
                            vod_play_url += '#'
                        })

                        vod_play_url += '$$$'
                    })

                    let temp = {
                        code: 1,
                        msg: '数据列表',
                        page: 1,
                        pagecount: 1,
                        limit: '20',
                        total: 1,
                        list: [
                            {
                                vod_id: 1,
                                vod_name: '',
                                vod_pic: '',
                                vod_remarks: '',
                                type_name: '',
                                vod_year: '',
                                vod_area: '',
                                vod_actor: '',
                                vod_director: '',
                                vod_content: '',
                                vod_play_from: '',
                                vod_play_url: '',
                            },
                        ],
                    }
                    temp.list[0].vod_play_url = vod_play_url
                    temp.list[0].vod_play_from = play_from.join('$$$')
                    temp.list[0].vod_play_note = '$$$'
                    temp.list[0].vod_id = +ids
                    backData = temp
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let url = decodeURIComponent(queryParams.url)
            try {
                let html = await $.http.get({ url: url, headers: this.headers })

                let proData = html.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let iframeUrl = _$('iframe').attr('src') || ''
                    let apiurl = iframeUrl ? this.getHostFromURL(iframeUrl) + '/api.php' : ''

                    let resp = await $.http.get({ url: iframeUrl, headers: this.headers })
                    if (resp.body) {
                        let _$2 = $.cheerio.load(resp.body)
                        let respScript = _$2('body script').text()
                        let url = respScript.match(/var url = "(.*)"/)[1]
                        let t = respScript.match(/var t = "(.*)"/)[1]
                        let key = respScript.match(/var key = "(.*)"/)[1]

                        let presp = await $.http.post({
                            url: apiurl,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'User-Agent': this.headers['User-Agent'],
                                Referer: iframeUrl,
                            },
                            body: `url=${url}&t=${t}&key=${key}&act=0&play=1`,
                        })
                        let purl = JSON.parse(presp.body).url
                        // $.log('purl=' + purl)
                        backData.data = /http/.test(purl) ? purl : this.getHostFromURL(iframeUrl) + purl
                    } else backData.error = 'resp is empty'
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async searchVideo(queryParams) {
            const pg = queryParams.pg
            const wd = queryParams.wd
            let ocrApi = 'https://api.nn.ci/ocr/b64/json'
            let validate = this.url + '/include/vdimgck.php'
            let backData = {}

            try {
                // 搜尋需要通過圖形驗證碼
                let img = await $.http.get({ url: validate, headers: this.headers, 'binary-mode': true })
                // $.log(JSON.stringify(img))
                let b64 = $.Buffer.from(img.body).toString('base64')
                // $.log(b64)
                let ocrRes = await $.http.post({
                    url: ocrApi,
                    headers: { headers: this.headers },
                    body: b64,
                })
                let vd = JSON.parse(ocrRes.body).result
                let searchUrl = this.url + '/search.php?scheckAC=check&page=&searchtype=&order=&tid=&area=&year=&letter=&yuyan=&state=&money=&ver=&jq='
                let searchRes = await $.http.post({
                    url: searchUrl,
                    headers: this.headers,
                    body: `searchword=${wd}&validate=${vd}`,
                })
                let _$ = $.cheerio.load(searchRes.body)
                let videos = []
                let allVideo = _$('ul.v_list div.v_img')
                allVideo.each((index, element) => {
                    let vodUrl = _$(element).find('a').attr('href') || ''
                    let vodPic = _$(element).find('img').attr('data-original') || ''
                    let vodName = _$(element).find('a').attr('title') || ''
                    let vodDiJiJi = _$(element).find('.v_note').text() || ''

                    let videoDet = {}
                    videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                    videoDet.vod_pic = vodPic
                    videoDet.vod_name = vodName
                    videoDet.vod_remarks = vodDiJiJi.trim()
                    videos.push(videoDet)
                })

                backData.code = 1
                backData.msg = '數據列表'
                backData.page = pg
                // backData.pagecount = +lastPage
                backData.limit = videos.length.toString()
                // backData.total = videos.length * lastPage
                backData.list = videos
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        combineUrl(url) {
            if (url === undefined) {
                return ''
            }
            if (url.indexOf(this.url) !== -1) {
                return url
            }
            if (url.startsWith('/')) {
                return this.url + url
            }
            return this.url + '/' + url
        }

        isIgnoreClassName(className) {
            return this.ignoreClassName.some((element) => className.includes(element))
        }

        removeTrailingSlash(str) {
            if (str.endsWith('/')) {
                return str.slice(0, -1)
            }
            return str
        }

        getHostFromURL(url) {
            const protocolEndIndex = url.indexOf('://')
            if (protocolEndIndex === -1) {
                return null
            }
            const hostStartIndex = protocolEndIndex + 3
            const hostEndIndex = url.indexOf('/', hostStartIndex)
            const host = hostEndIndex === -1 ? url.slice(hostStartIndex) : url.slice(hostStartIndex, hostEndIndex)

            return `${url.slice(0, protocolEndIndex + 3)}${host}`
        }
    })()
}

function sbbClass() {
    return new (class {
        constructor() {
            this.key = '素白白'
            this.url = 'https://www.subaibaiys.com'
            this.siteKey = ''
            this.siteType = 0
            this.headers = {
                'User-Agent':
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
            }
            this.cookie = {}
            this.ignoreClassName = ['首页', '公告留言']
        }

        async getClassList() {
            let webUrl = this.url
            let backData = {}
            try {
                const pro = await $.http.get({ url: webUrl, headers: this.headers })

                let proData = await pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allClass = _$('ul.navlist a')
                    let list = []
                    allClass.each((index, element) => {
                        let isIgnore = this.isIgnoreClassName(_$(element).text())
                        if (isIgnore) {
                            return
                        }
                        let type_name = _$(element).text()
                        let url = _$(element).attr('href') || ''

                        if (url.length > 0 && type_name.length > 0) {
                            let videoClass = {}
                            // videoClass.type_id = url
                            videoClass.type_id = index
                            videoClass.type_name = type_name.trim()
                            list.push(videoClass)
                        }
                    })

                    let allVideo = _$('.mi_cont .mi_btcon')
                    let videos = []
                    allVideo.each((index, element) => {
                        let nodes = _$(element).find('.bt_img ul li')
                        nodes.each((index, element) => {
                            let vodUrl = _$(element).find('a').attr('href') || ''
                            let vodPic = _$(element).find('img').attr('data-original') || ''
                            let vodName = _$(element).find('img').attr('alt') || ''
                            let vodDiJiJi = _$(element).find('.jidi').text() || ''

                            let videoDet = {}
                            videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                            videoDet.vod_pic = vodPic
                            videoDet.vod_name = vodName
                            videoDet.vod_remarks = vodDiJiJi.trim()
                            videos.push(videoDet)
                        })
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = 1
                    backData.list = videos
                    backData.class = list
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoList(queryParams) {
            let page = queryParams.pg
            let type = queryParams.t

            let realTypeName = ''
            if (type === '') return this.getClassList()
            switch (type) {
                case '1':
                    realTypeName = '/new-movie'
                    break
                case '2':
                    realTypeName = '/tv-drama'
                    break
                case '3':
                    realTypeName = '/hot-month'
                    break
                case '4':
                    realTypeName = '/high-movie'
                    break
                case '5':
                    realTypeName = '/cartoon-movie'
                    break
                case '6':
                    realTypeName = '/hongkong-movie'
                    break
                case '7':
                    realTypeName = '/domestic-drama'
                    break
                case '8':
                    realTypeName = '/american-drama'
                    break
                case '9':
                    realTypeName = '/korean-drama'
                    break
                case '10':
                    realTypeName = '/anime-drama'
                    break
            }

            let listUrl = this.removeTrailingSlash(this.url) + realTypeName + '/page/' + page
            let backData = {}
            try {
                let pro = await $.http.get({ url: listUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allVideo = _$('.bt_img.mi_ne_kd.mrb li')
                    let lastPage = _$('.pagenavi_txt a[title="跳转到最后一页"]').attr('href')
                    if (lastPage) {
                        let parts = lastPage.split('/')
                        lastPage = parts[parts.length - 1]
                        // console.log('lastpage = ' + lastPage);
                    } else {
                        lastPage = '1'
                        // console.log('lastpage not found, using default value');
                    }
                    let videos = []
                    allVideo.each((index, element) => {
                        let vodUrl = _$(element).find('a').attr('href') || ''
                        let vodPic = _$(element).find('img.thumb').attr('data-original') || ''
                        let vodName = _$(element).find('img.thumb').attr('alt') || ''
                        let vodDiJiJi = _$(element).find('.jidi span').text() ? _$(element).find('.jidi span').text() : _$(element).find('.hdinfo').text()

                        let videoDet = {}
                        videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                        videoDet.vod_pic = vodPic
                        videoDet.vod_name = vodName
                        videoDet.vod_remarks = vodDiJiJi.trim()
                        videos.push(videoDet)
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = page.toString()
                    backData.pagecount = +lastPage
                    backData.limit = videos.length.toString()
                    backData.total = videos.length * lastPage
                    backData.list = videos
                }
            } catch (e) {
                $.logErr('Error fetching list:', e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async getVideoDetail(queryParams) {
            let ids = queryParams.ids
            let backData = {}
            try {
                let webUrl = this.url + `/movie/${ids}.html`
                let pro = await $.http.get({ url: webUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let vod_name = _$('.moviedteail_tt h1').text()
                    let vod_content = _$('.yp_context').text()
                    let vod_pic = _$('.dyimg img').attr('src')

                    let juJiDocment = _$('.paly_list_btn').find('a')
                    // let vod_play_from = '';
                    let vod_play_url = ''
                    juJiDocment.each((index, element) => {
                        vod_play_url += _$(element).text()
                        vod_play_url += '$'
                        vod_play_url += 'https://ykusu.ykusu/subaibai/provide/vod?ac=play&url=' + encodeURIComponent(_$(element).attr('href')) + '&n=.m3u8'
                        vod_play_url += '#'
                    })

                    let temp = {
                        code: 1,
                        msg: '数据列表',
                        page: 1,
                        pagecount: 1,
                        limit: '20',
                        total: 1,
                        list: [
                            {
                                vod_id: 1,
                                vod_name: '',
                                vod_pic: '',
                                vod_remarks: '',
                                type_name: '',
                                vod_year: '',
                                vod_area: '',
                                vod_actor: '',
                                vod_director: '',
                                vod_content: '',
                                vod_play_from: '',
                                vod_play_url: '',
                            },
                        ],
                    }
                    temp.list[0].vod_play_url = vod_play_url
                    // temp.list[0].vod_play_from = play_from.join('$$$')
                    // temp.list[0].vod_play_note = '$$$'
                    temp.list[0].vod_id = +ids
                    temp.list[0].vod_name = vod_name
                    temp.list[0].vod_pic = vod_pic
                    temp.list[0].vod_content = vod_content.trim()
                    backData = temp
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let url = decodeURIComponent(queryParams.url)
            try {
                let html = await $.http.get({ url: url, headers: this.headers })

                let proData = html.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let isVip = _$('.noplay').text()
                    if (isVip) {
                        $.msg('仅对会员开放')
                        return JSON.stringify({ data: null })
                    }
                    let iframe = _$('iframe').filter((i, iframe) => $(iframe).attr('src').includes('Cloud'))

                    if (0 < iframe.length) {
                        const iframeHtml = (
                            await $.http.get({
                                url: iframe[0].attr('src'),
                                headers: {
                                    Referer: url,
                                    'User-Agent':
                                        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
                                },
                            })
                        ).body
                        let code = iframeHtml
                                .match(/var url = '(.*?)'/)[1]
                                .split('')
                                .reverse()
                                .join(''),
                            temp = ''
                        for (let i = 0; i < code.length; i += 2) temp += String.fromCharCode(parseInt(code[i] + code[i + 1], 16))
                        const playUrl = temp.substring(0, (temp.length - 7) / 2) + temp.substring((temp.length - 7) / 2 + 7)

                        backData.data = playUrl
                    } else {
                        let playUrl = 'error'

                        const script = _$('script')
                        const js = script.filter((i, el) => _$(el).text().includes('window.wp_nonce')).text() || ''
                        const group = js.match(/(var.*)eval\((\w*\(\w*\))\)/)
                        const md5 = CryptoJS
                        const result = eval(group[1] + group[2])
                        playUrl = result.match(/url:.*?['"](.*?)['"]/)[1]
                        // $.log(playUrl)

                        backData.data = playUrl
                    }
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async searchVideo(queryParams) {
            const pg = queryParams.pg
            const wd = queryParams.wd
            let backData = {}

            try {
                let searchUrl = this.url + '/search?q=' + wd
                let searchRes = await $.http.get({
                    url: searchUrl,
                    headers: this.headers,
                })
                let _$ = $.cheerio.load(searchRes.body)
                let videos = []
                let allVideo = _$('.search_list').find('li')
                allVideo.each((index, element) => {
                    let vodUrl = _$(element).find('a').attr('href') || ''
                    let vodPic = _$(element).find('img.thumb').attr('data-original') || ''
                    let vodName = _$(element).find('img.thumb').attr('alt') || ''
                    let vodDiJiJi = _$(element).find('.jidi').text() || ''

                    let videoDet = {}
                    videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                    videoDet.vod_pic = vodPic
                    videoDet.vod_name = vodName
                    videoDet.vod_remarks = vodDiJiJi.trim()
                    videos.push(videoDet)
                })

                backData.code = 1
                backData.msg = '數據列表'
                backData.page = pg
                // backData.pagecount = +lastPage
                backData.limit = videos.length.toString()
                // backData.total = videos.length * lastPage
                backData.list = videos
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        combineUrl(url) {
            if (url === undefined) {
                return ''
            }
            if (url.indexOf(this.url) !== -1) {
                return url
            }
            if (url.startsWith('/')) {
                return this.url + url
            }
            return this.url + '/' + url
        }

        isIgnoreClassName(className) {
            return this.ignoreClassName.some((element) => className.includes(element))
        }

        removeTrailingSlash(str) {
            if (str.endsWith('/')) {
                return str.slice(0, -1)
            }
            return str
        }
    })()
}

function hjkkClass() {
    return new (class {
        constructor() {
            this.url = 'https://www.hanjukankan.com'
            this.headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            }
            this.ignoreClassName = ['首页', '泰剧', 'APP']
        }

        async getClassList() {
            let webUrl = this.url
            let backData = {}
            try {
                const pro = await $.http.get({ url: webUrl, headers: this.headers })

                let proData = await pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allClass = _$('ul.myui-header__menu a')
                    let list = []
                    allClass.each((index, element) => {
                        let isIgnore = this.isIgnoreClassName(_$(element).text())
                        if (isIgnore) {
                            return
                        }
                        let type_name = _$(element).text()
                        let url = _$(element).attr('href') || ''

                        if (url.length > 0 && type_name.length > 0) {
                            let videoClass = {}
                            // videoClass.type_id = url
                            videoClass.type_id = index
                            videoClass.type_name = type_name.trim()
                            list.push(videoClass)
                        }
                    })

                    let allVideo = _$('.myui-panel')
                    let videos = []
                    allVideo.each((index, element) => {
                        let nodes = _$(element).find('ul.myui-vodlist li')
                        nodes.each((index, element) => {
                            let vodUrl = _$(element).find('a').attr('href') || ''
                            let vodPic = _$(element).find('a').attr('data-original') || ''
                            let vodName = _$(element).find('a').attr('title') || ''
                            let vodDiJiJi = ''

                            let videoDet = {}
                            videoDet.vod_id = +vodUrl.match(/movie\/index(.+)\.html/)[1]
                            videoDet.vod_pic = vodPic
                            videoDet.vod_name = vodName
                            videoDet.vod_remarks = vodDiJiJi.trim()
                            videos.push(videoDet)
                        })
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = 1
                    backData.list = videos
                    backData.class = list
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoList(queryParams) {
            const page = queryParams.pg
            const type = queryParams.t

            if (type === '') return this.getClassList()

            let listUrl = this.removeTrailingSlash(this.url) + '/frim/index' + type + '-' + page + '.html'
            let backData = {}
            try {
                let pro = await $.http.get({ url: listUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allVideo = _$('.myui-vodlist li')
                    let lastPage = _$('.myui-page a')
                        .filter((i, el) => _$(el).text() === '尾页')
                        .attr('href')
                    if (lastPage) {
                        // let parts = lastPage.split('/')
                        lastPage = lastPage.match(/index.-(.+)\.html/)[1]
                        // console.log('lastpage = ' + lastPage);
                    } else {
                        lastPage = '1'
                        // console.log('lastpage not found, using default value');
                    }
                    let videos = []
                    allVideo.each((index, element) => {
                        let vodUrl = _$(element).find('a').attr('href') || ''
                        let vodPic = _$(element).find('a').attr('data-original') || ''
                        let vodName = _$(element).find('a').attr('title') || ''
                        let vodDiJiJi = ''

                        let videoDet = {}
                        videoDet.vod_id = +vodUrl.match(/movie\/index(.+)\.html/)[1]
                        videoDet.vod_pic = vodPic
                        videoDet.vod_name = vodName
                        videoDet.vod_remarks = vodDiJiJi.trim()
                        videos.push(videoDet)
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = page.toString()
                    backData.pagecount = +lastPage
                    backData.limit = videos.length.toString()
                    backData.total = videos.length * lastPage
                    backData.list = videos
                }
            } catch (e) {
                $.logErr('Error fetching list:', e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async getVideoDetail(queryParams) {
            let ids = queryParams.ids
            let backData = {}
            try {
                let webUrl = this.url + `/movie/index${ids}.html`
                let pro = await $.http.get({ url: webUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let vod_name = _$('h1.title').text()
                    let vod_content = _$('#jq .tab-content.myui-panel_bd').text()
                    let vod_pic = _$('.myui-content__thumb img').attr('data-original')

                    let juJiDocment = _$('#playlist1 ul li').find('a')
                    // let vod_play_from = '';
                    let vod_play_url = ''
                    juJiDocment.each((index, element) => {
                        vod_play_url += _$(element).text()
                        vod_play_url += '$'
                        vod_play_url +=
                            'https://ykusu.ykusu/hjkk/provide/vod?ac=play&url=' + encodeURIComponent(this.combineUrl(_$(element).attr('href'))) + '&n=.m3u8'
                        vod_play_url += '#'
                    })

                    let temp = {
                        code: 1,
                        msg: '数据列表',
                        page: 1,
                        pagecount: 1,
                        limit: '20',
                        total: 1,
                        list: [
                            {
                                vod_id: 1,
                                vod_name: '',
                                vod_pic: '',
                                vod_remarks: '',
                                type_name: '',
                                vod_year: '',
                                vod_area: '',
                                vod_actor: '',
                                vod_director: '',
                                vod_content: '',
                                vod_play_from: '',
                                vod_play_url: '',
                            },
                        ],
                    }
                    temp.list[0].vod_play_url = vod_play_url
                    // temp.list[0].vod_play_from = play_from.join('$$$')
                    // temp.list[0].vod_play_note = '$$$'
                    temp.list[0].vod_id = +ids
                    temp.list[0].vod_name = vod_name
                    temp.list[0].vod_pic = vod_pic
                    temp.list[0].vod_content = vod_content.trim()
                    backData = temp
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let url = decodeURIComponent(queryParams.url)
            try {
                let html = await $.http.get({ url: url, headers: this.headers })

                let proData = html.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let script = _$('.myui-player__box script').text()

                    let url = eval(script.match(/now=(.*);var pn/)[1])
                    if (/\/file\//.test(url)) {
                        url = url.replace('/file', '')
                    }

                    backData.data = url
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async searchVideo(queryParams) {
            const pg = queryParams.pg
            const wd = queryParams.wd
            let backData = {}

            try {
                let searchUrl = this.url + `/search.php?searchword=${wd}`
                let searchRes = await $.http.get({
                    url: searchUrl,
                    headers: this.headers,
                })
                let _$ = $.cheerio.load(searchRes.body)
                let videos = []
                let allVideo = _$('#searchList').find('li')
                allVideo.each((index, element) => {
                    let vodUrl = _$(element).find('a.myui-vodlist__thumb').attr('href') || ''
                    let vodPic = _$(element).find('a.myui-vodlist__thumb').attr('data-original') || ''
                    let vodName = _$(element).find('a.myui-vodlist__thumb').attr('title') || ''
                    let vodDiJiJi = _$(element).find('span.pic-tag').text() || ''

                    let videoDet = {}
                    videoDet.vod_id = +vodUrl.match(/movie\/index(.+)\.html/)[1]
                    videoDet.vod_pic = vodPic
                    videoDet.vod_name = vodName
                    videoDet.vod_remarks = vodDiJiJi.trim()
                    videos.push(videoDet)
                })

                backData.code = 1
                backData.msg = '數據列表'
                backData.page = pg
                // backData.pagecount = +lastPage
                backData.limit = videos.length.toString()
                // backData.total = videos.length * lastPage
                backData.list = videos
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        combineUrl(url) {
            if (url === undefined) {
                return ''
            }
            if (url.indexOf(this.url) !== -1) {
                return url
            }
            if (url.startsWith('/')) {
                return this.url + url
            }
            return this.url + '/' + url
        }

        isIgnoreClassName(className) {
            return this.ignoreClassName.some((element) => className.includes(element))
        }

        removeTrailingSlash(str) {
            if (str.endsWith('/')) {
                return str.slice(0, -1)
            }
            return str
        }
    })()
}

function nkvodClass() {
    return new (class {
        constructor() {
            this.url = 'https://nkvod.com'
            this.headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                Referer: this.url,
            }
            this.ignoreClassName = ['热搜榜', 'APP', '首页']
        }

        async initParseMap() {
            const date = new Date()
            const t = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate()
            const url = this.url + '/static/js/playerconfig.js?t=' + t
            const js = (await $.http.get({ url: url, headers: this.headers })).body
            try {
                const jsEval = js + '\nMacPlayerConfig'
                const playerList = eval(jsEval).player_list
                const players = Object.values(playerList)
                let parseMap = {}
                players.forEach((item) => {
                    if (!item.ps || item.ps === '0') return
                    if (!item.parse) return
                    parseMap[item.show] = item.parse
                })
                $.setdata(JSON.stringify(parseMap), 'xptv-sources-nkvod-parseMap')
            } catch (e) {
                $.logErr(e)
            }
        }

        async getClassList() {
            await this.initParseMap()
            let webUrl = this.url
            let backData = {}
            try {
                // const pro = await $.http.get({ url: webUrl, headers: this.headers })

                // let proData = await pro.body
                // if (proData) {
                //     let _$ = $.cheerio.load(proData)
                //     let allClass = _$('.navbar .navbar-items .swiper-slide a')
                //     let list = []
                //     allClass.each((index, element) => {
                //         let isIgnore = this.isIgnoreClassName(_$(element).text())
                //         if (isIgnore) {
                //             return
                //         }
                //         let type_name = _$(element).text()
                //         let url = _$(element).attr('href') || ''
                //         // url = url.match(/type\/(.*+)\.html/)[1]

                //         if (url.length > 0 && type_name.length > 0) {
                //             let videoClass = {}
                //             // videoClass.type_id = url
                //             videoClass.type_id = index
                //             videoClass.type_name = type_name.trim()
                //             list.push(videoClass)
                //         }
                //     })

                //     let allVideo = _$('.content .module')
                //     let videos = []
                //     allVideo.each((index, element) => {
                //         let nodes = _$(element).find('.module-items > a')
                //         nodes.each((index, element) => {
                //             let vodUrl = _$(element).attr('href') || ''
                //             let vodPic = _$(element).find('img').attr('data-original') || ''
                //             let vodName = _$(element).attr('title') || ''
                //             let vodDiJiJi = _$(element).find('.module-item-note').text() || ''

                //             let videoDet = {}
                //             videoDet.vod_id = +vodUrl.match(/detail\/(.+)\.html/)[1]
                //             videoDet.vod_pic = vodPic
                //             videoDet.vod_name = vodName
                //             videoDet.vod_remarks = vodDiJiJi.trim()
                //             videos.push(videoDet)
                //         })
                //     })

                //     backData.code = 1
                //     backData.msg = '數據列表'
                //     backData.page = 1
                //     backData.list = videos
                //     backData.class = list
                // }
                let list = [
                    { type_id: 1, type_name: '電影' },
                    { type_id: 2, type_name: '電視劇' },
                    { type_id: 3, type_name: '綜藝' },
                    { type_id: 4, type_name: '動漫' },
                    { type_id: 13, type_name: '國產劇' },
                    { type_id: 14, type_name: '港台劇' },
                    { type_id: 15, type_name: '日韓劇' },
                    { type_id: 16, type_name: '歐美劇' },
                    { type_id: 20, type_name: '其他劇' },
                ]

                backData.code = 1
                backData.msg = '數據列表'
                backData.page = 1
                // backData.list = videos
                backData.list = []
                backData.class = list
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoList(queryParams) {
            let page = queryParams.pg
            let type = queryParams.t

            // if (type === '') return this.getClassList()

            let listUrl = this.removeTrailingSlash(this.url) + `/index.php/ajax/data?mid=1&tid=${type}&page=${page}&limit=20`
            let backData = {}
            try {
                let pro = await $.http.get({ url: listUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    // let _$ = $.cheerio.load(proData)
                    // let allVideo = _$('.content .module > a')
                    // let lastPage = _$('.pagenavi_txt a[title="尾页"]').attr('href')
                    // if (lastPage) {
                    //     lastPage = lastPage.match(/\/show\/(.*)--------(.*)---\.html/)[2]
                    //     // console.log('lastpage = ' + lastPage);
                    // } else {
                    //     lastPage = '1'
                    //     // console.log('lastpage not found, using default value');
                    // }
                    // let videos = []
                    // allVideo.each((index, element) => {
                    //     let vodUrl = _$(element).attr('href') || ''
                    //     let vodPic = _$(element).find('img').attr('data-original') || ''
                    //     let vodName = _$(element).attr('title') || ''
                    //     let vodDiJiJi = _$(element).find('.module-item-note').text() || ''
                    //     let videoDet = {}
                    //     videoDet.vod_id = +vodUrl.match(/detail\/(.+)\.html/)[1]
                    //     videoDet.vod_pic = vodPic
                    //     videoDet.vod_name = vodName
                    //     videoDet.vod_remarks = vodDiJiJi.trim()
                    //     videos.push(videoDet)
                    // })
                    // backData.code = 1
                    // backData.msg = '數據列表'
                    // backData.page = page.toString()
                    // backData.pagecount = +lastPage
                    // backData.limit = videos.length.toString()
                    // backData.total = videos.length * lastPage
                    // backData.list = videos
                    backData = JSON.parse(proData)
                }
            } catch (e) {
                $.logErr('Error fetching list:', e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async getVideoDetail(queryParams) {
            let ids = queryParams.ids
            let backData = {}
            try {
                let webUrl = this.url + `/detail/${ids}.html`
                let pro = await $.http.get({ url: webUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let vod_name = _$('.detail-info h3').text()
                    let vod_content = _$('.switch-box .text').text()
                    let vod_pic = _$('.detail-pic img').attr('data-src')

                    let from = []
                    _$('.anthology .swiper-wrapper a').each((index, element) => {
                        let name = _$(element)
                            .contents()
                            .filter(function () {
                                return this.type === 'text'
                            })
                            .text()
                            .trim()
                        from.push(name)
                    })

                    let juJiDocment = _$('.anthology-list-box')
                    // let vod_play_from = '';
                    let vod_play_url = ''
                    juJiDocment.each((index, element) => {
                        let line = from[index]
                        let allvideos = _$(element).find('ul.anthology-list-play li a')
                        allvideos.each((index, element) => {
                            let playerUrl = this.combineUrl(_$(element).attr('href'))
                            vod_play_url += line + '-' + _$(element).text()
                            vod_play_url += '$'
                            vod_play_url +=
                                'https://ykusu.ykusu/nkvod/provide/vod?ac=play&url=' + `${from[index]}@@@` + encodeURIComponent(playerUrl) + '&n=.m3u8'
                            vod_play_url += '#'
                        })
                        vod_play_url += '$$$'
                    })

                    let temp = {
                        code: 1,
                        msg: '数据列表',
                        page: 1,
                        pagecount: 1,
                        limit: '20',
                        total: 1,
                        list: [
                            {
                                vod_id: 1,
                                vod_name: '',
                                vod_pic: '',
                                vod_remarks: '',
                                type_name: '',
                                vod_year: '',
                                vod_area: '',
                                vod_actor: '',
                                vod_director: '',
                                vod_content: '',
                                vod_play_from: '',
                                vod_play_url: '',
                            },
                        ],
                    }
                    temp.list[0].vod_play_url = vod_play_url
                    temp.list[0].vod_play_from = from.join('$$$')
                    temp.list[0].vod_play_note = '$$$'
                    temp.list[0].vod_id = +ids
                    temp.list[0].vod_name = vod_name
                    temp.list[0].vod_pic = vod_pic
                    temp.list[0].vod_content = vod_content.trim()
                    backData = temp
                }
            } catch (e) {
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let parseMap = JSON.parse($.getdata('xptv-sources-nkvod-parseMap'))
            let parts = decodeURIComponent(queryParams.url).split('@@@')
            let from = parts[0]
            let url = parts[1]
            try {
                let html = await $.http.get({ url: url, headers: this.headers })

                let proData = html.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    const js = JSON.parse(_$('script:contains(player_aaaa)').html().replace('var player_aaaa=', ''))
                    let playUrl = js.url
                    if (js.encrypt == 1) {
                        playUrl = unescape(playUrl)
                    } else if (js.encrypt == 2) {
                        playUrl = unescape(base64Decode(playUrl))
                    }
                    if (/\.m3u8$/.test(playUrl)) {
                        backData.data = playUrl
                    } else {
                        const parseUrl = parseMap[from]
                        if (parseUrl) {
                            const reqUrl = parseUrl + playUrl
                            const parseHtml = (
                                await $.http.get({
                                    url: reqUrl,
                                    headers: this.headers,
                                })
                            ).body
                            const matches = parseHtml.match(/let ConFig = {([\w\W]*)},box/)
                            if (matches && matches.length > 1) {
                                const configJson = '{' + matches[1].trim() + '}'
                                const config = JSON.parse(configJson)
                                playUrl = this.decryptUrl(config)
                            }
                        }
                        backData.data = playUrl
                    }
                }
            } catch (error) {
                backData.error = error.message
            }
            return JSON.stringify(backData)
        }

        async searchVideo(queryParams) {
            // https://www.nkvod.com/index.php/ajax/suggest?mid=1&wd={wd}&limit=10
            const pg = queryParams.pg
            const wd = queryParams.wd
            let backData = {}

            try {
                let searchUrl = this.url + `/index.php/ajax/suggest?mid=1&wd=${wd}&limit=10`
                let searchRes = await $.http.get({
                    url: searchUrl,
                    headers: this.headers,
                })
                // let _$ = $.cheerio.load(searchRes.body)
                // let videos = []
                // let allVideo = _$('.search_list').find('li')
                // allVideo.each((index, element) => {
                //     let vodUrl = _$(element).find('a').attr('href') || ''
                //     let vodPic = _$(element).find('img.thumb').attr('data-original') || ''
                //     let vodName = _$(element).find('img.thumb').attr('alt') || ''
                //     let vodDiJiJi = _$(element).find('.jidi').text() || ''

                //     let videoDet = {}
                //     videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                //     videoDet.vod_pic = vodPic
                //     videoDet.vod_name = vodName
                //     videoDet.vod_remarks = vodDiJiJi.trim()
                //     videos.push(videoDet)
                // })

                // backData.code = 1
                // backData.msg = '數據列表'
                // backData.page = pg
                // // backData.pagecount = +lastPage
                // backData.limit = videos.length.toString()
                // // backData.total = videos.length * lastPage
                // backData.list = videos
                backData = JSON.stringify(searchRes.body)
            } catch (e) {
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        decryptUrl(jsConfig) {
            const key = CryptoJS.enc.Utf8.parse('2890' + jsConfig.config.uid + 'tB959C')
            const iv = CryptoJS.enc.Utf8.parse('GZ4JgN2BdSqVWJ1z')
            const mode = CryptoJS.mode.CBC
            const padding = CryptoJS.pad.Pkcs7
            const decrypted = CryptoJS.AES.decrypt(jsConfig.url, key, {
                iv: iv,
                mode: mode,
                padding: padding,
            })
            const decryptedUrl = CryptoJS.enc.Utf8.stringify(decrypted)
            return decryptedUrl
        }

        combineUrl(url) {
            if (url === undefined) {
                return ''
            }
            if (url.indexOf(this.url) !== -1) {
                return url
            }
            if (url.startsWith('/')) {
                return this.url + url
            }
            return this.url + '/' + url
        }

        isIgnoreClassName(className) {
            for (let index = 0; index < this.ignoreClassName.length; index++) {
                const element = this.ignoreClassName[index]
                if (className.indexOf(element) !== -1) {
                    return true
                }
            }
            return false
        }

        removeTrailingSlash(str) {
            if (str.endsWith('/')) {
                return str.slice(0, -1)
            }
            return str
        }
    })()
}

function kmeijuClass() {
    return new (class {
        constructor() {
            this.key = '美劇星球'
            this.url = 'https://www.kmeiju.cc'
            this.headers = {
                'User-Agent':
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
            }
            this.ignoreClassName = ['首页', '求片留言', 'APP不迷路', '备用网站']
        }

        async getClassList() {
            let webUrl = this.url
            let backData = {}
            try {
                const pro = await $.http.get({ url: webUrl, headers: this.headers })

                let proData = await pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allClass = _$('ul.navlist a')
                    let list = []
                    allClass.each((index, element) => {
                        let isIgnore = this.isIgnoreClassName(_$(element).text())
                        if (isIgnore) {
                            return
                        }
                        let type_name = _$(element).text()
                        let url = _$(element).attr('href') || ''

                        if (url.length > 0 && type_name.length > 0) {
                            let videoClass = {}
                            // videoClass.type_id = url
                            videoClass.type_id = index
                            videoClass.type_name = type_name.trim()
                            list.push(videoClass)
                        }
                    })

                    let allVideo = _$('.mi_cont .mi_btcon')
                    let videos = []
                    allVideo.each((index, element) => {
                        let nodes = _$(element).find('.bt_img ul li')
                        nodes.each((index, element) => {
                            let vodUrl = _$(element).find('a').attr('href') || ''
                            let vodPic = _$(element).find('img').attr('data-original') || ''
                            let vodName = _$(element).find('img').attr('alt') || ''
                            let vodDiJiJi = _$(element).find('.jidi').text() || ''

                            let videoDet = {}
                            videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                            videoDet.vod_pic = vodPic
                            videoDet.vod_name = vodName
                            videoDet.vod_remarks = vodDiJiJi.trim()
                            videos.push(videoDet)
                        })
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = 1
                    backData.list = videos
                    backData.class = list
                }
            } catch (e) {
                $.logErr(e)
                backData.e = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoList(queryParams) {
            const page = queryParams.pg
            const type = queryParams.t

            let realTypeName = ''
            if (type === '') return this.getClassList()
            switch (type) {
                case '1':
                    realTypeName = '/movie_kmeiju'
                    break
                case '2':
                    realTypeName = '/tv_kmeiju'
                    break
                case '3':
                    realTypeName = '/fan_kmeiju'
                    break
                case '4':
                    realTypeName = '/record'
                    break
                case '5':
                    realTypeName = '/gaofen'
                    break
            }

            let listUrl = this.removeTrailingSlash(this.url) + realTypeName + '/page/' + page
            let backData = {}
            try {
                let pro = await $.http.get({ url: listUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allVideo = _$('.bt_img.mi_ne_kd.mrb li')
                    let lastPage = _$('.pagenavi_txt a[title="跳转到最后一页"]').attr('href')
                    if (lastPage) {
                        let parts = lastPage.split('/')
                        lastPage = parts[parts.length - 1]
                    } else {
                        lastPage = '1'
                    }
                    let videos = []
                    allVideo.each((index, element) => {
                        let vodUrl = _$(element).find('a').attr('href') || ''
                        let vodPic = _$(element).find('img.thumb').attr('data-original') || ''
                        let vodName = _$(element).find('img.thumb').attr('alt') || ''
                        let vodDiJiJi = _$(element).find('.jidi span').text() ? _$(element).find('.jidi span').text() : _$(element).find('.hdinfo').text()

                        let videoDet = {}
                        videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                        videoDet.vod_pic = vodPic
                        videoDet.vod_name = vodName
                        videoDet.vod_remarks = vodDiJiJi.trim()
                        videos.push(videoDet)
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = page.toString()
                    backData.pagecount = +lastPage
                    backData.limit = videos.length.toString()
                    backData.total = videos.length * lastPage
                    backData.list = videos
                }
            } catch (e) {
                $.logErr('Error fetching list:', e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async getVideoDetail(queryParams) {
            let ids = queryParams.ids
            let backData = {}
            try {
                let webUrl = this.url + `/movie/${ids}.html`
                let pro = await $.http.get({ url: webUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let vod_name = _$('.moviedteail_tt h1').text()
                    let vod_content = _$('.yp_context p').text()
                    let vod_pic = _$('.dyimg img').attr('src')

                    let juJiDocment = _$('.paly_list_btn').find('a')
                    // let vod_play_from = '';
                    let vod_play_url = ''
                    juJiDocment.each((index, element) => {
                        vod_play_url += _$(element).text()
                        vod_play_url += '$'
                        vod_play_url += 'https://ykusu.ykusu/kmeiju/provide/vod?ac=play&url=' + encodeURIComponent(_$(element).attr('href')) + '&n=.m3u8'
                        vod_play_url += '#'
                    })

                    let temp = {
                        code: 1,
                        msg: '数据列表',
                        page: 1,
                        pagecount: 1,
                        limit: '20',
                        total: 1,
                        list: [
                            {
                                vod_id: 1,
                                vod_name: '',
                                vod_pic: '',
                                vod_remarks: '',
                                type_name: '',
                                vod_year: '',
                                vod_area: '',
                                vod_actor: '',
                                vod_director: '',
                                vod_content: '',
                                vod_play_from: '',
                                vod_play_url: '',
                            },
                        ],
                    }
                    temp.list[0].vod_play_url = vod_play_url
                    // temp.list[0].vod_play_from = play_from.join('$$$')
                    // temp.list[0].vod_play_note = '$$$'
                    temp.list[0].vod_id = +ids
                    temp.list[0].vod_name = vod_name
                    temp.list[0].vod_pic = vod_pic
                    temp.list[0].vod_content = vod_content.trim()
                    backData = temp
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let url = decodeURIComponent(queryParams.url)
            try {
                let html = await $.http.get({ url: url, headers: this.headers })

                let proData = html.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let iframe = _$('.viframe').attr('src')
                    let iframeRes = await $.http.get({ url: iframe, headers: this.headers })
                    let config = JSON.parse('{' + iframeRes.body.match(/ConFig = \{(.*)\}/)[1] + '}')
                    let playUrl = this.decryptUrl(config)
                    backData.data = playUrl
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async searchVideo(queryParams) {
            const pg = queryParams.pg
            const wd = queryParams.wd
            let backData = {}

            try {
                let searchUrl = this.url + '/?s=' + wd
                let searchRes = await $.http.get({
                    url: searchUrl,
                    headers: this.headers,
                })
                let _$ = $.cheerio.load(searchRes.body)
                let videos = []
                let allVideo = _$('.search_list').find('li')
                allVideo.each((index, element) => {
                    let vodUrl = _$(element).find('a').attr('href') || ''
                    let vodPic = _$(element).find('img.thumb').attr('data-original') || ''
                    let vodName = _$(element).find('img.thumb').attr('alt') || ''
                    let vodDiJiJi = _$(element).find('.jidi').text() || ''

                    let videoDet = {}
                    videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                    videoDet.vod_pic = vodPic
                    videoDet.vod_name = vodName
                    videoDet.vod_remarks = vodDiJiJi.trim()
                    videos.push(videoDet)
                })

                backData.code = 1
                backData.msg = '數據列表'
                backData.page = pg
                backData.limit = videos.length.toString()
                backData.list = videos
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        decryptUrl(jsConfig) {
            const key = CryptoJS.enc.Utf8.parse('2890' + jsConfig.config.uid + 'tB959C')
            const iv = CryptoJS.enc.Utf8.parse('2F131BE91247866E')
            const mode = CryptoJS.mode.CBC
            const padding = CryptoJS.pad.Pkcs7
            const decrypted = CryptoJS.AES.decrypt(jsConfig.url, key, {
                iv: iv,
                mode: mode,
                padding: padding,
            })
            const decryptedUrl = CryptoJS.enc.Utf8.stringify(decrypted)

            return decryptedUrl
        }

        combineUrl(url) {
            if (url === undefined) {
                return ''
            }
            if (url.indexOf(this.url) !== -1) {
                return url
            }
            if (url.startsWith('/')) {
                return this.url + url
            }
            return this.url + '/' + url
        }

        isIgnoreClassName(className) {
            return this.ignoreClassName.some((element) => className.includes(element))
        }

        removeTrailingSlash(str) {
            if (str.endsWith('/')) {
                return str.slice(0, -1)
            }
            return str
        }
    })()
}

function duanjuttClass() {
    return new (class {
        constructor() {
            this.url = 'https://duanjutt.tv'
            this.headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            }
            this.ignoreClassName = ['首页', '明星']
        }

        async getClassList() {
            let webUrl = this.url
            let backData = {}
            try {
                const pro = await $.http.get({ url: webUrl, headers: this.headers })

                let proData = await pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allClass = _$('.dropdown-box ul li a')
                    let list = []
                    allClass.each((index, element) => {
                        let isIgnore = this.isIgnoreClassName(_$(element).text())
                        if (isIgnore) {
                            return
                        }
                        let type_name = _$(element).text().split('（')[0]
                        let url = _$(element).attr('href') || ''
                        url = url.match(/vodtype\/(.*)\.html/)[1]

                        if (url.length > 0 && type_name.length > 0) {
                            let videoClass = {}
                            videoClass.type_id = parseInt(url)
                            videoClass.type_name = type_name.trim()
                            list.push(videoClass)
                        }
                    })

                    let allVideo = _$('.myui-vodlist')
                    let videos = []
                    allVideo.each((index, element) => {
                        let nodes = _$(element).find('li')
                        nodes.each((index, element) => {
                            let vodUrl = _$(element).find('a.myui-vodlist__thumb').attr('href') || ''
                            let vodPic = _$(element).find('a.myui-vodlist__thumb').attr('data-original') || ''
                            let vodName = _$(element).find('a.myui-vodlist__thumb').attr('title') || ''
                            let vodDiJiJi = _$(element).find('.pic-text').text() || ''

                            if (!vodPic.includes('http')) vodPic = this.url + vodPic

                            let videoDet = {}
                            videoDet.vod_id = +vodUrl.match(/voddetail\/(.+)\.html/)[1]
                            videoDet.vod_pic = vodPic
                            videoDet.vod_name = vodName
                            videoDet.vod_remarks = vodDiJiJi.trim()
                            videos.push(videoDet)
                        })
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = 1
                    backData.list = videos
                    backData.class = list
                }
            } catch (e) {
                $.logErr(e)
                backData.e = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoList(queryParams) {
            const page = queryParams.pg
            const type = queryParams.t

            if (type === '') return this.getClassList()

            let listUrl = `${this.url}/vodtype/${type}-${page}.html`
            let backData = {}
            try {
                let pro = await $.http.get({ url: listUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allVideo = _$('.myui-vodlist li')
                    let lastPage = _$('.myui-page').children('li').last().find('a').attr('href')
                    if (lastPage) {
                        let regex = new RegExp(`/vodtype\/${type}-(.*)\.html`)
                        lastPage = lastPage.match(regex)[1]
                    } else {
                        lastPage = '1'
                    }
                    let videos = []
                    allVideo.each((index, element) => {
                        let vodUrl = _$(element).find('a.myui-vodlist__thumb').attr('href') || ''
                        let vodPic = _$(element).find('a.myui-vodlist__thumb').attr('data-original') || ''
                        let vodName = _$(element).find('a.myui-vodlist__thumb').attr('title') || ''
                        let vodDiJiJi = _$(element).find('.pic-text').text() || ''

                        if (!vodPic.includes('http')) vodPic = this.url + vodPic

                        let videoDet = {}
                        videoDet.vod_id = +vodUrl.match(/voddetail\/(.+)\.html/)[1]
                        videoDet.vod_pic = vodPic
                        videoDet.vod_name = vodName
                        videoDet.vod_remarks = vodDiJiJi.trim()
                        videos.push(videoDet)
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = page.toString()
                    backData.pagecount = +lastPage
                    backData.limit = videos.length.toString()
                    backData.total = videos.length * lastPage
                    backData.list = videos
                }
            } catch (e) {
                $.logErr('Error fetching list:', e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async getVideoDetail(queryParams) {
            let ids = queryParams.ids
            let backData = {}
            try {
                let webUrl = this.url + `/voddetail/${ids}.html`
                let pro = await $.http.get({ url: webUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let vod_name = _$('h1.title').text()
                    let vod_content = _$('.context span.content').text()
                    let vod_pic = _$('a.myui-vodlist__thumb img').attr('data-original')

                    if (!vod_pic.includes('http')) vod_pic = this.url + vod_pic

                    let juJiDocment = _$('#playlist1').find('a')
                    // let vod_play_from = '';
                    let vod_play_url = ''
                    juJiDocment.each((index, element) => {
                        vod_play_url += _$(element).text()
                        vod_play_url += '$'
                        vod_play_url +=
                            'https://ykusu.ykusu/duanjutt/provide/vod?ac=play&url=' + encodeURIComponent(this.combineUrl(_$(element).attr('href'))) + '&n=.m3u8'
                        vod_play_url += '#'
                    })

                    let temp = {
                        code: 1,
                        msg: '数据列表',
                        page: 1,
                        pagecount: 1,
                        limit: '20',
                        total: 1,
                        list: [
                            {
                                vod_id: 1,
                                vod_name: '',
                                vod_pic: '',
                                vod_remarks: '',
                                type_name: '',
                                vod_year: '',
                                vod_area: '',
                                vod_actor: '',
                                vod_director: '',
                                vod_content: '',
                                vod_play_from: '',
                                vod_play_url: '',
                            },
                        ],
                    }
                    temp.list[0].vod_play_url = vod_play_url
                    // temp.list[0].vod_play_from = play_from.join('$$$')
                    // temp.list[0].vod_play_note = '$$$'
                    temp.list[0].vod_id = +ids
                    temp.list[0].vod_name = vod_name
                    temp.list[0].vod_pic = vod_pic
                    temp.list[0].vod_content = vod_content.trim()
                    backData = temp
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let url = decodeURIComponent(queryParams.url)
            try {
                let html = await $.http.get({ url: url, headers: this.headers })

                let proData = html.body
                if (proData) {
                    let playUrl
                    let player = proData.match(/r player.*=\{(.*)\}/)[1]
                    let config = JSON.parse(`{${player}}`)
                    if (config.encrypt === 0) {
                        playUrl = config.url
                    } else {
                        $.msg('還沒寫，@ykusu叫他寫')
                    }
                    backData.data = playUrl
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async searchVideo(queryParams) {
            const pg = queryParams.pg
            const wd = queryParams.wd
            let backData = {}

            try {
                let searchUrl = this.url + '/?s=' + wd
                let searchRes = await $.http.get({
                    url: searchUrl,
                    headers: this.headers,
                })
                let _$ = $.cheerio.load(searchRes.body)
                let videos = []
                let allVideo = _$('.search_list').find('li')
                allVideo.each((index, element) => {
                    let vodUrl = _$(element).find('a').attr('href') || ''
                    let vodPic = _$(element).find('img.thumb').attr('data-original') || ''
                    let vodName = _$(element).find('img.thumb').attr('alt') || ''
                    let vodDiJiJi = _$(element).find('.jidi').text() || ''

                    let videoDet = {}
                    videoDet.vod_id = +vodUrl.match(/movie\/(.+)\.html/)[1]
                    videoDet.vod_pic = vodPic
                    videoDet.vod_name = vodName
                    videoDet.vod_remarks = vodDiJiJi.trim()
                    videos.push(videoDet)
                })

                backData.code = 1
                backData.msg = '數據列表'
                backData.page = pg
                backData.limit = videos.length.toString()
                backData.list = videos
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        decryptUrl(jsConfig) {
            const key = CryptoJS.enc.Utf8.parse('2890' + jsConfig.config.uid + 'tB959C')
            const iv = CryptoJS.enc.Utf8.parse('2F131BE91247866E')
            const mode = CryptoJS.mode.CBC
            const padding = CryptoJS.pad.Pkcs7
            const decrypted = CryptoJS.AES.decrypt(jsConfig.url, key, {
                iv: iv,
                mode: mode,
                padding: padding,
            })
            const decryptedUrl = CryptoJS.enc.Utf8.stringify(decrypted)

            return decryptedUrl
        }

        combineUrl(url) {
            if (url === undefined) {
                return ''
            }
            if (url.indexOf(this.url) !== -1) {
                return url
            }
            if (url.startsWith('/')) {
                return this.url + url
            }
            return this.url + '/' + url
        }

        isIgnoreClassName(className) {
            return this.ignoreClassName.some((element) => className.includes(element))
        }

        removeTrailingSlash(str) {
            if (str.endsWith('/')) {
                return str.slice(0, -1)
            }
            return str
        }
    })()
}

function sxClass() {
    return new (class {
        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let url = decodeURIComponent(queryParams.url)
            url = base64Decode('aHR0cHM6Ly9qc29uLnN1eHVuLnNpdGUvcGxheWVyL2FydHBsYXllci5waHA/aWY9MSZmcm9tPXN1eHVuangmdXJsPQ==') + url
            try {
                let html = await $.http.get({ url: url, headers: this.headers })

                let proData = html.body
                if (proData) {
                    let playUrl
                    const matches = proData.match(/let ConFig = {([\w\W]*)},box/)
                    if (proData && proData.length > 1) {
                        const configJson = '{' + matches[1].trim() + '}'
                        const config = JSON.parse(configJson)
                        playUrl = this.decryptUrl(config)
                    }
                    backData.data = playUrl
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        decryptUrl(jsConfig) {
            const key = CryptoJS.enc.Utf8.parse('2890' + jsConfig.config.uid + 'tB959C')
            const iv = CryptoJS.enc.Utf8.parse('2F131BE941093035')
            const mode = CryptoJS.mode.CBC
            const padding = CryptoJS.pad.Pkcs7
            const decrypted = CryptoJS.AES.decrypt(jsConfig.url, key, {
                iv: iv,
                mode: mode,
                padding: padding,
            })
            const decryptedUrl = CryptoJS.enc.Utf8.stringify(decrypted)

            return decryptedUrl
        }
    })()
}

function anfunsClass() {
    return new (class {
        constructor() {
            this.url = 'https://www.anfuns.cc'
            this.headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                Referer: this.url,
            }
            this.ignoreClassName = ['首页', '爱发电', 'QQ', '动漫资讯', '专题', '留言', '最新', '排行']
        }

        async getClassList() {
            let webUrl = this.url
            let backData = {}
            try {
                const pro = await $.http.get({ url: webUrl, headers: this.headers })

                let proData = await pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allClass = _$('.hl-menus li a')
                    let list = []
                    allClass.each((index, element) => {
                        let isIgnore = this.isIgnoreClassName(_$(element).find('span').text())
                        if (isIgnore) {
                            return
                        }
                        let type_name = _$(element).find('span').text()
                        let url = _$(element).attr('href') || ''
                        // url = url.match(/type\/(\d+)\.html/)[1]

                        if (url.length > 0 && type_name.length > 0) {
                            let videoClass = {}
                            videoClass.type_id = parseInt(url.match(/type\/(\d+)\.html/)[1])
                            videoClass.type_name = type_name.trim()
                            list.push(videoClass)
                        }
                    })

                    let allVideo = _$('.hl-row-box')
                    let videos = []
                    allVideo.each((index, element) => {
                        let nodes = _$(element).find('li.hl-list-item')
                        nodes.each((index, element) => {
                            let vodUrl = _$(element).find('a.hl-item-thumb').attr('href') || ''
                            let vodPic = _$(element).find('a.hl-item-thumb').attr('data-original') || ''
                            let vodName = _$(element).find('a.hl-item-thumb').attr('title') || ''
                            let vodDiJiJi = _$(element).find('span.remarks').text() || ''

                            if (!vodUrl.includes('/anime/')) return
                            if (!vodPic.includes('http')) vodPic = this.url + vodPic

                            let videoDet = {}
                            videoDet.vod_id = +vodUrl.match(/anime\/(.+)\.html/)[1]
                            videoDet.vod_pic = vodPic
                            videoDet.vod_name = vodName
                            videoDet.vod_remarks = vodDiJiJi.trim()
                            videos.push(videoDet)
                        })
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = 1
                    backData.list = videos
                    backData.class = list
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoList(queryParams) {
            const page = queryParams.pg
            const type = queryParams.t

            if (type === '') return this.getClassList()

            let listUrl = `${this.url}/type/${type}-${page}.html`
            let backData = {}
            try {
                let pro = await $.http.get({ url: listUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allVideo = _$('.hl-list-item')
                    let lastPage = _$('.hl-page-wrap li.hl-hidden-xs').eq(4).find('a').attr('href')
                    if (lastPage) {
                        let regex = new RegExp(`/type\/${type}-(.*)\.html`)
                        lastPage = lastPage.match(regex)[1]
                    } else {
                        lastPage = '1'
                    }
                    let videos = []
                    allVideo.each((index, element) => {
                        let vodUrl = _$(element).find('a.hl-item-thumb').attr('href') || ''
                        let vodPic = _$(element).find('a.hl-item-thumb').attr('data-original') || ''
                        let vodName = _$(element).find('a.hl-item-thumb').attr('title') || ''
                        let vodDiJiJi = _$(element).find('span.remarks').text() || ''

                        if (!vodPic.includes('http')) vodPic = this.url + vodPic

                        let videoDet = {}
                        videoDet.vod_id = +vodUrl.match(/anime\/(.+)\.html/)[1]
                        videoDet.vod_pic = vodPic
                        videoDet.vod_name = vodName.trim()
                        videoDet.vod_remarks = vodDiJiJi.trim()
                        videos.push(videoDet)
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = page.toString()
                    backData.pagecount = +lastPage
                    backData.limit = videos.length.toString()
                    backData.total = videos.length * lastPage
                    backData.list = videos
                }
            } catch (e) {
                $.logErr('Error fetching list:', e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async getVideoDetail(queryParams) {
            let ids = queryParams.ids
            let backData = {}
            try {
                let webUrl = this.url + `/anime/${ids}.html`
                let pro = await $.http.get({ url: webUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let vod_name = _$('h2.hl-dc-title').text()
                    let vod_content = _$('.hl-content-text').text()
                    let vod_pic = _$('.hl-item-thumb').attr('data-original')

                    // if (!vod_pic.includes('http')) vod_pic = this.url + vod_pic

                    let from = []
                    _$('.hl-plays-from a').each((i, e) => {
                        let name = _$(e).text().trim()
                        from.push(name)
                    })

                    let juJiDocment = _$('ul.hl-plays-list')
                    let playlist = []
                    juJiDocment.each((index, element) => {
                        let videos = _$(element).find('li a')
                        let vod_play_url = ''
                        videos.each((i, e) => {
                            vod_play_url += from[index] + '-' + _$(e).text()
                            vod_play_url += '$'
                            vod_play_url +=
                                'https://ykusu.ykusu/anfuns/provide/vod?ac=play&url=' + encodeURIComponent(this.combineUrl(_$(e).attr('href'))) + '&n=.m3u8'
                            vod_play_url += '#'
                        })
                        playlist.push(vod_play_url)
                    })

                    let temp = {
                        code: 1,
                        msg: '数据列表',
                        page: 1,
                        pagecount: 1,
                        limit: '20',
                        total: 1,
                        list: [
                            {
                                vod_id: 1,
                                vod_name: '',
                                vod_pic: '',
                                vod_remarks: '',
                                type_name: '',
                                vod_year: '',
                                vod_area: '',
                                vod_actor: '',
                                vod_director: '',
                                vod_content: '',
                                vod_play_from: '',
                                vod_play_url: '',
                            },
                        ],
                    }
                    temp.list[0].vod_play_url = playlist.join('$$$')
                    temp.list[0].vod_play_from = from.join('$$$')
                    temp.list[0].vod_play_note = '$$$'
                    temp.list[0].vod_id = +ids
                    temp.list[0].vod_name = vod_name
                    temp.list[0].vod_pic = vod_pic
                    temp.list[0].vod_content = vod_content.trim()
                    backData = temp
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let url = decodeURIComponent(queryParams.url)
            try {
                let html = await $.http.get({ url: url, headers: this.headers })

                let proData = html.body
                if (proData) {
                    const _$ = $.cheerio.load(proData)
                    let config = JSON.parse(_$('script:contains(player_)').html().replace('var player_aaaa=', ''))
                    // $.log(decodeURIComponent(base64Decode(config.url)))
                    let playUrl = decodeURIComponent(base64Decode(config.url))
                    backData.data = playUrl
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async searchVideo(queryParams) {
            const pg = queryParams.pg
            const wd = queryParams.wd
            let backData = {}

            try {
                let searchUrl = this.url + `/search/page/${pg}/wd/${wd}.html`
                let searchRes = await $.http.get({
                    url: searchUrl,
                    headers: this.headers,
                })
                let _$ = $.cheerio.load(searchRes.body)
                let videos = []
                let allVideo = _$('li.hl-list-item')
                allVideo.each((index, element) => {
                    let vodUrl = _$(element).find('a.hl-item-thumb').attr('href') || ''
                    let vodPic = _$(element).find('a.hl-item-thumb').attr('data-original') || ''
                    let vodName = _$(element).find('a.hl-item-thumb').attr('title') || ''
                    let vodDiJiJi = _$(element).find('span.remarks').text() || ''

                    let videoDet = {}
                    videoDet.vod_id = +vodUrl.match(/anime\/(.+)\.html/)[1]
                    videoDet.vod_pic = vodPic
                    videoDet.vod_name = vodName.trim()
                    videoDet.vod_remarks = vodDiJiJi.trim()
                    videos.push(videoDet)
                })

                backData.code = 1
                backData.msg = '數據列表'
                backData.page = pg
                backData.limit = videos.length.toString()
                backData.list = videos
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        combineUrl(url) {
            if (url === undefined) {
                return ''
            }
            if (url.indexOf(this.url) !== -1) {
                return url
            }
            if (url.startsWith('/')) {
                return this.url + url
            }
            return this.url + '/' + url
        }

        isIgnoreClassName(className) {
            return this.ignoreClassName.some((element) => className.includes(element))
        }

        removeTrailingSlash(str) {
            if (str.endsWith('/')) {
                return str.slice(0, -1)
            }
            return str
        }
    })()
}

// TODO
function newvisionClass() {
    return new (class {
        constructor() {
            // 發布頁: kan80.app
            this.url = 'https://www.6080yy3.com'
            this.headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                Referer: this.url,
            }
            this.ignoreClassName = ['首页', '留言求片', '发布页', 'App']
        }

        async getClassList() {
            let webUrl = this.url
            let backData = {}
            try {
                const pro = await $.http.get({ url: webUrl, headers: this.headers })

                let proData = await pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allClass = _$('.nav-menu-items > .nav-menu-item > a')
                    let list = []
                    allClass.each((index, element) => {
                        let isIgnore = this.isIgnoreClassName(_$(element).text())
                        if (isIgnore) {
                            return
                        }
                        let type_name = _$(element).text()
                        let url = _$(element).attr('href') || ''
                        url = url.match(/vodtype\/(\d+)\.html/)[1]

                        if (url.length > 0 && type_name.length > 0) {
                            let videoClass = {}
                            videoClass.type_id = parseInt(url)
                            videoClass.type_name = type_name.trim()
                            list.push(videoClass)
                        }
                    })

                    let allVideo = _$('.module-items')
                    let videos = []
                    allVideo.each((index, element) => {
                        let nodes = _$(element).find('.module-item')
                        nodes.each((index, element) => {
                            let vodUrl = _$(element).find('.module-item-cover .module-item-pic a').attr('href') || ''
                            let vodPic = _$(element).find('.module-item-cover .module-item-pic img').attr('data-src') || ''
                            let vodName = _$(element).find('.module-item-cover .module-item-pic a').attr('title') || ''
                            let vodDiJiJi = _$(element).find('.module-item-text').text() || ''

                            let videoDet = {}
                            videoDet.vod_id = +vodUrl.match(/video\/(.+)\.html/)[1]
                            videoDet.vod_pic = vodPic
                            videoDet.vod_name = vodName
                            videoDet.vod_remarks = vodDiJiJi.trim()
                            videos.push(videoDet)
                        })
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = 1
                    backData.list = videos
                    backData.class = list
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoList(queryParams) {
            const page = queryParams.pg
            const type = queryParams.t

            if (type === '') return this.getClassList()

            let listUrl = `${this.url}/type/${type}-${page}.html`
            let backData = {}
            try {
                let pro = await $.http.get({ url: listUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allVideo = _$('.hl-list-item')
                    let lastPage = _$('.hl-page-wrap li.hl-hidden-xs').eq(4).find('a').attr('href')
                    if (lastPage) {
                        let regex = new RegExp(`/type\/${type}-(.*)\.html`)
                        lastPage = lastPage.match(regex)[1]
                    } else {
                        lastPage = '1'
                    }
                    let videos = []
                    allVideo.each((index, element) => {
                        let vodUrl = _$(element).find('a.hl-item-thumb').attr('href') || ''
                        let vodPic = _$(element).find('a.hl-item-thumb').attr('data-original') || ''
                        let vodName = _$(element).find('a.hl-item-thumb').attr('title') || ''
                        let vodDiJiJi = _$(element).find('span.remarks').text() || ''

                        if (!vodPic.includes('http')) vodPic = this.url + vodPic

                        let videoDet = {}
                        videoDet.vod_id = +vodUrl.match(/anime\/(.+)\.html/)[1]
                        videoDet.vod_pic = vodPic
                        videoDet.vod_name = vodName.trim()
                        videoDet.vod_remarks = vodDiJiJi.trim()
                        videos.push(videoDet)
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = page.toString()
                    backData.pagecount = +lastPage
                    backData.limit = videos.length.toString()
                    backData.total = videos.length * lastPage
                    backData.list = videos
                }
            } catch (e) {
                $.logErr('Error fetching list:', e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async getVideoDetail(queryParams) {
            let ids = queryParams.ids
            let backData = {}
            try {
                let webUrl = this.url + `/video/${ids}.html`
                let pro = await $.http.get({ url: webUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let vod_name = _$('h2.hl-dc-title').text()
                    let vod_content = _$('.hl-content-text').text()
                    let vod_pic = _$('.hl-item-thumb').attr('data-original')

                    // if (!vod_pic.includes('http')) vod_pic = this.url + vod_pic

                    let from = []
                    _$('.hl-plays-from a').each((i, e) => {
                        let name = _$(e).text().trim()
                        from.push(name)
                    })

                    let juJiDocment = _$('ul.hl-plays-list')
                    let playlist = []
                    juJiDocment.each((index, element) => {
                        let videos = _$(element).find('li a')
                        let vod_play_url = ''
                        videos.each((i, e) => {
                            vod_play_url += from[index] + '-' + _$(e).text()
                            vod_play_url += '$'
                            vod_play_url +=
                                'https://ykusu.ykusu/anfuns/provide/vod?ac=play&url=' + encodeURIComponent(this.combineUrl(_$(e).attr('href'))) + '&n=.m3u8'
                            vod_play_url += '#'
                        })
                        playlist.push(vod_play_url)
                    })

                    let temp = {
                        code: 1,
                        msg: '数据列表',
                        page: 1,
                        pagecount: 1,
                        limit: '20',
                        total: 1,
                        list: [
                            {
                                vod_id: 1,
                                vod_name: '',
                                vod_pic: '',
                                vod_remarks: '',
                                type_name: '',
                                vod_year: '',
                                vod_area: '',
                                vod_actor: '',
                                vod_director: '',
                                vod_content: '',
                                vod_play_from: '',
                                vod_play_url: '',
                            },
                        ],
                    }
                    temp.list[0].vod_play_url = playlist.join('$$$')
                    temp.list[0].vod_play_from = from.join('$$$')
                    temp.list[0].vod_play_note = '$$$'
                    temp.list[0].vod_id = +ids
                    temp.list[0].vod_name = vod_name
                    temp.list[0].vod_pic = vod_pic
                    temp.list[0].vod_content = vod_content.trim()
                    backData = temp
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let url = decodeURIComponent(queryParams.url)
            try {
                let html = await $.http.get({ url: url, headers: this.headers })

                let proData = html.body
                if (proData) {
                    const _$ = $.cheerio.load(proData)
                    let config = JSON.parse(_$('script:contains(player_)').html().replace('var player_aaaa=', ''))
                    // $.log(decodeURIComponent(base64Decode(config.url)))
                    let playUrl = decodeURIComponent(base64Decode(config.url))
                    backData.data = playUrl
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async searchVideo(queryParams) {
            const pg = queryParams.pg
            const wd = queryParams.wd
            let backData = {}

            try {
                let searchUrl = this.url + `/search/page/${pg}/wd/${wd}.html`
                let searchRes = await $.http.get({
                    url: searchUrl,
                    headers: this.headers,
                })
                let _$ = $.cheerio.load(searchRes.body)
                let videos = []
                let allVideo = _$('li.hl-list-item')
                allVideo.each((index, element) => {
                    let vodUrl = _$(element).find('a.hl-item-thumb').attr('href') || ''
                    let vodPic = _$(element).find('a.hl-item-thumb').attr('data-original') || ''
                    let vodName = _$(element).find('a.hl-item-thumb').attr('title') || ''
                    let vodDiJiJi = _$(element).find('span.remarks').text() || ''

                    let videoDet = {}
                    videoDet.vod_id = +vodUrl.match(/anime\/(.+)\.html/)[1]
                    videoDet.vod_pic = vodPic
                    videoDet.vod_name = vodName.trim()
                    videoDet.vod_remarks = vodDiJiJi.trim()
                    videos.push(videoDet)
                })

                backData.code = 1
                backData.msg = '數據列表'
                backData.page = pg
                backData.limit = videos.length.toString()
                backData.list = videos
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        combineUrl(url) {
            if (url === undefined) {
                return ''
            }
            if (url.indexOf(this.url) !== -1) {
                return url
            }
            if (url.startsWith('/')) {
                return this.url + url
            }
            return this.url + '/' + url
        }

        isIgnoreClassName(className) {
            return this.ignoreClassName.some((element) => className.includes(element))
        }

        removeTrailingSlash(str) {
            if (str.endsWith('/')) {
                return str.slice(0, -1)
            }
            return str
        }
    })()
}

function zeqahtClass() {
    return new (class {
        constructor() {
            this.url = 'https://api.zeqaht.com'
            this.headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            }
        }

        async getClassList(page) {
            let pg = page ? page : 1
            let webUrl = this.url + '/api.php/provide/vod/?ac=detail&t=' + `&pg=${pg}`
            let backData = {}
            try {
                const pro = await $.http.get({ url: webUrl, headers: this.headers })

                let proData = pro.body
                if (proData) {
                    let obj = JSON.parse(proData)
                    let categories = [
                        { type_id: 1, type_name: '电影' },
                        { type_id: 22, type_name: '喜剧' },
                        { type_id: 23, type_name: '动作' },
                        { type_id: 30, type_name: '科幻' },
                        { type_id: 26, type_name: '爱情' },
                        { type_id: 27, type_name: '悬疑' },
                        { type_id: 87, type_name: '奇幻' },
                        { type_id: 37, type_name: '剧情' },
                        { type_id: 36, type_name: '恐怖' },
                        { type_id: 35, type_name: '犯罪' },
                        { type_id: 33, type_name: '动画' },
                        { type_id: 34, type_name: '惊悚' },
                        { type_id: 25, type_name: '战争' },
                        { type_id: 31, type_name: '冒险' },
                        { type_id: 81, type_name: '灾难' },
                        { type_id: 83, type_name: '伦理' },
                        { type_id: 43, type_name: '其他' },
                        { type_id: 2, type_name: '电视剧' },
                        { type_id: 14, type_name: '国产剧' },
                        { type_id: 15, type_name: '欧美剧' },
                        { type_id: 16, type_name: '港台剧' },
                        { type_id: 62, type_name: '日韩剧' },
                        { type_id: 68, type_name: '其他剧' },
                        // { type_id: 88, type_name: '短剧' },
                        { type_id: 3, type_name: '综艺' },
                        { type_id: 69, type_name: '国产综艺' },
                        { type_id: 70, type_name: '港台综艺' },
                        { type_id: 72, type_name: '日韩综艺' },
                        { type_id: 73, type_name: '欧美综艺' },
                        { type_id: 74, type_name: '其他综艺' },
                        { type_id: 4, type_name: '动漫' },
                        { type_id: 75, type_name: '国产动漫' },
                        { type_id: 76, type_name: '日韩动漫' },
                        { type_id: 77, type_name: '欧美动漫' },
                    ]

                    obj.class = categories
                    backData = obj
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoList(queryParams) {
            const page = queryParams.pg
            const type = queryParams.t

            if (type === '') return this.getClassList(page)

            let listUrl = `${this.url}/index.php/ajax/data?mid=1&tid=${type}&page=${page}&limit=20`
            let backData = {}
            try {
                let pro = await $.http.get({ url: listUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let obj = JSON.parse(proData)
                    obj.list.forEach((e) => {
                        if (!e.vod_pic.includes('http')) e.vod_pic = 'https://obs.gduamoe.com' + e.vod_pic
                    })
                    backData = obj
                }
            } catch (e) {
                $.logErr('Error fetching list:', e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async getVideoDetail(queryParams) {
            let ids = queryParams.ids
            let backData = {}
            try {
                let webUrl = this.url + `/api.php/provide/vod?ac=detail&ids=${ids}`
                let pro = await $.http.get({ url: webUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let obj = JSON.parse(proData)
                    let play_url = obj.list[0].vod_play_url
                    let playlist = play_url.split('#')
                    let newPlaylist = []
                    playlist.forEach((e, i) => {
                        let parts = e.split('$')
                        let name = parts[0]
                        let url = `https://ykusu.ykusu/zeqaht/provide/vod?ac=play&id=${obj.list[0].vod_id}&index=${i}&n=.m3u8`
                        newPlaylist.push(name + '$' + url)
                    })
                    obj.list[0].vod_play_url = newPlaylist.join('#')
                    backData = obj
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let id = queryParams.id
            let index = queryParams.index
            let detailPage = base64Decode('aHR0cHM6Ly93d3cuZ2h3OXp3cDUuY29tL2RldGFpbC8=') + id
            try {
                let dres = await $.http.get({ url: detailPage, headers: this.headers })
                let _$ = $.cheerio.load(dres.body)
                let item = _$('div[class^="detail__PlayListBox"]').find('div.listitem').eq(index)
                let nid = item
                    .find('a')
                    .attr('href')
                    .match(/\/sid\/(.+)/)[1]
                let url = `${base64Decode('aHR0cHM6Ly93d3cuZ2h3OXp3cDUuY29tL2FwaS9tdy1tb3ZpZS9hbm9ueW1vdXMvdmlkZW8vZXBpc29kZS91cmw=')}?id=${id}&nid=${nid}`
                let signKey = base64Decode('Y2I4MDg1MjliYWU2YjZiZTQ1ZWNmYWIyOWE0ODg5YmM=')
                let dataStr = url.split('?')[1]
                let t = Date.now()
                let signStr = dataStr + `&key=${signKey}` + `&t=${t}`

                let pro = await $.http.get({
                    url: url,
                    headers: {
                        'User-Agent': this.headers['User-Agent'],
                        deviceId: this.getUUID(),
                        t: t,
                        sign: CryptoJS.SHA1(CryptoJS.MD5(signStr).toString()).toString(),
                    },
                })
                let proData = pro.body
                if (proData) {
                    let obj = JSON.parse(proData)
                    let playUrl = obj.data
                    backData.data = playUrl
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async searchVideo(queryParams) {
            const pg = queryParams.pg
            const wd = queryParams.wd
            let backData = {}

            try {
                let searchUrl = this.url + `/api.php/provide/vod?ac=detail&wd=${wd}&pg=${pg}`
                let searchRes = await $.http.get({
                    url: searchUrl,
                    headers: this.headers,
                })
                backData = JSON.parse(searchRes.body)
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        getUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (e) => ('x' === e ? (16 * Math.random()) | 0 : 'r&0x3' | '0x8').toString(16))
        }
    })()
}

function mgtimiClass() {
    // close
    return new (class {
        constructor() {
            this.headers = {
                'User-Agent': 'MGTV-iPhone-appstore/8.0.2 (iPhone; iOS 17.1; Scale/3.00)',
            }
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let url = decodeURIComponent(queryParams.url)
            let id = url.match(/b\/(.*)\/(.*)\.html/)[2]

            try {
                let html = await $.http.get({ url: getSource, headers: this.headers })

                let proData = html.body
                if (proData) {
                    let obj = JSON.parse(proData)
                    if (obj.code == 10023) {
                        $.msg(obj.msg)
                        backData.data = null
                    } else {
                        let videoSource = obj.data.videoSources[0]
                        let videoUrl = videoSource.url
                        let vres = await $.http.get({ url: videoUrl, headers: this.headers })
                        if (vres.body) {
                            let playUrl = JSON.parse(vres.body).info
                            backData.data = playUrl
                        }
                    }
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }
    })()
}

function dsakf23665Class() {
    return new (class {
        constructor() {
            this.headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            }
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let parts = queryParams.url.split('@@@')
            let id = parts[0]
            let from = parts[1]
            let url = decodeURIComponent(parts[2])
            let parseUrl = 'http://dsakf23665.com/api.php/v1.home/parseurl'
            let body = {
                vod_id: id,
                from: from,
                url: url,
                index: 0,
            }
            try {
                let resp = await $.http.post({
                    url: parseUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': this.headers['User-Agent'],
                    },
                    body: JSON.stringify(body),
                })

                let playUrl = JSON.parse(resp.body).data.url
                if (!playUrl.startsWith('http')) {
                    $.msg('解析失敗')
                }
                backData.data = playUrl
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }
    })()
}

function nonoClass() {
    return new (class {
        constructor() {
            this.url = 'https://www.novipnoad.net'
            this.headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            }
            this.ignoreClassName = ['首页', '剧集']
        }

        async getClassList() {
            let webUrl = this.url
            let backData = {}
            try {
                const pro = await $.http.get({ url: webUrl, headers: this.headers })

                let proData = await pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allClass = _$('.main-menu .nav-ul-menu a')
                    let list = []
                    allClass.each((index, element) => {
                        let isIgnore = this.isIgnoreClassName(_$(element).text())
                        if (isIgnore) {
                            return
                        }
                        let type_name = _$(element).text()
                        let url = _$(element).attr('href') || ''
                        // url = url.match(/type\/(\d+)\.html/)[1]

                        if (url.length > 0 && type_name.length > 0) {
                            let videoClass = {}
                            videoClass.type_id = index
                            videoClass.type_name = type_name.trim()
                            list.push(videoClass)
                        }
                    })

                    let allVideo = _$('.smart-box')
                    let videos = []
                    allVideo.each((index, element) => {
                        let nodes = _$(element).find('.video-item')
                        nodes.each((index, element) => {
                            let vodUrl = _$(element).find('a').attr('href') || ''
                            let vodPic = _$(element).find('a img').attr('data-original') || ''
                            let vodName = _$(element).find('a').attr('title') || ''
                            let vodDiJiJi = _$(element).find('span.remarks').text() || ''

                            let videoDet = {}
                            videoDet.vod_id = +vodUrl.match(/net\/.+\/(.+)\.html/)[1]
                            videoDet.vod_pic = vodPic
                            videoDet.vod_name = vodName.replace(/(【.*?】)/g, '')
                            videoDet.vod_remarks = vodDiJiJi.trim()
                            videos.push(videoDet)
                        })
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = 1
                    backData.list = videos
                    backData.class = list
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoList(queryParams) {
            const page = queryParams.pg
            const type = queryParams.t

            let realTypeName = ''
            if (type === '') return this.getClassList()
            switch (type) {
                case '2':
                    realTypeName = '/tv/hongkong'
                    break
                case '3':
                    realTypeName = '/tv/taiwan'
                    break
                case '4':
                    realTypeName = '/tv/western'
                    break
                case '5':
                    realTypeName = '/tv/japan'
                    break
                case '6':
                    realTypeName = '/tv/korea'
                    break
                case '7':
                    realTypeName = '/tv/thailand'
                    break
                case '8':
                    realTypeName = '/tv/turkey'
                    break
                case '9':
                    realTypeName = '/movie'
                    break
                case '10':
                    realTypeName = '/anime'
                    break
                case '11':
                    realTypeName = '/shows'
                    break
                case '12':
                    realTypeName = '/music'
                    break
                case '13':
                    realTypeName = '/short'
                    break
                case '14':
                    realTypeName = '/other'
                    break
            }

            let listUrl = `${this.url}${realTypeName}/page/${page}`
            let backData = {}
            try {
                let pro = await $.http.get({ url: listUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let allVideo = _$('.video-listing-content .video-item')
                    let lastPage = _$('.wp-pagenavi a.last').text() || '1'
                    let videos = []
                    allVideo.each((index, element) => {
                        let vodUrl = _$(element).find('h3 a').attr('rel') || ''
                        let vodPic = _$(element).find('img').attr('data-original') || ''
                        let vodName = _$(element).find('h3 a').attr('title') || ''
                        let vodDiJiJi = _$(element).find('span.remarks').text() || ''

                        let videoDet = {}
                        videoDet.vod_id = +vodUrl
                        videoDet.vod_pic = vodPic
                        videoDet.vod_name = vodName.replace(/(【.*?】)/g, '').trim()
                        videoDet.vod_remarks = vodDiJiJi.trim()
                        videos.push(videoDet)
                    })

                    backData.code = 1
                    backData.msg = '數據列表'
                    backData.page = page.toString()
                    backData.pagecount = +lastPage
                    backData.limit = videos.length.toString()
                    backData.total = videos.length * lastPage
                    backData.list = videos
                }
            } catch (e) {
                $.logErr('Error fetching list:', e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async getVideoDetail(queryParams) {
            let ids = queryParams.ids
            let backData = {}
            try {
                let webUrl = this.url + `/movie/${ids}.html`
                let pro = await $.http.get({ url: webUrl, headers: this.headers })
                let proData = pro.body
                if (proData) {
                    let _$ = $.cheerio.load(proData)
                    let vod_name = _$('.video-item h1').text()
                    let vod_content = _$('.item-content p').eq(0).text() || ''
                    let vod_pic = _$('.hl-item-thumb').attr('data-original') || ''

                    let vod_play_url = ''
                    let playInfo = _$('.item-content script').text()
                    let pkey = playInfo.match(/pkey:"(.*)"/)[1]
                    let ref = _$('meta[property="og:url"]')
                        .attr('content')
                        .match(/\.net(.*)/)[1]

                    if (playInfo.includes('vid:')) {
                        let vid = playInfo.match(/vid:"(.*)",/)[1]
                        vod_play_url =
                            '1$' + 'https://ykusu.ykusu/nono/provide/vod?ac=play&vid=' + vid + '&pkey=' + pkey + '&ref=' + encodeURIComponent(ref) + '&n=.m3u8'
                    } else {
                        let btns = _$('.multilink-btn')
                        let playlist = []
                        btns.each((index, element) => {
                            let name = _$(element).text()
                            let vid = _$(element).attr('data-vid')
                            let url =
                                name +
                                '$https://ykusu.ykusu/nono/provide/vod?ac=play&vid=' +
                                vid +
                                '&pkey=' +
                                pkey +
                                '&ref=' +
                                encodeURIComponent(ref) +
                                '&n=.m3u8'
                            playlist.push(url)
                        })
                        vod_play_url = playlist.join('$$$')
                    }

                    // let juJiDocment = _$('ul.hl-plays-list')
                    // let playlist = []
                    // juJiDocment.each((index, element) => {
                    //     let videos = _$(element).find('li a')
                    //     let vod_play_url = ''
                    //     videos.each((i, e) => {
                    //         vod_play_url += from[index] + '-' + _$(e).text()
                    //         vod_play_url += '$'
                    //         vod_play_url +=
                    //             'https://ykusu.ykusu/nono/provide/vod?ac=play&url=' + encodeURIComponent(this.combineUrl(_$(e).attr('href'))) + '&n=.m3u8'
                    //         vod_play_url += '#'
                    //     })
                    //     playlist.push(vod_play_url)
                    // })

                    let temp = {
                        code: 1,
                        msg: '数据列表',
                        page: 1,
                        pagecount: 1,
                        limit: '20',
                        total: 1,
                        list: [
                            {
                                vod_id: 1,
                                vod_name: '',
                                vod_pic: '',
                                vod_remarks: '',
                                type_name: '',
                                vod_year: '',
                                vod_area: '',
                                vod_actor: '',
                                vod_director: '',
                                vod_content: '',
                                vod_play_from: '',
                                vod_play_url: '',
                            },
                        ],
                    }
                    temp.list[0].vod_play_url = vod_play_url
                    // temp.list[0].vod_play_from = from.join('$$$')
                    temp.list[0].vod_id = +ids
                    temp.list[0].vod_name = vod_name
                    temp.list[0].vod_pic = vod_pic
                    temp.list[0].vod_content = vod_content.includes(';') ? vod_content.split(';')[1] : vod_content
                    backData = temp
                }
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        async getVideoPlayUrl(queryParams) {
            let backData = {}
            let vid = queryParams.vid
            let pkey = queryParams.pkey
            let ref = decodeURIComponent(queryParams.ref)
            try {
                // get vkey
                const playerUrl = `https://player.novipnoad.net/v1/?url=${vid}&pkey=${pkey}&ref=${ref}`
                const player = await $.http.get({
                    url: playerUrl,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
                        referer: 'https://www.novipnoad.net',
                    },
                })
                const data = player.body.match(/decodeURIComponent\(escape\(r\)\)\}(.*)\)/)[1].replace(/["\(\)]/g, '')
                const device = player.body.match(/params\['device'\] = '(\w+)';/)[1]
                const config = data.split(',')
                const vkey = JSON.parse(
                    this.getVkey(config[0], config[1], config[2], config[3], config[4], config[5])
                        .match(/JSON.stringify\((.*)\)\);/)[1]
                        .replace(/'/g, '"')
                        .replace(/(ckey|ref|ip|time):/g, '"$1":')
                )

                // get jsapi
                const phpUrl = `https://player.novipnoad.net/v1/player.php?id=${vid}&device=${device}`
                const phpres = await $.http.get({
                    url: phpUrl,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
                        referer: playerUrl,
                    },
                })
                let jsapi = phpres.body.match(/jsapi = '(.*)';/)[1]
                jsapi = jsapi + '?ckey=' + vkey.ckey.toUpperCase() + '&ref=' + encodeURIComponent(vkey.ref) + '&ip=' + vkey.ip + '&time=' + vkey.time

                // get play url
                const jsres = await $.http.get({
                    url: jsapi,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
                        referer: 'https://www.novipnoad.net',
                    },
                })
                let playUrl = jsres.body.match(/decrypt\("(.*)"\)/)[1]
                playUrl = this.decryptUrl(playUrl)
                playUrl = playUrl.quality[playUrl.defaultQuality].url
                console.log(playUrl)
                backData.data = playUrl
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }
            return JSON.stringify(backData)
        }

        async searchVideo(queryParams) {
            const pg = queryParams.pg
            const wd = queryParams.wd
            let backData = {}

            try {
                let searchUrl = this.url + `/?s=${wd}`
                let searchRes = await $.http.get({
                    url: searchUrl,
                    headers: {
                        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,/;q=0.8',
                        'user-agent':
                            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
                        referer: 'https://www.novipnoad.net',
                    },
                })
                let _$ = $.cheerio.load(searchRes.body)
                let videos = []
                let allVideo = _$('.search-listing-content .video-item')
                allVideo.each((index, element) => {
                    let vodUrl = _$(element).find('.item-thumbnail a').attr('href') || ''
                    let vodPic = _$(element).find('.item-thumbnail img').attr('data-original') || ''
                    let vodName = _$(element).find('.item-thumbnail a').attr('title') || ''
                    let vodDiJiJi = _$(element).find('span.remarks').text() || ''

                    let videoDet = {}
                    videoDet.vod_id = +vodUrl.match(/net\/.+\/(\d+)\.html/)[1]
                    videoDet.vod_pic = vodPic
                    videoDet.vod_name = vodName.replace(/(【.*?】)/g, '').trim()
                    videoDet.vod_remarks = vodDiJiJi.trim()
                    videos.push(videoDet)
                })

                backData.code = 1
                backData.msg = '數據列表'
                backData.page = pg
                backData.limit = videos.length.toString()
                backData.list = videos
            } catch (e) {
                $.logErr(e)
                backData.error = e.message
            }

            return JSON.stringify(backData)
        }

        getVkey(h, u, n, t, e, r) {
            r = ''
            for (var i = 0, len = h.length; i < len; i++) {
                var s = ''
                while (h[i] !== n[e]) {
                    s += h[i]
                    i++
                }
                for (var j = 0; j < n.length; j++) s = s.replace(new RegExp(n[j], 'g'), j)
                r += String.fromCharCode(this._0xe31c(s, e, 10) - t)
            }
            return decodeURIComponent(escape(r))
        }

        _0xe31c(d, e, f) {
            var g = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('')
            var h = g.slice(0, e)
            var i = g.slice(0, f)
            var j = d
                .split('')
                .reverse()
                .reduce(function (a, b, c) {
                    if (h.indexOf(b) !== -1) return (a += h.indexOf(b) * Math.pow(e, c))
                }, 0)
            var k = ''
            while (j > 0) {
                k = i[j % f] + k
                j = (j - (j % f)) / f
            }
            return k || 0
        }

        decryptUrl(_0x395610) {
            var _0x15159f = '5f3651b7'
            var _0x36346e = this._0x2b01e7(_0x395610, _0x15159f)
            return JSON.parse(_0x36346e)
        }

        _0x2b01e7(_0x12f758, _0xda9b8e) {
            var b = '3.3.1'
            // var _0x3bf069 = atob(_0x12f758)
            var _0x3bf069 = this.atob(_0x12f758)
            for (var _0x19fa71, _0x300ace = [], _0x18815b = 0, _0xe5da02 = '', _0x1d31f3 = 0; 256 > _0x1d31f3; _0x1d31f3++) {
                _0x300ace[_0x1d31f3] = _0x1d31f3
            }
            for (_0x1d31f3 = 0; 256 > _0x1d31f3; _0x1d31f3++) {
                _0x18815b = (_0x18815b + _0x300ace[_0x1d31f3] + _0xda9b8e.charCodeAt(_0x1d31f3 % _0xda9b8e.length)) % 256
                _0x19fa71 = _0x300ace[_0x1d31f3]
                _0x300ace[_0x1d31f3] = _0x300ace[_0x18815b]
                _0x300ace[_0x18815b] = _0x19fa71
            }
            for (b = _0x18815b = _0x1d31f3 = 0; b < _0x3bf069.length; b++) {
                _0x1d31f3 = (_0x1d31f3 + 1) % 256
                _0x18815b = (_0x18815b + _0x300ace[_0x1d31f3]) % 256
                _0x19fa71 = _0x300ace[_0x1d31f3]
                _0x300ace[_0x1d31f3] = _0x300ace[_0x18815b]
                _0x300ace[_0x18815b] = _0x19fa71
                _0xe5da02 += String.fromCharCode(_0x3bf069.charCodeAt(b) ^ _0x300ace[(_0x300ace[_0x1d31f3] + _0x300ace[_0x18815b]) % 256])
            }
            return _0xe5da02
        }

        atob(b64) {
            var chars = {
                ascii: function () {
                    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
                },
                indices: function () {
                    if (!this.cache) {
                        this.cache = {}
                        var ascii = chars.ascii()

                        for (var c = 0; c < ascii.length; c++) {
                            var chr = ascii[c]
                            this.cache[chr] = c
                        }
                    }
                    return this.cache
                },
            }
            var indices = chars.indices(),
                pos = b64.indexOf('='),
                padded = pos > -1,
                len = padded ? pos : b64.length,
                i = -1,
                data = ''

            while (i < len) {
                var code = (indices[b64[++i]] << 18) | (indices[b64[++i]] << 12) | (indices[b64[++i]] << 6) | indices[b64[++i]]
                if (code !== 0) {
                    data += String.fromCharCode((code >>> 16) & 255, (code >>> 8) & 255, code & 255)
                }
            }

            if (padded) {
                data = data.slice(0, pos - b64.length)
            }

            return data
        }

        combineUrl(url) {
            if (url === undefined) {
                return ''
            }
            if (url.indexOf(this.url) !== -1) {
                return url
            }
            if (url.startsWith('/')) {
                return this.url + url
            }
            return this.url + '/' + url
        }

        isIgnoreClassName(className) {
            return this.ignoreClassName.some((element) => className.includes(element))
        }

        removeTrailingSlash(str) {
            if (str.endsWith('/')) {
                return str.slice(0, -1)
            }
            return str
        }
    })()
}

function base64Encode(text) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text))
}

function base64Decode(text) {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(text))
}

// an URI [ parse | stringify ] to JSON / URI Converter based JavaScript
// https://github.com/VirgilClyne/GetSomeFries/blob/main/function/URI/URIs.embedded.min.js
// prettier-ignore
function URIs(t){return new class{constructor(t=[]){this.name="URI v1.2.6",this.opts=t,this.json={scheme:"",host:"",path:"",query:{}}}parse(t){let s=t.match(/(?:(?<scheme>.+):\/\/(?<host>[^/]+))?\/?(?<path>[^?]+)?\??(?<query>[^?]+)?/)?.groups??null;if(s?.path?s.paths=s.path.split("/"):s.path="",s?.paths){const t=s.paths[s.paths.length-1];if(t?.includes(".")){const e=t.split(".");s.format=e[e.length-1]}}return s?.query&&(s.query=Object.fromEntries(s.query.split("&").map((t=>t.split("="))))),s}stringify(t=this.json){let s="";return t?.scheme&&t?.host&&(s+=t.scheme+"://"+t.host),t?.path&&(s+=t?.host?"/"+t.path:t.path),t?.query&&(s+="?"+Object.entries(t.query).map((t=>t.join("="))).join("&")),s}}(t)}
// modified from @Yuheng0101
// prettier-ignore
async function importRemoteUtils(n,t,i,r){const u=function(){return typeof globalThis!="undefined"?globalThis:typeof self!="undefined"?self:typeof window!="undefined"?window:global}();if($.isNode()){if(r){$.debug(`【${i}】使用 'require' 导入模块 ${r}`);try{const n=require(r);$[i]=n;return}catch(o){$.error(`【${i}】导入模块 ${r} 失败, 请检查模块名或检查是否安装该依赖...`)}}else if($.debug(`【${i}】没有传入模块名称, 不使用 'require' 导入`),u[i]){$.debug(`【${i}】环境自带库, 已加载成功 🎉`);$[i]=u[i];return}!$[i]||$.debug(`【${i}】使用远程加载...`)}$.debug(`【${i}】正在从远程拉取脚本: ${n}`);const f=$.getval(`ykusu-${i}.js`),e=n=>{eval(n),$[i]=t?eval(t)():u[i],!$[i]||$.debug(`【${i}】加载成功 🎉`)};f?($.debug(`【${i}】缓存存在, 尝试加载...`),e(f)):await $.http.get({url:n,timeout:2e3}).then(n=>{var t=n.body;e(t);$.setval(t,`ykusu-${i}.js`);$.debug(`【${i}】已存入缓存 🎉`)}).catch(()=>Promise.reject(new Error(`【${i}】远程拉取失败, 请检查网络...`)))}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;"POST"===e&&(s=this.post);const i=new Promise(((e,i)=>{s.call(this,t,((t,s,o)=>{t?i(t):e(s)}))}));return t.timeout?((t,e=1e3)=>Promise.race([t,new Promise(((t,s)=>{setTimeout((()=>{s(new Error("请求超时"))}),e)}))]))(i,t.timeout):i}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;if(this.getdata(t))try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise((e=>{this.get({url:t},((t,s,i)=>e(i)))}))}runScript(t,e){return new Promise((s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,a]=i.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"},policy:"DIRECT",timeout:o};this.post(n,((t,e,i)=>s(i)))})).catch((t=>this.logErr(t)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t||(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce(((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{}),t)[e[e.length-1]]=s),t}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),a=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",((t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}})).then((t=>{const{statusCode:i,statusCode:o,headers:r,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:i,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:i,response:o}=t;e(i,o,o&&s.decode(o.rawBody,this.encoding))}));break}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let i=require("iconv-lite");this.initGotEnv(t);const{url:o,...r}=t;this.got[s](o,r).then((t=>{const{statusCode:s,statusCode:o,headers:r,rawBody:a}=t,n=i.decode(a,this.encoding);e(null,{status:s,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:s,response:o}=t;e(s,o,o&&i.decode(o.rawBody,this.encoding))}));break}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",o={}){const r=t=>{const{$open:e,$copy:s,$media:i,$mediaMime:o}=t;switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{const r={};let a=t.openUrl||t.url||t["open-url"]||e;a&&Object.assign(r,{action:"open-url",url:a});let n=t["update-pasteboard"]||t.updatePasteboard||s;if(n&&Object.assign(r,{action:"clipboard",text:n}),i){let t,e,s;if(i.startsWith("http"))t=i;else if(i.startsWith("data:")){const[t]=i.split(";"),[,o]=i.split(",");e=o,s=t.replace("data:","")}else{e=i,s=(t=>{const e={JVBERi0:"application/pdf",R0lGODdh:"image/gif",R0lGODlh:"image/gif",iVBORw0KGgo:"image/png","/9j/":"image/jpg"};for(var s in e)if(0===t.indexOf(s))return e[s];return null})(i)}Object.assign(r,{"media-url":t,"media-base64":e,"media-base64-mime":o??s})}return Object.assign(r,{"auto-dismiss":t["auto-dismiss"],sound:t.sound}),r}case"Loon":{const s={};let o=t.openUrl||t.url||t["open-url"]||e;o&&Object.assign(s,{openUrl:o});let r=t.mediaUrl||t["media-url"];return i?.startsWith("http")&&(r=i),r&&Object.assign(s,{mediaUrl:r}),console.log(JSON.stringify(s)),s}case"Quantumult X":{const o={};let r=t["open-url"]||t.url||t.openUrl||e;r&&Object.assign(o,{"open-url":r});let a=t["media-url"]||t.mediaUrl;i?.startsWith("http")&&(a=i),a&&Object.assign(o,{"media-url":a});let n=t["update-pasteboard"]||t.updatePasteboard||s;return n&&Object.assign(o,{"update-pasteboard":n}),console.log(JSON.stringify(o)),o}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,i,r(o));break;case"Quantumult X":$notify(e,s,i,r(o));break;case"Node.js":break}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.map((t=>t??String(t))).join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,e,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e,void 0!==t.message?t.message:t,t.stack);break}}wait(t){return new Promise((e=>setTimeout(e,t)))}done(t={}){const e=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}

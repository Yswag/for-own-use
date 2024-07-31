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
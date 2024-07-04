const $ = new Env('BTTwo', { logLevel: 'info' })

class bttwoClass {
    constructor() {
        this.url = 'https://www.bttwoo.com'
        this.headers = {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        }
        this.ignoreClassName = ['首页', '热门下载', '公告求片']
    }

    async getClassList() {
        let webUrl = this.url
        let backData = {}
        try {
            const pro = await $.http.get(webUrl, { headers: this.headers })

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
                backData.msg = '数据列表'
                backData.page = 1
                backData.list = videos
                backData.class = list
            }
        } catch (error) {
            $.logErr(error)
            backData.error = error.message
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
            let pro = await $.http.get(listUrl, { headers: this.headers })

            let proData = pro.body
            if (proData) {
                let _$ = $.cheerio.load(proData)
                let allVideo = _$('div.bt_img > ul').find('li')
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
                backData.msg = '数据列表'
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
            let pro = await $.http.get(webUrl, { headers: this.headers })
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
                    vod_play_url +=
                        'https://ykusu.ykusu/bttwo/provide/vod?ac=play&url=' +
                        encodeURIComponent(_$(element).attr('href')) +
                        '&n=.m3u8'
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
                            vod_id: 4561,
                            type_id: 40,
                            type_id_1: 4,
                            group_id: 0,
                            vod_name: '',
                            vod_sub: '',
                            vod_en: '',
                            vod_status: 1,
                            vod_letter: '',
                            vod_color: '',
                            vod_tag: '',
                            vod_class: '',
                            vod_pic: '',
                            vod_pic_thumb: '',
                            vod_pic_slide: '',
                            vod_pic_screenshot: '',
                            vod_actor: '',
                            vod_director: '',
                            vod_writer: '',
                            vod_behind: '',
                            vod_blurb: '',
                            vod_remarks: '',
                            vod_pubdate: '',
                            vod_total: 0,
                            vod_serial: '0',
                            vod_tv: '',
                            vod_weekday: '',
                            vod_area: '',
                            vod_lang: '',
                            vod_year: '',
                            vod_version: '',
                            vod_state: '',
                            vod_author: '',
                            vod_jumpurl: '',
                            vod_tpl: '',
                            vod_tpl_play: '',
                            vod_tpl_down: '',
                            vod_isend: 1,
                            vod_lock: 0,
                            vod_level: 0,
                            vod_copyright: 0,
                            vod_points: 0,
                            vod_points_play: 0,
                            vod_points_down: 0,
                            vod_hits: 70,
                            vod_hits_day: 152,
                            vod_hits_week: 19,
                            vod_hits_month: 61,
                            vod_duration: '',
                            vod_up: 705,
                            vod_down: 150,
                            vod_score: '10.0',
                            vod_score_all: 7060,
                            vod_score_num: 706,
                            vod_time: '2024-04-17 21:02:46',
                            vod_time_add: 1708587661,
                            vod_time_hits: 0,
                            vod_time_make: 0,
                            vod_trysee: 0,
                            vod_douban_id: 0,
                            vod_douban_score: '0.0',
                            vod_reurl: '',
                            vod_rel_vod: '',
                            vod_rel_art: '',
                            vod_pwd: '',
                            vod_pwd_url: '',
                            vod_pwd_play: '',
                            vod_pwd_play_url: '',
                            vod_pwd_down: '',
                            vod_pwd_down_url: '',
                            vod_content: '',
                            vod_play_from: '',
                            vod_play_server: '',
                            vod_play_note: '',
                            vod_play_url: '',
                            vod_down_from: '',
                            vod_down_server: '',
                            vod_down_note: '',
                            vod_down_url: '',
                            vod_plot: 0,
                            vod_plot_name: '',
                            vod_plot_detail: '',
                            type_name: '',
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
            let html = await $.http.get(url, { headers: this.headers })

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
                    $.log('playUrl: ' + playurl)
                } else {
                    $.msg('該片在線播放需要兩個BT的VIP會員')
                    // backData.error = '該片需兩個BT的VIP會員才能收看'
                    backData.data = 'https://bit.ly/3BlS71b'
                }
                // } else backData.data = 'https://bit.ly/3BlS71b'
            } else backData.data = 'https://bit.ly/3BlS71b'
        } catch (error) {
            $.logErr(error)
            backData.error = error.message
        }
        return JSON.stringify(backData)
    }

    async searchVideo(queryParams) {
        const pg = queryParams.pg
        const wd = queryParams.wd
        let backData = {}
        let url = this.removeTrailingSlash(this.url) + `/xssssearch?q=${wd}$f=_all&p=${pg}`

        try {
            let pro = await $.http.get(url, { headers: this.headers })
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
                backData.msg = '数据列表'
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
}

!(async () => {
    await importRemoteUtils(
        'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js',
        '',
        'CryptoJS',
        'crypto-js'
    )
    // const encrypted = $.CryptoJS.AES.encrypt('my message', 'Secret Passphrase').toString()
    // console.log(encrypted)
    await importRemoteUtils(
        'https://cdn.jsdelivr.net/gh/Yuheng0101/X@main/Utils/cheerio.js',
        'createCheerio',
        'cheerio'
    )

    const bttwo = new bttwoClass()
    const URI = new URIs()
    let { url } = $request
    const queryParams = URI.parse(url).query
    // $.log('queryParams=' + JSON.stringify(queryParams))
    await handleRequest(bttwo, queryParams)
    // $.done()
})().catch((e) => $.logErr(e))
// .finally(() => $.done())

async function handleRequest(spiderInstance, queryParams) {
    const ac = queryParams.ac
    if (ac === 'list') {
        let res = await spiderInstance.getClassList()
        $.isQuanX()
            ? $.done({ status: 'HTTP/1.1 200', body: res })
            : $.done({
                  response: {
                      status: 200,
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

// an URI [ parse | stringify ] to JSON / URI Converter based JavaScript
// modify from https://github.com/NanoCat-Me/URL
function URIs(opts) {
    return new (class {
        constructor(opts = []) {
            this.name = 'URI v1.2.6'
            this.opts = opts
            this.json = { scheme: '', host: '', path: '', query: {} }
        }

        parse(url) {
            const URLRegex = /(?:(?<scheme>.+):\/\/(?<host>[^/]+))?\/?(?<path>[^?]+)?\??(?<query>.+)?/
            let json = url.match(URLRegex)?.groups ?? null
            if (json?.path) json.paths = json.path.split('/')
            else json.path = ''
            if (json?.paths) {
                const fileName = json.paths[json.paths.length - 1]
                if (fileName?.includes('.')) {
                    const list = fileName.split('.')
                    json.format = list[list.length - 1]
                }
            }
            if (json?.query) {
                json.query = this.parseQuery(json.query)
            }
            return json
        }

        parseQuery(queryString) {
            const params = {}
            const queryParts = queryString.split('&')
            queryParts.forEach((part) => {
                const [key, ...values] = part.split('=')
                params[key] = values.join('=') // Rejoin the value parts in case it contains '='
            })
            return params
        }

        stringify(json = this.json) {
            let url = ''
            if (json?.scheme && json?.host) url += json.scheme + '://' + json.host
            if (json?.path) url += json?.host ? '/' + json.path : json.path
            if (json?.query) {
                url +=
                    '?' +
                    Object.entries(json.query)
                        .map(([key, value]) => `${key}=${value}`)
                        .join('&')
            }
            return url
        }
    })(opts)
}

// prettier-ignore
async function importRemoteUtils(n,t,i,r){const u=function(){return typeof globalThis!="undefined"?globalThis:typeof self!="undefined"?self:typeof window!="undefined"?window:global}();if($.isNode()){if(r){$.debug(`【${i}】使用 'require' 导入模块 ${r}`);try{const n=require(r);$[i]=n;return}catch(o){$.error(`【${i}】导入模块 ${r} 失败, 请检查模块名或检查是否安装该依赖...`)}}else if($.debug(`【${i}】没有传入模块名称, 不使用 'require' 导入`),u[i]){$.debug(`【${i}】环境自带库, 已加载成功 🎉`);$[i]=u[i];return}!$[i]||$.debug(`【${i}】使用远程加载...`)}$.debug(`【${i}】正在从远程拉取脚本: ${n}`);const f=$.getval(`${i}.js`),e=n=>{eval(n),$[i]=t?eval(t)():u[i],!$[i]||$.debug(`【${i}】加载成功 🎉`)};f?($.debug(`【${i}】缓存存在, 尝试加载...`),e(f)):await $.http.get({url:n,timeout:2e3}).then(n=>{var t=n.body;e(t);$.setval(t,`${i}.js`);$.debug(`【${i}】已存入缓存 🎉`)}).catch(()=>Promise.reject(new Error(`【${i}】远程拉取失败, 请检查网络...`)))}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;"POST"===e&&(s=this.post);const i=new Promise(((e,i)=>{s.call(this,t,((t,s,o)=>{t?i(t):e(s)}))}));return t.timeout?((t,e=1e3)=>Promise.race([t,new Promise(((t,s)=>{setTimeout((()=>{s(new Error("请求超时"))}),e)}))]))(i,t.timeout):i}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;if(this.getdata(t))try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise((e=>{this.get({url:t},((t,s,i)=>e(i)))}))}runScript(t,e){return new Promise((s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,a]=i.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"},policy:"DIRECT",timeout:o};this.post(n,((t,e,i)=>s(i)))})).catch((t=>this.logErr(t)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t||(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce(((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{}),t)[e[e.length-1]]=s),t}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),a=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",((t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}})).then((t=>{const{statusCode:i,statusCode:o,headers:r,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:i,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:i,response:o}=t;e(i,o,o&&s.decode(o.rawBody,this.encoding))}));break}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let i=require("iconv-lite");this.initGotEnv(t);const{url:o,...r}=t;this.got[s](o,r).then((t=>{const{statusCode:s,statusCode:o,headers:r,rawBody:a}=t,n=i.decode(a,this.encoding);e(null,{status:s,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:s,response:o}=t;e(s,o,o&&i.decode(o.rawBody,this.encoding))}));break}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",o={}){const r=t=>{const{$open:e,$copy:s,$media:i,$mediaMime:o}=t;switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{const r={};let a=t.openUrl||t.url||t["open-url"]||e;a&&Object.assign(r,{action:"open-url",url:a});let n=t["update-pasteboard"]||t.updatePasteboard||s;if(n&&Object.assign(r,{action:"clipboard",text:n}),i){let t,e,s;if(i.startsWith("http"))t=i;else if(i.startsWith("data:")){const[t]=i.split(";"),[,o]=i.split(",");e=o,s=t.replace("data:","")}else{e=i,s=(t=>{const e={JVBERi0:"application/pdf",R0lGODdh:"image/gif",R0lGODlh:"image/gif",iVBORw0KGgo:"image/png","/9j/":"image/jpg"};for(var s in e)if(0===t.indexOf(s))return e[s];return null})(i)}Object.assign(r,{"media-url":t,"media-base64":e,"media-base64-mime":o??s})}return Object.assign(r,{"auto-dismiss":t["auto-dismiss"],sound:t.sound}),r}case"Loon":{const s={};let o=t.openUrl||t.url||t["open-url"]||e;o&&Object.assign(s,{openUrl:o});let r=t.mediaUrl||t["media-url"];return i?.startsWith("http")&&(r=i),r&&Object.assign(s,{mediaUrl:r}),console.log(JSON.stringify(s)),s}case"Quantumult X":{const o={};let r=t["open-url"]||t.url||t.openUrl||e;r&&Object.assign(o,{"open-url":r});let a=t["media-url"]||t.mediaUrl;i?.startsWith("http")&&(a=i),a&&Object.assign(o,{"media-url":a});let n=t["update-pasteboard"]||t.updatePasteboard||s;return n&&Object.assign(o,{"update-pasteboard":n}),console.log(JSON.stringify(o)),o}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,i,r(o));break;case"Quantumult X":$notify(e,s,i,r(o));break;case"Node.js":break}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.map((t=>t??String(t))).join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,e,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e,void 0!==t.message?t.message:t,t.stack);break}}wait(t){return new Promise((e=>setTimeout(e,t)))}done(t={}){const e=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}

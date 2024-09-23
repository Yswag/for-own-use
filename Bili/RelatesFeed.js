class ENV {
    static name = 'ENV'
    static version = '1.8.3'
    static about() {
        return console.log(`\n🟧 ${this.name} v${this.version}\n`)
    }

    constructor(name, opts) {
        console.log(`\n🟧 ${ENV.name} v${ENV.version}\n`)
        this.name = name
        this.logs = []
        this.isMute = false
        this.isMuteLog = false
        this.logSeparator = '\n'
        this.encoding = 'utf-8'
        this.startTime = new Date().getTime()
        Object.assign(this, opts)
        this.log(`\n🚩 开始!\n${name}\n`)
    }

    environment() {
        switch (this.platform()) {
            case 'Surge':
                $environment.app = 'Surge'
                return $environment
            case 'Stash':
                $environment.app = 'Stash'
                return $environment
            case 'Egern':
                $environment.app = 'Egern'
                return $environment
            case 'Loon':
                let environment = $loon.split(' ')
                return {
                    device: environment[0],
                    ios: environment[1],
                    'loon-version': environment[2],
                    app: 'Loon',
                }
            case 'Quantumult X':
                return {
                    app: 'Quantumult X',
                }
            case 'Node.js':
                process.env.app = 'Node.js'
                return process.env
            default:
                return {}
        }
    }

    platform() {
        if ('undefined' !== typeof $environment && $environment['surge-version']) return 'Surge'
        if ('undefined' !== typeof $environment && $environment['stash-version']) return 'Stash'
        if ('undefined' !== typeof module && !!module.exports) return 'Node.js'
        if ('undefined' !== typeof $task) return 'Quantumult X'
        if ('undefined' !== typeof $loon) return 'Loon'
        if ('undefined' !== typeof $rocket) return 'Shadowrocket'
        if ('undefined' !== typeof Egern) return 'Egern'
    }

    isNode() {
        return 'Node.js' === this.platform()
    }

    isQuanX() {
        return 'Quantumult X' === this.platform()
    }

    isSurge() {
        return 'Surge' === this.platform()
    }

    isLoon() {
        return 'Loon' === this.platform()
    }

    isShadowrocket() {
        return 'Shadowrocket' === this.platform()
    }

    isStash() {
        return 'Stash' === this.platform()
    }

    isEgern() {
        return 'Egern' === this.platform()
    }

    async getScript(url) {
        return await this.fetch(url).then((response) => response.body)
    }

    async runScript(script, runOpts) {
        let httpapi = $Storage.getItem('@chavy_boxjs_userCfgs.httpapi')
        httpapi = httpapi?.replace?.(/\n/g, '')?.trim()
        let httpapi_timeout = $Storage.getItem('@chavy_boxjs_userCfgs.httpapi_timeout')
        httpapi_timeout = httpapi_timeout * 1 ?? 20
        httpapi_timeout = runOpts?.timeout ?? httpapi_timeout
        const [password, address] = httpapi.split('@')
        const request = {
            url: `http://${address}/v1/scripting/evaluate`,
            body: {
                script_text: script,
                mock_type: 'cron',
                timeout: httpapi_timeout,
            },
            headers: { 'X-Key': password, Accept: '*/*' },
            timeout: httpapi_timeout,
        }
        await this.fetch(request).then(
            (response) => response.body,
            (error) => this.logErr(error)
        )
    }

    initGotEnv(opts) {
        this.got = this.got ? this.got : require('got')
        this.cktough = this.cktough ? this.cktough : require('tough-cookie')
        this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
        if (opts) {
            opts.headers = opts.headers ? opts.headers : {}
            if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
                opts.cookieJar = this.ckjar
            }
        }
    }

    async fetch(request = {} || '', option = {}) {
        // 初始化参数
        switch (request.constructor) {
            case Object:
                request = { ...option, ...request }
                break
            case String:
                request = { ...option, url: request }
                break
        } // 自动判断请求方法
        if (!request.method) {
            request.method = 'GET'
            if (request.body ?? request.bodyBytes) request.method = 'POST'
        } // 移除请求头中的部分参数, 让其自动生成
        delete request.headers?.Host
        delete request.headers?.[':authority']
        delete request.headers?.['Content-Length']
        delete request.headers?.['content-length']
        // 定义请求方法（小写）
        const method = request.method.toLocaleLowerCase()
        // 判断平台
        switch (this.platform()) {
            case 'Loon':
            case 'Surge':
            case 'Stash':
            case 'Egern':
            case 'Shadowrocket':
            default:
                // 转换请求参数
                if (request.timeout) {
                    request.timeout = parseInt(request.timeout, 10)
                    if (this.isSurge());
                    else request.timeout = request.timeout * 1000
                }
                if (request.policy) {
                    if (this.isLoon()) request.node = request.policy
                    if (this.isStash()) Lodash.set(request, 'headers.X-Stash-Selected-Proxy', encodeURI(request.policy))
                    if (this.isShadowrocket()) Lodash.set(request, 'headers.X-Surge-Proxy', request.policy)
                }
                if (typeof request.redirection === 'boolean') request['auto-redirect'] = request.redirection
                // 转换请求体
                if (request.bodyBytes && !request.body) {
                    request.body = request.bodyBytes
                    delete request.bodyBytes
                } // 发送请求
                return await new Promise((resolve, reject) => {
                    $httpClient[method](request, (error, response, body) => {
                        if (error) reject(error)
                        else {
                            response.ok = /^2\d\d$/.test(response.status)
                            response.statusCode = response.status
                            if (body) {
                                response.body = body
                                if (request['binary-mode'] == true) response.bodyBytes = body
                            }
                            resolve(response)
                        }
                    })
                })
            case 'Quantumult X':
                // 转换请求参数
                if (request.policy) Lodash.set(request, 'opts.policy', request.policy)
                if (typeof request['auto-redirect'] === 'boolean') Lodash.set(request, 'opts.redirection', request['auto-redirect'])
                // 转换请求体
                if (request.body instanceof ArrayBuffer) {
                    request.bodyBytes = request.body
                    delete request.body
                } else if (ArrayBuffer.isView(request.body)) {
                    request.bodyBytes = request.body.buffer.slice(request.body.byteOffset, request.body.byteLength + request.body.byteOffset)
                    delete object.body
                } else if (request.body) delete request.bodyBytes
                // 发送请求
                return await $task.fetch(request).then(
                    (response) => {
                        response.ok = /^2\d\d$/.test(response.statusCode)
                        response.status = response.statusCode
                        return response
                    },
                    (reason) => Promise.reject(reason.error)
                )
            case 'Node.js':
                let iconv = require('iconv-lite')
                this.initGotEnv(request)
                const { url, ...option } = request
                return await this.got[method](url, option)
                    .on('redirect', (response, nextOpts) => {
                        try {
                            if (response.headers['set-cookie']) {
                                const ck = response.headers['set-cookie'].map(this.cktough.Cookie.parse).toString()
                                if (ck) {
                                    this.ckjar.setCookieSync(ck, null)
                                }
                                nextOpts.cookieJar = this.ckjar
                            }
                        } catch (e) {
                            this.logErr(e)
                        }
                        // this.ckjar.setCookieSync(response.headers['set-cookie'].map(Cookie.parse).toString())
                    })
                    .then(
                        (response) => {
                            response.statusCode = response.status
                            response.body = iconv.decode(response.rawBody, this.encoding)
                            response.bodyBytes = response.rawBody
                            return response
                        },
                        (error) => Promise.reject(error.message)
                    )
        }
    }

    /**
     *
     * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
     *    :$.time('yyyyMMddHHmmssS')
     *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
     *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
     * @param {string} format 格式化参数
     * @param {number} ts 可选: 根据指定时间戳返回格式化日期
     *
     */
    time(format, ts = null) {
        const date = ts ? new Date(ts) : new Date()
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            S: date.getMilliseconds(),
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (let k in o)
            if (new RegExp('(' + k + ')').test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        return format
    }

    /**
     * 系统通知
     *
     * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
     *
     * 示例:
     * $.msg(title, subt, desc, 'twitter://')
     * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
     * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
     *
     * @param {*} title 标题
     * @param {*} subt 副标题
     * @param {*} desc 通知详情
     * @param {*} opts 通知参数
     *
     */
    msg(title = name, subt = '', desc = '', opts) {
        const toEnvOpts = (rawopts) => {
            switch (typeof rawopts) {
                case undefined:
                    return rawopts
                case 'string':
                    switch (this.platform()) {
                        case 'Surge':
                        case 'Stash':
                        case 'Egern':
                        default:
                            return { url: rawopts }
                        case 'Loon':
                        case 'Shadowrocket':
                            return rawopts
                        case 'Quantumult X':
                            return { 'open-url': rawopts }
                        case 'Node.js':
                            return undefined
                    }
                case 'object':
                    switch (this.platform()) {
                        case 'Surge':
                        case 'Stash':
                        case 'Egern':
                        case 'Shadowrocket':
                        default: {
                            let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
                            return { url: openUrl }
                        }
                        case 'Loon': {
                            let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
                            let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
                            return { openUrl, mediaUrl }
                        }
                        case 'Quantumult X': {
                            let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
                            let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
                            let updatePasteboard = rawopts['update-pasteboard'] || rawopts.updatePasteboard
                            return {
                                'open-url': openUrl,
                                'media-url': mediaUrl,
                                'update-pasteboard': updatePasteboard,
                            }
                        }
                        case 'Node.js':
                            return undefined
                    }
                default:
                    return undefined
            }
        }
        if (!this.isMute) {
            switch (this.platform()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Egern':
                case 'Shadowrocket':
                default:
                    $notification.post(title, subt, desc, toEnvOpts(opts))
                    break
                case 'Quantumult X':
                    $notify(title, subt, desc, toEnvOpts(opts))
                    break
                case 'Node.js':
                    break
            }
        }
        if (!this.isMuteLog) {
            let logs = ['', '==============📣系统通知📣==============']
            logs.push(title)
            subt ? logs.push(subt) : ''
            desc ? logs.push(desc) : ''
            console.log(logs.join('\n'))
            this.logs = this.logs.concat(logs)
        }
    }

    log(...logs) {
        if (logs.length > 0) {
            this.logs = [...this.logs, ...logs]
        }
        console.log(logs.join(this.logSeparator))
    }

    logErr(error) {
        switch (this.platform()) {
            case 'Surge':
            case 'Loon':
            case 'Stash':
            case 'Egern':
            case 'Shadowrocket':
            case 'Quantumult X':
            default:
                this.log('', `❗️ ${this.name}, 错误!`, error)
                break
            case 'Node.js':
                this.log('', `❗️${this.name}, 错误!`, error.stack)
                break
        }
    }

    wait(time) {
        return new Promise((resolve) => setTimeout(resolve, time))
    }

    done(object = {}) {
        const endTime = new Date().getTime()
        const costTime = (endTime - this.startTime) / 1000
        this.log('', `🚩 ${this.name}, 结束! 🕛 ${costTime} 秒`, '')
        switch (this.platform()) {
            case 'Surge':
                if (object.policy) Lodash.set(object, 'headers.X-Surge-Policy', object.policy)
                $done(object)
                break
            case 'Loon':
                if (object.policy) object.node = object.policy
                $done(object)
                break
            case 'Stash':
                if (object.policy) Lodash.set(object, 'headers.X-Stash-Selected-Proxy', encodeURI(object.policy))
                $done(object)
                break
            case 'Egern':
                $done(object)
                break
            case 'Shadowrocket':
            default:
                $done(object)
                break
            case 'Quantumult X':
                if (object.policy) Lodash.set(object, 'opts.policy', object.policy)
                // 移除不可写字段
                delete object['auto-redirect']
                delete object['auto-cookie']
                delete object['binary-mode']
                delete object.charset
                delete object.host
                delete object.insecure
                delete object.method // 1.4.x 不可写
                delete object.opt // $task.fetch() 参数, 不可写
                delete object.path // 可写, 但会与 url 冲突
                delete object.policy
                delete object['policy-descriptor']
                delete object.scheme
                delete object.sessionIndex
                delete object.statusCode
                delete object.timeout
                if (object.body instanceof ArrayBuffer) {
                    object.bodyBytes = object.body
                    delete object.body
                } else if (ArrayBuffer.isView(object.body)) {
                    object.bodyBytes = object.body.buffer.slice(object.body.byteOffset, object.body.byteLength + object.body.byteOffset)
                    delete object.body
                } else if (object.body) delete object.bodyBytes
                $done(object)
                break
            case 'Node.js':
                process.exit(1)
                break
        }
    }
}

/**
 * This handler implements the default behaviour for unknown fields.
 * When reading data, unknown fields are stored on the message, in a
 * symbol property.
 * When writing data, the symbol property is queried and unknown fields
 * are serialized into the output again.
 */
var UnknownFieldHandler
;(function (UnknownFieldHandler) {
    /**
     * The symbol used to store unknown fields for a message.
     * The property must conform to `UnknownFieldContainer`.
     */
    UnknownFieldHandler.symbol = Symbol.for('protobuf-ts/unknown')
    /**
     * Store an unknown field during binary read directly on the message.
     * This method is compatible with `BinaryReadOptions.readUnknownField`.
     */
    UnknownFieldHandler.onRead = (typeName, message, fieldNo, wireType, data) => {
        let container = is(message) ? message[UnknownFieldHandler.symbol] : (message[UnknownFieldHandler.symbol] = [])
        container.push({ no: fieldNo, wireType, data })
    }
    /**
     * Write unknown fields stored for the message to the writer.
     * This method is compatible with `BinaryWriteOptions.writeUnknownFields`.
     */
    UnknownFieldHandler.onWrite = (typeName, message, writer) => {
        for (let { no, wireType, data } of UnknownFieldHandler.list(message)) writer.tag(no, wireType).raw(data)
    }
    /**
     * List unknown fields stored for the message.
     * Note that there may be multiples fields with the same number.
     */
    UnknownFieldHandler.list = (message, fieldNo) => {
        if (is(message)) {
            let all = message[UnknownFieldHandler.symbol]
            return fieldNo ? all.filter((uf) => uf.no == fieldNo) : all
        }
        return []
    }
    /**
     * Returns the last unknown field by field number.
     */
    UnknownFieldHandler.last = (message, fieldNo) => UnknownFieldHandler.list(message, fieldNo).slice(-1)[0]
    const is = (message) => message && Array.isArray(message[UnknownFieldHandler.symbol])
})(UnknownFieldHandler || (UnknownFieldHandler = {}))
/**
 * Protobuf binary format wire types.
 *
 * A wire type provides just enough information to find the length of the
 * following value.
 *
 * See https://developers.google.com/protocol-buffers/docs/encoding#structure
 */
var WireType
;(function (WireType) {
    /**
     * Used for int32, int64, uint32, uint64, sint32, sint64, bool, enum
     */
    WireType[(WireType['Varint'] = 0)] = 'Varint'
    /**
     * Used for fixed64, sfixed64, double.
     * Always 8 bytes with little-endian byte order.
     */
    WireType[(WireType['Bit64'] = 1)] = 'Bit64'
    /**
     * Used for string, bytes, embedded messages, packed repeated fields
     *
     * Only repeated numeric types (types which use the varint, 32-bit,
     * or 64-bit wire types) can be packed. In proto3, such fields are
     * packed by default.
     */
    WireType[(WireType['LengthDelimited'] = 2)] = 'LengthDelimited'
    /**
     * Used for groups
     * @deprecated
     */
    WireType[(WireType['StartGroup'] = 3)] = 'StartGroup'
    /**
     * Used for groups
     * @deprecated
     */
    WireType[(WireType['EndGroup'] = 4)] = 'EndGroup'
    /**
     * Used for fixed32, sfixed32, float.
     * Always 4 bytes with little-endian byte order.
     */
    WireType[(WireType['Bit32'] = 5)] = 'Bit32'
})(WireType || (WireType = {}))

// Copyright 2008 Google Inc.  All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
// * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// Code generated by the Protocol Buffer compiler is owned by the owner
// of the input file used when generating it.  This code is not
// standalone and requires a support library to be linked with it.  This
// support library is itself covered by the above license.
/**
 * Read a 64 bit varint as two JS numbers.
 *
 * Returns tuple:
 * [0]: low bits
 * [0]: high bits
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L175
 */
function varint64read() {
    let lowBits = 0
    let highBits = 0
    for (let shift = 0; shift < 28; shift += 7) {
        let b = this.buf[this.pos++]
        lowBits |= (b & 0x7f) << shift
        if ((b & 0x80) == 0) {
            this.assertBounds()
            return [lowBits, highBits]
        }
    }
    let middleByte = this.buf[this.pos++]
    // last four bits of the first 32 bit number
    lowBits |= (middleByte & 0x0f) << 28
    // 3 upper bits are part of the next 32 bit number
    highBits = (middleByte & 0x70) >> 4
    if ((middleByte & 0x80) == 0) {
        this.assertBounds()
        return [lowBits, highBits]
    }
    for (let shift = 3; shift <= 31; shift += 7) {
        let b = this.buf[this.pos++]
        highBits |= (b & 0x7f) << shift
        if ((b & 0x80) == 0) {
            this.assertBounds()
            return [lowBits, highBits]
        }
    }
    throw new Error('invalid varint')
}
/**
 * Write a 64 bit varint, given as two JS numbers, to the given bytes array.
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/writer.js#L344
 */
function varint64write(lo, hi, bytes) {
    for (let i = 0; i < 28; i = i + 7) {
        const shift = lo >>> i
        const hasNext = !(shift >>> 7 == 0 && hi == 0)
        const byte = (hasNext ? shift | 0x80 : shift) & 0xff
        bytes.push(byte)
        if (!hasNext) {
            return
        }
    }
    const splitBits = ((lo >>> 28) & 0x0f) | ((hi & 0x07) << 4)
    const hasMoreBits = !(hi >> 3 == 0)
    bytes.push((hasMoreBits ? splitBits | 0x80 : splitBits) & 0xff)
    if (!hasMoreBits) {
        return
    }
    for (let i = 3; i < 31; i = i + 7) {
        const shift = hi >>> i
        const hasNext = !(shift >>> 7 == 0)
        const byte = (hasNext ? shift | 0x80 : shift) & 0xff
        bytes.push(byte)
        if (!hasNext) {
            return
        }
    }
    bytes.push((hi >>> 31) & 0x01)
}
// constants for binary math
const TWO_PWR_32_DBL$1 = (1 << 16) * (1 << 16)
/**
 * Parse decimal string of 64 bit integer value as two JS numbers.
 *
 * Returns tuple:
 * [0]: minus sign?
 * [1]: low bits
 * [2]: high bits
 *
 * Copyright 2008 Google Inc.
 */
function int64fromString(dec) {
    // Check for minus sign.
    let minus = dec[0] == '-'
    if (minus) dec = dec.slice(1)
    // Work 6 decimal digits at a time, acting like we're converting base 1e6
    // digits to binary. This is safe to do with floating point math because
    // Number.isSafeInteger(ALL_32_BITS * 1e6) == true.
    const base = 1e6
    let lowBits = 0
    let highBits = 0
    function add1e6digit(begin, end) {
        // Note('') is 0.
        const digit1e6 = Number(dec.slice(begin, end))
        highBits *= base
        lowBits = lowBits * base + digit1e6
        // Carry bits from lowBits to highBits
        if (lowBits >= TWO_PWR_32_DBL$1) {
            highBits = highBits + ((lowBits / TWO_PWR_32_DBL$1) | 0)
            lowBits = lowBits % TWO_PWR_32_DBL$1
        }
    }
    add1e6digit(-24, -18)
    add1e6digit(-18, -12)
    add1e6digit(-12, -6)
    add1e6digit(-6)
    return [minus, lowBits, highBits]
}
/**
 * Format 64 bit integer value (as two JS numbers) to decimal string.
 *
 * Copyright 2008 Google Inc.
 */
function int64toString(bitsLow, bitsHigh) {
    // Skip the expensive conversion if the number is small enough to use the
    // built-in conversions.
    if (bitsHigh >>> 0 <= 0x1fffff) {
        return '' + (TWO_PWR_32_DBL$1 * bitsHigh + (bitsLow >>> 0))
    }
    // What this code is doing is essentially converting the input number from
    // base-2 to base-1e7, which allows us to represent the 64-bit range with
    // only 3 (very large) digits. Those digits are then trivial to convert to
    // a base-10 string.
    // The magic numbers used here are -
    // 2^24 = 16777216 = (1,6777216) in base-1e7.
    // 2^48 = 281474976710656 = (2,8147497,6710656) in base-1e7.
    // Split 32:32 representation into 16:24:24 representation so our
    // intermediate digits don't overflow.
    let low = bitsLow & 0xffffff
    let mid = (((bitsLow >>> 24) | (bitsHigh << 8)) >>> 0) & 0xffffff
    let high = (bitsHigh >> 16) & 0xffff
    // Assemble our three base-1e7 digits, ignoring carries. The maximum
    // value in a digit at this step is representable as a 48-bit integer, which
    // can be stored in a 64-bit floating point number.
    let digitA = low + mid * 6777216 + high * 6710656
    let digitB = mid + high * 8147497
    let digitC = high * 2
    // Apply carries from A to B and from B to C.
    let base = 10000000
    if (digitA >= base) {
        digitB += Math.floor(digitA / base)
        digitA %= base
    }
    if (digitB >= base) {
        digitC += Math.floor(digitB / base)
        digitB %= base
    }
    // Convert base-1e7 digits to base-10, with optional leading zeroes.
    function decimalFrom1e7(digit1e7, needLeadingZeros) {
        let partial = digit1e7 ? String(digit1e7) : ''
        if (needLeadingZeros) {
            return '0000000'.slice(partial.length) + partial
        }
        return partial
    }
    return (
        decimalFrom1e7(digitC, /*needLeadingZeros=*/ 0) +
        decimalFrom1e7(digitB, /*needLeadingZeros=*/ digitC) +
        // If the final 1e7 digit didn't need leading zeros, we would have
        // returned via the trivial code path at the top.
        decimalFrom1e7(digitA, /*needLeadingZeros=*/ 1)
    )
}
/**
 * Write a 32 bit varint, signed or unsigned. Same as `varint64write(0, value, bytes)`
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/1b18833f4f2a2f681f4e4a25cdf3b0a43115ec26/js/binary/encoder.js#L144
 */
function varint32write(value, bytes) {
    if (value >= 0) {
        // write value as varint 32
        while (value > 0x7f) {
            bytes.push((value & 0x7f) | 0x80)
            value = value >>> 7
        }
        bytes.push(value)
    } else {
        for (let i = 0; i < 9; i++) {
            bytes.push((value & 127) | 128)
            value = value >> 7
        }
        bytes.push(1)
    }
}
/**
 * Read an unsigned 32 bit varint.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L220
 */
function varint32read() {
    let b = this.buf[this.pos++]
    let result = b & 0x7f
    if ((b & 0x80) == 0) {
        this.assertBounds()
        return result
    }
    b = this.buf[this.pos++]
    result |= (b & 0x7f) << 7
    if ((b & 0x80) == 0) {
        this.assertBounds()
        return result
    }
    b = this.buf[this.pos++]
    result |= (b & 0x7f) << 14
    if ((b & 0x80) == 0) {
        this.assertBounds()
        return result
    }
    b = this.buf[this.pos++]
    result |= (b & 0x7f) << 21
    if ((b & 0x80) == 0) {
        this.assertBounds()
        return result
    }
    // Extract only last 4 bits
    b = this.buf[this.pos++]
    result |= (b & 0x0f) << 28
    for (let readBytes = 5; (b & 0x80) !== 0 && readBytes < 10; readBytes++) b = this.buf[this.pos++]
    if ((b & 0x80) != 0) throw new Error('invalid varint')
    this.assertBounds()
    // Result can have 32 bits, convert it to unsigned
    return result >>> 0
}

let BI
function detectBi() {
    const dv = new DataView(new ArrayBuffer(8))
    const ok =
        globalThis.BigInt !== undefined &&
        typeof dv.getBigInt64 === 'function' &&
        typeof dv.getBigUint64 === 'function' &&
        typeof dv.setBigInt64 === 'function' &&
        typeof dv.setBigUint64 === 'function'
    BI = ok
        ? {
              MIN: BigInt('-9223372036854775808'),
              MAX: BigInt('9223372036854775807'),
              UMIN: BigInt('0'),
              UMAX: BigInt('18446744073709551615'),
              C: BigInt,
              V: dv,
          }
        : undefined
}
detectBi()
function assertBi(bi) {
    if (!bi) throw new Error('BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support')
}
// used to validate from(string) input (when bigint is unavailable)
const RE_DECIMAL_STR = /^-?[0-9]+$/
// constants for binary math
const TWO_PWR_32_DBL = 0x100000000
const HALF_2_PWR_32 = 0x080000000
// base class for PbLong and PbULong provides shared code
class SharedPbLong {
    /**
     * Create a new instance with the given bits.
     */
    constructor(lo, hi) {
        this.lo = lo | 0
        this.hi = hi | 0
    }
    /**
     * Is this instance equal to 0?
     */
    isZero() {
        return this.lo == 0 && this.hi == 0
    }
    /**
     * Convert to a native number.
     */
    toNumber() {
        let result = this.hi * TWO_PWR_32_DBL + (this.lo >>> 0)
        if (!Number.isSafeInteger(result)) throw new Error('cannot convert to safe number')
        return result
    }
}
/**
 * 64-bit unsigned integer as two 32-bit values.
 * Converts between `string`, `number` and `bigint` representations.
 */
class PbULong extends SharedPbLong {
    /**
     * Create instance from a `string`, `number` or `bigint`.
     */
    static from(value) {
        if (BI)
            // noinspection FallThroughInSwitchStatementJS
            switch (typeof value) {
                case 'string':
                    if (value == '0') return this.ZERO
                    if (value == '') throw new Error('string is no integer')
                    value = BI.C(value)
                case 'number':
                    if (value === 0) return this.ZERO
                    value = BI.C(value)
                case 'bigint':
                    if (!value) return this.ZERO
                    if (value < BI.UMIN) throw new Error('signed value for ulong')
                    if (value > BI.UMAX) throw new Error('ulong too large')
                    BI.V.setBigUint64(0, value, true)
                    return new PbULong(BI.V.getInt32(0, true), BI.V.getInt32(4, true))
            }
        else
            switch (typeof value) {
                case 'string':
                    if (value == '0') return this.ZERO
                    value = value.trim()
                    if (!RE_DECIMAL_STR.test(value)) throw new Error('string is no integer')
                    let [minus, lo, hi] = int64fromString(value)
                    if (minus) throw new Error('signed value for ulong')
                    return new PbULong(lo, hi)
                case 'number':
                    if (value == 0) return this.ZERO
                    if (!Number.isSafeInteger(value)) throw new Error('number is no integer')
                    if (value < 0) throw new Error('signed value for ulong')
                    return new PbULong(value, value / TWO_PWR_32_DBL)
            }
        throw new Error('unknown value ' + typeof value)
    }
    /**
     * Convert to decimal string.
     */
    toString() {
        return BI ? this.toBigInt().toString() : int64toString(this.lo, this.hi)
    }
    /**
     * Convert to native bigint.
     */
    toBigInt() {
        assertBi(BI)
        BI.V.setInt32(0, this.lo, true)
        BI.V.setInt32(4, this.hi, true)
        return BI.V.getBigUint64(0, true)
    }
}
/**
 * ulong 0 singleton.
 */
PbULong.ZERO = new PbULong(0, 0)
/**
 * 64-bit signed integer as two 32-bit values.
 * Converts between `string`, `number` and `bigint` representations.
 */
class PbLong extends SharedPbLong {
    /**
     * Create instance from a `string`, `number` or `bigint`.
     */
    static from(value) {
        if (BI)
            // noinspection FallThroughInSwitchStatementJS
            switch (typeof value) {
                case 'string':
                    if (value == '0') return this.ZERO
                    if (value == '') throw new Error('string is no integer')
                    value = BI.C(value)
                case 'number':
                    if (value === 0) return this.ZERO
                    value = BI.C(value)
                case 'bigint':
                    if (!value) return this.ZERO
                    if (value < BI.MIN) throw new Error('signed long too small')
                    if (value > BI.MAX) throw new Error('signed long too large')
                    BI.V.setBigInt64(0, value, true)
                    return new PbLong(BI.V.getInt32(0, true), BI.V.getInt32(4, true))
            }
        else
            switch (typeof value) {
                case 'string':
                    if (value == '0') return this.ZERO
                    value = value.trim()
                    if (!RE_DECIMAL_STR.test(value)) throw new Error('string is no integer')
                    let [minus, lo, hi] = int64fromString(value)
                    if (minus) {
                        if (hi > HALF_2_PWR_32 || (hi == HALF_2_PWR_32 && lo != 0)) throw new Error('signed long too small')
                    } else if (hi >= HALF_2_PWR_32) throw new Error('signed long too large')
                    let pbl = new PbLong(lo, hi)
                    return minus ? pbl.negate() : pbl
                case 'number':
                    if (value == 0) return this.ZERO
                    if (!Number.isSafeInteger(value)) throw new Error('number is no integer')
                    return value > 0 ? new PbLong(value, value / TWO_PWR_32_DBL) : new PbLong(-value, -value / TWO_PWR_32_DBL).negate()
            }
        throw new Error('unknown value ' + typeof value)
    }
    /**
     * Do we have a minus sign?
     */
    isNegative() {
        return (this.hi & HALF_2_PWR_32) !== 0
    }
    /**
     * Negate two's complement.
     * Invert all the bits and add one to the result.
     */
    negate() {
        let hi = ~this.hi,
            lo = this.lo
        if (lo) lo = ~lo + 1
        else hi += 1
        return new PbLong(lo, hi)
    }
    /**
     * Convert to decimal string.
     */
    toString() {
        if (BI) return this.toBigInt().toString()
        if (this.isNegative()) {
            let n = this.negate()
            return '-' + int64toString(n.lo, n.hi)
        }
        return int64toString(this.lo, this.hi)
    }
    /**
     * Convert to native bigint.
     */
    toBigInt() {
        assertBi(BI)
        BI.V.setInt32(0, this.lo, true)
        BI.V.setInt32(4, this.hi, true)
        return BI.V.getBigInt64(0, true)
    }
}
/**
 * long 0 singleton.
 */
PbLong.ZERO = new PbLong(0, 0)

const defaultsRead$1 = {
    readUnknownField: true,
    readerFactory: (bytes) => new BinaryReader(bytes),
}
/**
 * Make options for reading binary data form partial options.
 */
function binaryReadOptions(options) {
    return options ? Object.assign(Object.assign({}, defaultsRead$1), options) : defaultsRead$1
}
class BinaryReader {
    constructor(buf, textDecoder) {
        this.varint64 = varint64read // dirty cast for `this`
        /**
         * Read a `uint32` field, an unsigned 32 bit varint.
         */
        this.uint32 = varint32read // dirty cast for `this` and access to protected `buf`
        this.buf = buf
        this.len = buf.length
        this.pos = 0
        this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
        this.textDecoder =
            textDecoder !== null && textDecoder !== void 0
                ? textDecoder
                : new TextDecoder('utf-8', {
                      fatal: true,
                      ignoreBOM: true,
                  })
    }
    /**
     * Reads a tag - field number and wire type.
     */
    tag() {
        let tag = this.uint32(),
            fieldNo = tag >>> 3,
            wireType = tag & 7
        if (fieldNo <= 0 || wireType < 0 || wireType > 5) throw new Error('illegal tag: field no ' + fieldNo + ' wire type ' + wireType)
        return [fieldNo, wireType]
    }
    /**
     * Skip one element on the wire and return the skipped data.
     * Supports WireType.StartGroup since v2.0.0-alpha.23.
     */
    skip(wireType) {
        let start = this.pos
        // noinspection FallThroughInSwitchStatementJS
        switch (wireType) {
            case WireType.Varint:
                while (this.buf[this.pos++] & 0x80) {
                    // ignore
                }
                break
            case WireType.Bit64:
                this.pos += 4
            case WireType.Bit32:
                this.pos += 4
                break
            case WireType.LengthDelimited:
                let len = this.uint32()
                this.pos += len
                break
            case WireType.StartGroup:
                // From descriptor.proto: Group type is deprecated, not supported in proto3.
                // But we must still be able to parse and treat as unknown.
                let t
                while ((t = this.tag()[1]) !== WireType.EndGroup) {
                    this.skip(t)
                }
                break
            default:
                throw new Error('cant skip wire type ' + wireType)
        }
        this.assertBounds()
        return this.buf.subarray(start, this.pos)
    }
    /**
     * Throws error if position in byte array is out of range.
     */
    assertBounds() {
        if (this.pos > this.len) throw new RangeError('premature EOF')
    }
    /**
     * Read a `int32` field, a signed 32 bit varint.
     */
    int32() {
        return this.uint32() | 0
    }
    /**
     * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
     */
    sint32() {
        let zze = this.uint32()
        // decode zigzag
        return (zze >>> 1) ^ -(zze & 1)
    }
    /**
     * Read a `int64` field, a signed 64-bit varint.
     */
    int64() {
        return new PbLong(...this.varint64())
    }
    /**
     * Read a `uint64` field, an unsigned 64-bit varint.
     */
    uint64() {
        return new PbULong(...this.varint64())
    }
    /**
     * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64() {
        let [lo, hi] = this.varint64()
        // decode zig zag
        let s = -(lo & 1)
        lo = ((lo >>> 1) | ((hi & 1) << 31)) ^ s
        hi = (hi >>> 1) ^ s
        return new PbLong(lo, hi)
    }
    /**
     * Read a `bool` field, a variant.
     */
    bool() {
        let [lo, hi] = this.varint64()
        return lo !== 0 || hi !== 0
    }
    /**
     * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
     */
    fixed32() {
        return this.view.getUint32((this.pos += 4) - 4, true)
    }
    /**
     * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
     */
    sfixed32() {
        return this.view.getInt32((this.pos += 4) - 4, true)
    }
    /**
     * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
     */
    fixed64() {
        return new PbULong(this.sfixed32(), this.sfixed32())
    }
    /**
     * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
     */
    sfixed64() {
        return new PbLong(this.sfixed32(), this.sfixed32())
    }
    /**
     * Read a `float` field, 32-bit floating point number.
     */
    float() {
        return this.view.getFloat32((this.pos += 4) - 4, true)
    }
    /**
     * Read a `double` field, a 64-bit floating point number.
     */
    double() {
        return this.view.getFloat64((this.pos += 8) - 8, true)
    }
    /**
     * Read a `bytes` field, length-delimited arbitrary data.
     */
    bytes() {
        let len = this.uint32()
        let start = this.pos
        this.pos += len
        this.assertBounds()
        return this.buf.subarray(start, start + len)
    }
    /**
     * Read a `string` field, length-delimited data converted to UTF-8 text.
     */
    string() {
        return this.textDecoder.decode(this.bytes())
    }
}

/**
 * assert that condition is true or throw error (with message)
 */
function assert(condition, msg) {
    if (!condition) {
        throw new Error(msg)
    }
}
const FLOAT32_MAX = 3.4028234663852886e38,
    FLOAT32_MIN = -3.4028234663852886e38,
    UINT32_MAX = 0xffffffff,
    INT32_MAX = 0x7fffffff,
    INT32_MIN = -0x80000000
function assertInt32(arg) {
    if (typeof arg !== 'number') throw new Error('invalid int 32: ' + typeof arg)
    if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN) throw new Error('invalid int 32: ' + arg)
}
function assertUInt32(arg) {
    if (typeof arg !== 'number') throw new Error('invalid uint 32: ' + typeof arg)
    if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0) throw new Error('invalid uint 32: ' + arg)
}
function assertFloat32(arg) {
    if (typeof arg !== 'number') throw new Error('invalid float 32: ' + typeof arg)
    if (!Number.isFinite(arg)) return
    if (arg > FLOAT32_MAX || arg < FLOAT32_MIN) throw new Error('invalid float 32: ' + arg)
}

const defaultsWrite$1 = {
    writeUnknownFields: true,
    writerFactory: () => new BinaryWriter(),
}
/**
 * Make options for writing binary data form partial options.
 */
function binaryWriteOptions(options) {
    return options ? Object.assign(Object.assign({}, defaultsWrite$1), options) : defaultsWrite$1
}
class BinaryWriter {
    constructor(textEncoder) {
        /**
         * Previous fork states.
         */
        this.stack = []
        this.textEncoder = textEncoder !== null && textEncoder !== void 0 ? textEncoder : new TextEncoder()
        this.chunks = []
        this.buf = []
    }
    /**
     * Return all bytes written and reset this writer.
     */
    finish() {
        this.chunks.push(new Uint8Array(this.buf)) // flush the buffer
        let len = 0
        for (let i = 0; i < this.chunks.length; i++) len += this.chunks[i].length
        let bytes = new Uint8Array(len)
        let offset = 0
        for (let i = 0; i < this.chunks.length; i++) {
            bytes.set(this.chunks[i], offset)
            offset += this.chunks[i].length
        }
        this.chunks = []
        return bytes
    }
    /**
     * Start a new fork for length-delimited data like a message
     * or a packed repeated field.
     *
     * Must be joined later with `join()`.
     */
    fork() {
        this.stack.push({ chunks: this.chunks, buf: this.buf })
        this.chunks = []
        this.buf = []
        return this
    }
    /**
     * Join the last fork. Write its length and bytes, then
     * return to the previous state.
     */
    join() {
        // get chunk of fork
        let chunk = this.finish()
        // restore previous state
        let prev = this.stack.pop()
        if (!prev) throw new Error('invalid state, fork stack empty')
        this.chunks = prev.chunks
        this.buf = prev.buf
        // write length of chunk as varint
        this.uint32(chunk.byteLength)
        return this.raw(chunk)
    }
    /**
     * Writes a tag (field number and wire type).
     *
     * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
     *
     * Generated code should compute the tag ahead of time and call `uint32()`.
     */
    tag(fieldNo, type) {
        return this.uint32(((fieldNo << 3) | type) >>> 0)
    }
    /**
     * Write a chunk of raw bytes.
     */
    raw(chunk) {
        if (this.buf.length) {
            this.chunks.push(new Uint8Array(this.buf))
            this.buf = []
        }
        this.chunks.push(chunk)
        return this
    }
    /**
     * Write a `uint32` value, an unsigned 32 bit varint.
     */
    uint32(value) {
        assertUInt32(value)
        // write value as varint 32, inlined for speed
        while (value > 0x7f) {
            this.buf.push((value & 0x7f) | 0x80)
            value = value >>> 7
        }
        this.buf.push(value)
        return this
    }
    /**
     * Write a `int32` value, a signed 32 bit varint.
     */
    int32(value) {
        assertInt32(value)
        varint32write(value, this.buf)
        return this
    }
    /**
     * Write a `bool` value, a variant.
     */
    bool(value) {
        this.buf.push(value ? 1 : 0)
        return this
    }
    /**
     * Write a `bytes` value, length-delimited arbitrary data.
     */
    bytes(value) {
        this.uint32(value.byteLength) // write length of chunk as varint
        return this.raw(value)
    }
    /**
     * Write a `string` value, length-delimited data converted to UTF-8 text.
     */
    string(value) {
        let chunk = this.textEncoder.encode(value)
        this.uint32(chunk.byteLength) // write length of chunk as varint
        return this.raw(chunk)
    }
    /**
     * Write a `float` value, 32-bit floating point number.
     */
    float(value) {
        assertFloat32(value)
        let chunk = new Uint8Array(4)
        new DataView(chunk.buffer).setFloat32(0, value, true)
        return this.raw(chunk)
    }
    /**
     * Write a `double` value, a 64-bit floating point number.
     */
    double(value) {
        let chunk = new Uint8Array(8)
        new DataView(chunk.buffer).setFloat64(0, value, true)
        return this.raw(chunk)
    }
    /**
     * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
     */
    fixed32(value) {
        assertUInt32(value)
        let chunk = new Uint8Array(4)
        new DataView(chunk.buffer).setUint32(0, value, true)
        return this.raw(chunk)
    }
    /**
     * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
     */
    sfixed32(value) {
        assertInt32(value)
        let chunk = new Uint8Array(4)
        new DataView(chunk.buffer).setInt32(0, value, true)
        return this.raw(chunk)
    }
    /**
     * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
     */
    sint32(value) {
        assertInt32(value)
        // zigzag encode
        value = ((value << 1) ^ (value >> 31)) >>> 0
        varint32write(value, this.buf)
        return this
    }
    /**
     * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
     */
    sfixed64(value) {
        let chunk = new Uint8Array(8)
        let view = new DataView(chunk.buffer)
        let long = PbLong.from(value)
        view.setInt32(0, long.lo, true)
        view.setInt32(4, long.hi, true)
        return this.raw(chunk)
    }
    /**
     * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
     */
    fixed64(value) {
        let chunk = new Uint8Array(8)
        let view = new DataView(chunk.buffer)
        let long = PbULong.from(value)
        view.setInt32(0, long.lo, true)
        view.setInt32(4, long.hi, true)
        return this.raw(chunk)
    }
    /**
     * Write a `int64` value, a signed 64-bit varint.
     */
    int64(value) {
        let long = PbLong.from(value)
        varint64write(long.lo, long.hi, this.buf)
        return this
    }
    /**
     * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64(value) {
        let long = PbLong.from(value),
            // zigzag encode
            sign = long.hi >> 31,
            lo = (long.lo << 1) ^ sign,
            hi = ((long.hi << 1) | (long.lo >>> 31)) ^ sign
        varint64write(lo, hi, this.buf)
        return this
    }
    /**
     * Write a `uint64` value, an unsigned 64-bit varint.
     */
    uint64(value) {
        let long = PbULong.from(value)
        varint64write(long.lo, long.hi, this.buf)
        return this
    }
}

const defaultsWrite = {
        emitDefaultValues: false,
        enumAsInteger: false,
        useProtoFieldName: false,
        prettySpaces: 0,
    },
    defaultsRead = {
        ignoreUnknownFields: false,
    }
/**
 * Make options for reading JSON data from partial options.
 */
function jsonReadOptions(options) {
    return options ? Object.assign(Object.assign({}, defaultsRead), options) : defaultsRead
}
/**
 * Make options for writing JSON data from partial options.
 */
function jsonWriteOptions(options) {
    return options ? Object.assign(Object.assign({}, defaultsWrite), options) : defaultsWrite
}

/**
 * The symbol used as a key on message objects to store the message type.
 *
 * Note that this is an experimental feature - it is here to stay, but
 * implementation details may change without notice.
 */
const MESSAGE_TYPE = Symbol.for('protobuf-ts/message-type')

/**
 * Converts snake_case to lowerCamelCase.
 *
 * Should behave like protoc:
 * https://github.com/protocolbuffers/protobuf/blob/e8ae137c96444ea313485ed1118c5e43b2099cf1/src/google/protobuf/compiler/java/java_helpers.cc#L118
 */
function lowerCamelCase(snakeCase) {
    let capNext = false
    const sb = []
    for (let i = 0; i < snakeCase.length; i++) {
        let next = snakeCase.charAt(i)
        if (next == '_') {
            capNext = true
        } else if (/\d/.test(next)) {
            sb.push(next)
            capNext = true
        } else if (capNext) {
            sb.push(next.toUpperCase())
            capNext = false
        } else if (i == 0) {
            sb.push(next.toLowerCase())
        } else {
            sb.push(next)
        }
    }
    return sb.join('')
}

/**
 * Scalar value types. This is a subset of field types declared by protobuf
 * enum google.protobuf.FieldDescriptorProto.Type The types GROUP and MESSAGE
 * are omitted, but the numerical values are identical.
 */
var ScalarType
;(function (ScalarType) {
    // 0 is reserved for errors.
    // Order is weird for historical reasons.
    ScalarType[(ScalarType['DOUBLE'] = 1)] = 'DOUBLE'
    ScalarType[(ScalarType['FLOAT'] = 2)] = 'FLOAT'
    // Not ZigZag encoded.  Negative numbers take 10 bytes.  Use TYPE_SINT64 if
    // negative values are likely.
    ScalarType[(ScalarType['INT64'] = 3)] = 'INT64'
    ScalarType[(ScalarType['UINT64'] = 4)] = 'UINT64'
    // Not ZigZag encoded.  Negative numbers take 10 bytes.  Use TYPE_SINT32 if
    // negative values are likely.
    ScalarType[(ScalarType['INT32'] = 5)] = 'INT32'
    ScalarType[(ScalarType['FIXED64'] = 6)] = 'FIXED64'
    ScalarType[(ScalarType['FIXED32'] = 7)] = 'FIXED32'
    ScalarType[(ScalarType['BOOL'] = 8)] = 'BOOL'
    ScalarType[(ScalarType['STRING'] = 9)] = 'STRING'
    // Tag-delimited aggregate.
    // Group type is deprecated and not supported in proto3. However, Proto3
    // implementations should still be able to parse the group wire format and
    // treat group fields as unknown fields.
    // TYPE_GROUP = 10,
    // TYPE_MESSAGE = 11,  // Length-delimited aggregate.
    // New in version 2.
    ScalarType[(ScalarType['BYTES'] = 12)] = 'BYTES'
    ScalarType[(ScalarType['UINT32'] = 13)] = 'UINT32'
    // TYPE_ENUM = 14,
    ScalarType[(ScalarType['SFIXED32'] = 15)] = 'SFIXED32'
    ScalarType[(ScalarType['SFIXED64'] = 16)] = 'SFIXED64'
    ScalarType[(ScalarType['SINT32'] = 17)] = 'SINT32'
    ScalarType[(ScalarType['SINT64'] = 18)] = 'SINT64'
})(ScalarType || (ScalarType = {}))
/**
 * JavaScript representation of 64 bit integral types. Equivalent to the
 * field option "jstype".
 *
 * By default, protobuf-ts represents 64 bit types as `bigint`.
 *
 * You can change the default behaviour by enabling the plugin parameter
 * `long_type_string`, which will represent 64 bit types as `string`.
 *
 * Alternatively, you can change the behaviour for individual fields
 * with the field option "jstype":
 *
 * ```protobuf
 * uint64 my_field = 1 [jstype = JS_STRING];
 * uint64 other_field = 2 [jstype = JS_NUMBER];
 * ```
 */
var LongType
;(function (LongType) {
    /**
     * Use JavaScript `bigint`.
     *
     * Field option `[jstype = JS_NORMAL]`.
     */
    LongType[(LongType['BIGINT'] = 0)] = 'BIGINT'
    /**
     * Use JavaScript `string`.
     *
     * Field option `[jstype = JS_STRING]`.
     */
    LongType[(LongType['STRING'] = 1)] = 'STRING'
    /**
     * Use JavaScript `number`.
     *
     * Large values will loose precision.
     *
     * Field option `[jstype = JS_NUMBER]`.
     */
    LongType[(LongType['NUMBER'] = 2)] = 'NUMBER'
})(LongType || (LongType = {}))
/**
 * Protobuf 2.1.0 introduced packed repeated fields.
 * Setting the field option `[packed = true]` enables packing.
 *
 * In proto3, all repeated fields are packed by default.
 * Setting the field option `[packed = false]` disables packing.
 *
 * Packed repeated fields are encoded with a single tag,
 * then a length-delimiter, then the element values.
 *
 * Unpacked repeated fields are encoded with a tag and
 * value for each element.
 *
 * `bytes` and `string` cannot be packed.
 */
var RepeatType
;(function (RepeatType) {
    /**
     * The field is not repeated.
     */
    RepeatType[(RepeatType['NO'] = 0)] = 'NO'
    /**
     * The field is repeated and should be packed.
     * Invalid for `bytes` and `string`, they cannot be packed.
     */
    RepeatType[(RepeatType['PACKED'] = 1)] = 'PACKED'
    /**
     * The field is repeated but should not be packed.
     * The only valid repeat type for repeated `bytes` and `string`.
     */
    RepeatType[(RepeatType['UNPACKED'] = 2)] = 'UNPACKED'
})(RepeatType || (RepeatType = {}))
/**
 * Turns PartialFieldInfo into FieldInfo.
 */
function normalizeFieldInfo(field) {
    var _a, _b, _c, _d
    field.localName = (_a = field.localName) !== null && _a !== void 0 ? _a : lowerCamelCase(field.name)
    field.jsonName = (_b = field.jsonName) !== null && _b !== void 0 ? _b : lowerCamelCase(field.name)
    field.repeat = (_c = field.repeat) !== null && _c !== void 0 ? _c : RepeatType.NO
    field.opt = (_d = field.opt) !== null && _d !== void 0 ? _d : field.repeat ? false : field.oneof ? false : field.kind == 'message'
    return field
}

/**
 * Is the given value a valid oneof group?
 *
 * We represent protobuf `oneof` as algebraic data types (ADT) in generated
 * code. But when working with messages of unknown type, the ADT does not
 * help us.
 *
 * This type guard checks if the given object adheres to the ADT rules, which
 * are as follows:
 *
 * 1) Must be an object.
 *
 * 2) Must have a "oneofKind" discriminator property.
 *
 * 3) If "oneofKind" is `undefined`, no member field is selected. The object
 * must not have any other properties.
 *
 * 4) If "oneofKind" is a `string`, the member field with this name is
 * selected.
 *
 * 5) If a member field is selected, the object must have a second property
 * with this name. The property must not be `undefined`.
 *
 * 6) No extra properties are allowed. The object has either one property
 * (no selection) or two properties (selection).
 *
 */
function isOneofGroup(any) {
    if (typeof any != 'object' || any === null || !any.hasOwnProperty('oneofKind')) {
        return false
    }
    switch (typeof any.oneofKind) {
        case 'string':
            if (any[any.oneofKind] === undefined) return false
            return Object.keys(any).length == 2
        case 'undefined':
            return Object.keys(any).length == 1
        default:
            return false
    }
}

// noinspection JSMethodCanBeStatic
class ReflectionTypeCheck {
    constructor(info) {
        var _a
        this.fields = (_a = info.fields) !== null && _a !== void 0 ? _a : []
    }
    prepare() {
        if (this.data) return
        const req = [],
            known = [],
            oneofs = []
        for (let field of this.fields) {
            if (field.oneof) {
                if (!oneofs.includes(field.oneof)) {
                    oneofs.push(field.oneof)
                    req.push(field.oneof)
                    known.push(field.oneof)
                }
            } else {
                known.push(field.localName)
                switch (field.kind) {
                    case 'scalar':
                    case 'enum':
                        if (!field.opt || field.repeat) req.push(field.localName)
                        break
                    case 'message':
                        if (field.repeat) req.push(field.localName)
                        break
                    case 'map':
                        req.push(field.localName)
                        break
                }
            }
        }
        this.data = { req, known, oneofs: Object.values(oneofs) }
    }
    /**
     * Is the argument a valid message as specified by the
     * reflection information?
     *
     * Checks all field types recursively. The `depth`
     * specifies how deep into the structure the check will be.
     *
     * With a depth of 0, only the presence of fields
     * is checked.
     *
     * With a depth of 1 or more, the field types are checked.
     *
     * With a depth of 2 or more, the members of map, repeated
     * and message fields are checked.
     *
     * Message fields will be checked recursively with depth - 1.
     *
     * The number of map entries / repeated values being checked
     * is < depth.
     */
    is(message, depth, allowExcessProperties = false) {
        if (depth < 0) return true
        if (message === null || message === undefined || typeof message != 'object') return false
        this.prepare()
        let keys = Object.keys(message),
            data = this.data
        // if a required field is missing in arg, this cannot be a T
        if (keys.length < data.req.length || data.req.some((n) => !keys.includes(n))) return false
        if (!allowExcessProperties) {
            // if the arg contains a key we dont know, this is not a literal T
            if (keys.some((k) => !data.known.includes(k))) return false
        }
        // "With a depth of 0, only the presence and absence of fields is checked."
        // "With a depth of 1 or more, the field types are checked."
        if (depth < 1) {
            return true
        }
        // check oneof group
        for (const name of data.oneofs) {
            const group = message[name]
            if (!isOneofGroup(group)) return false
            if (group.oneofKind === undefined) continue
            const field = this.fields.find((f) => f.localName === group.oneofKind)
            if (!field) return false // we found no field, but have a kind, something is wrong
            if (!this.field(group[group.oneofKind], field, allowExcessProperties, depth)) return false
        }
        // check types
        for (const field of this.fields) {
            if (field.oneof !== undefined) continue
            if (!this.field(message[field.localName], field, allowExcessProperties, depth)) return false
        }
        return true
    }
    field(arg, field, allowExcessProperties, depth) {
        let repeated = field.repeat
        switch (field.kind) {
            case 'scalar':
                if (arg === undefined) return field.opt
                if (repeated) return this.scalars(arg, field.T, depth, field.L)
                return this.scalar(arg, field.T, field.L)
            case 'enum':
                if (arg === undefined) return field.opt
                if (repeated) return this.scalars(arg, ScalarType.INT32, depth)
                return this.scalar(arg, ScalarType.INT32)
            case 'message':
                if (arg === undefined) return true
                if (repeated) return this.messages(arg, field.T(), allowExcessProperties, depth)
                return this.message(arg, field.T(), allowExcessProperties, depth)
            case 'map':
                if (typeof arg != 'object' || arg === null) return false
                if (depth < 2) return true
                if (!this.mapKeys(arg, field.K, depth)) return false
                switch (field.V.kind) {
                    case 'scalar':
                        return this.scalars(Object.values(arg), field.V.T, depth, field.V.L)
                    case 'enum':
                        return this.scalars(Object.values(arg), ScalarType.INT32, depth)
                    case 'message':
                        return this.messages(Object.values(arg), field.V.T(), allowExcessProperties, depth)
                }
                break
        }
        return true
    }
    message(arg, type, allowExcessProperties, depth) {
        if (allowExcessProperties) {
            return type.isAssignable(arg, depth)
        }
        return type.is(arg, depth)
    }
    messages(arg, type, allowExcessProperties, depth) {
        if (!Array.isArray(arg)) return false
        if (depth < 2) return true
        if (allowExcessProperties) {
            for (let i = 0; i < arg.length && i < depth; i++) if (!type.isAssignable(arg[i], depth - 1)) return false
        } else {
            for (let i = 0; i < arg.length && i < depth; i++) if (!type.is(arg[i], depth - 1)) return false
        }
        return true
    }
    scalar(arg, type, longType) {
        let argType = typeof arg
        switch (type) {
            case ScalarType.UINT64:
            case ScalarType.FIXED64:
            case ScalarType.INT64:
            case ScalarType.SFIXED64:
            case ScalarType.SINT64:
                switch (longType) {
                    case LongType.BIGINT:
                        return argType == 'bigint'
                    case LongType.NUMBER:
                        return argType == 'number' && !isNaN(arg)
                    default:
                        return argType == 'string'
                }
            case ScalarType.BOOL:
                return argType == 'boolean'
            case ScalarType.STRING:
                return argType == 'string'
            case ScalarType.BYTES:
                return arg instanceof Uint8Array
            case ScalarType.DOUBLE:
            case ScalarType.FLOAT:
                return argType == 'number' && !isNaN(arg)
            default:
                // case ScalarType.UINT32:
                // case ScalarType.FIXED32:
                // case ScalarType.INT32:
                // case ScalarType.SINT32:
                // case ScalarType.SFIXED32:
                return argType == 'number' && Number.isInteger(arg)
        }
    }
    scalars(arg, type, depth, longType) {
        if (!Array.isArray(arg)) return false
        if (depth < 2) return true
        if (Array.isArray(arg)) for (let i = 0; i < arg.length && i < depth; i++) if (!this.scalar(arg[i], type, longType)) return false
        return true
    }
    mapKeys(map, type, depth) {
        let keys = Object.keys(map)
        switch (type) {
            case ScalarType.INT32:
            case ScalarType.FIXED32:
            case ScalarType.SFIXED32:
            case ScalarType.SINT32:
            case ScalarType.UINT32:
                return this.scalars(
                    keys.slice(0, depth).map((k) => parseInt(k)),
                    type,
                    depth
                )
            case ScalarType.BOOL:
                return this.scalars(
                    keys.slice(0, depth).map((k) => (k == 'true' ? true : k == 'false' ? false : k)),
                    type,
                    depth
                )
            default:
                return this.scalars(keys, type, depth, LongType.STRING)
        }
    }
}

/**
 * Utility method to convert a PbLong or PbUlong to a JavaScript
 * representation during runtime.
 *
 * Works with generated field information, `undefined` is equivalent
 * to `STRING`.
 */
function reflectionLongConvert(long, type) {
    switch (type) {
        case LongType.BIGINT:
            return long.toBigInt()
        case LongType.NUMBER:
            return long.toNumber()
        default:
            // case undefined:
            // case LongType.STRING:
            return long.toString()
    }
}

/**
 * Reads proto3 messages in canonical JSON format using reflection information.
 *
 * https://developers.google.com/protocol-buffers/docs/proto3#json
 */
class ReflectionJsonReader {
    constructor(info) {
        this.info = info
    }
    prepare() {
        var _a
        if (this.fMap === undefined) {
            this.fMap = {}
            const fieldsInput = (_a = this.info.fields) !== null && _a !== void 0 ? _a : []
            for (const field of fieldsInput) {
                this.fMap[field.name] = field
                this.fMap[field.jsonName] = field
                this.fMap[field.localName] = field
            }
        }
    }
    // Cannot parse JSON <type of jsonValue> for <type name>#<fieldName>.
    assert(condition, fieldName, jsonValue) {
        if (!condition) {
            let what = typeofJsonValue(jsonValue)
            if (what == 'number' || what == 'boolean') what = jsonValue.toString()
            throw new Error(`Cannot parse JSON ${what} for ${this.info.typeName}#${fieldName}`)
        }
    }
    /**
     * Reads a message from canonical JSON format into the target message.
     *
     * Repeated fields are appended. Map entries are added, overwriting
     * existing keys.
     *
     * If a message field is already present, it will be merged with the
     * new data.
     */
    read(input, message, options) {
        this.prepare()
        const oneofsHandled = []
        for (const [jsonKey, jsonValue] of Object.entries(input)) {
            const field = this.fMap[jsonKey]
            if (!field) {
                if (!options.ignoreUnknownFields)
                    throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: ${jsonKey}`)
                continue
            }
            const localName = field.localName
            // handle oneof ADT
            let target // this will be the target for the field value, whether it is member of a oneof or not
            if (field.oneof) {
                if (jsonValue === null && (field.kind !== 'enum' || field.T()[0] !== 'google.protobuf.NullValue')) {
                    continue
                }
                // since json objects are unordered by specification, it is not possible to take the last of multiple oneofs
                if (oneofsHandled.includes(field.oneof))
                    throw new Error(`Multiple members of the oneof group "${field.oneof}" of ${this.info.typeName} are present in JSON.`)
                oneofsHandled.push(field.oneof)
                target = message[field.oneof] = {
                    oneofKind: localName,
                }
            } else {
                target = message
            }
            // we have handled oneof above. we just have read the value into `target`.
            if (field.kind == 'map') {
                if (jsonValue === null) {
                    continue
                }
                // check input
                this.assert(isJsonObject(jsonValue), field.name, jsonValue)
                // our target to put map entries into
                const fieldObj = target[localName]
                // read entries
                for (const [jsonObjKey, jsonObjValue] of Object.entries(jsonValue)) {
                    this.assert(jsonObjValue !== null, field.name + ' map value', null)
                    // read value
                    let val
                    switch (field.V.kind) {
                        case 'message':
                            val = field.V.T().internalJsonRead(jsonObjValue, options)
                            break
                        case 'enum':
                            val = this.enum(field.V.T(), jsonObjValue, field.name, options.ignoreUnknownFields)
                            if (val === false) continue
                            break
                        case 'scalar':
                            val = this.scalar(jsonObjValue, field.V.T, field.V.L, field.name)
                            break
                    }
                    this.assert(val !== undefined, field.name + ' map value', jsonObjValue)
                    // read key
                    let key = jsonObjKey
                    if (field.K == ScalarType.BOOL) key = key == 'true' ? true : key == 'false' ? false : key
                    key = this.scalar(key, field.K, LongType.STRING, field.name).toString()
                    fieldObj[key] = val
                }
            } else if (field.repeat) {
                if (jsonValue === null) continue
                // check input
                this.assert(Array.isArray(jsonValue), field.name, jsonValue)
                // our target to put array entries into
                const fieldArr = target[localName]
                // read array entries
                for (const jsonItem of jsonValue) {
                    this.assert(jsonItem !== null, field.name, null)
                    let val
                    switch (field.kind) {
                        case 'message':
                            val = field.T().internalJsonRead(jsonItem, options)
                            break
                        case 'enum':
                            val = this.enum(field.T(), jsonItem, field.name, options.ignoreUnknownFields)
                            if (val === false) continue
                            break
                        case 'scalar':
                            val = this.scalar(jsonItem, field.T, field.L, field.name)
                            break
                    }
                    this.assert(val !== undefined, field.name, jsonValue)
                    fieldArr.push(val)
                }
            } else {
                switch (field.kind) {
                    case 'message':
                        if (jsonValue === null && field.T().typeName != 'google.protobuf.Value') {
                            this.assert(field.oneof === undefined, field.name + ' (oneof member)', null)
                            continue
                        }
                        target[localName] = field.T().internalJsonRead(jsonValue, options, target[localName])
                        break
                    case 'enum':
                        let val = this.enum(field.T(), jsonValue, field.name, options.ignoreUnknownFields)
                        if (val === false) continue
                        target[localName] = val
                        break
                    case 'scalar':
                        target[localName] = this.scalar(jsonValue, field.T, field.L, field.name)
                        break
                }
            }
        }
    }
    /**
     * Returns `false` for unrecognized string representations.
     *
     * google.protobuf.NullValue accepts only JSON `null` (or the old `"NULL_VALUE"`).
     */
    enum(type, json, fieldName, ignoreUnknownFields) {
        if (type[0] == 'google.protobuf.NullValue')
            assert(json === null || json === 'NULL_VALUE', `Unable to parse field ${this.info.typeName}#${fieldName}, enum ${type[0]} only accepts null.`)
        if (json === null)
            // we require 0 to be default value for all enums
            return 0
        switch (typeof json) {
            case 'number':
                assert(Number.isInteger(json), `Unable to parse field ${this.info.typeName}#${fieldName}, enum can only be integral number, got ${json}.`)
                return json
            case 'string':
                let localEnumName = json
                if (type[2] && json.substring(0, type[2].length) === type[2])
                    // lookup without the shared prefix
                    localEnumName = json.substring(type[2].length)
                let enumNumber = type[1][localEnumName]
                if (typeof enumNumber === 'undefined' && ignoreUnknownFields) {
                    return false
                }
                assert(typeof enumNumber == 'number', `Unable to parse field ${this.info.typeName}#${fieldName}, enum ${type[0]} has no value for "${json}".`)
                return enumNumber
        }
        assert(false, `Unable to parse field ${this.info.typeName}#${fieldName}, cannot parse enum value from ${typeof json}".`)
    }
    scalar(json, type, longType, fieldName) {
        let e
        try {
            switch (type) {
                // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
                // Either numbers or strings are accepted. Exponent notation is also accepted.
                case ScalarType.DOUBLE:
                case ScalarType.FLOAT:
                    if (json === null) return 0.0
                    if (json === 'NaN') return Number.NaN
                    if (json === 'Infinity') return Number.POSITIVE_INFINITY
                    if (json === '-Infinity') return Number.NEGATIVE_INFINITY
                    if (json === '') {
                        e = 'empty string'
                        break
                    }
                    if (typeof json == 'string' && json.trim().length !== json.length) {
                        e = 'extra whitespace'
                        break
                    }
                    if (typeof json != 'string' && typeof json != 'number') {
                        break
                    }
                    let float = Number(json)
                    if (Number.isNaN(float)) {
                        e = 'not a number'
                        break
                    }
                    if (!Number.isFinite(float)) {
                        // infinity and -infinity are handled by string representation above, so this is an error
                        e = 'too large or small'
                        break
                    }
                    if (type == ScalarType.FLOAT) assertFloat32(float)
                    return float
                // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
                case ScalarType.INT32:
                case ScalarType.FIXED32:
                case ScalarType.SFIXED32:
                case ScalarType.SINT32:
                case ScalarType.UINT32:
                    if (json === null) return 0
                    let int32
                    if (typeof json == 'number') int32 = json
                    else if (json === '') e = 'empty string'
                    else if (typeof json == 'string') {
                        if (json.trim().length !== json.length) e = 'extra whitespace'
                        else int32 = Number(json)
                    }
                    if (int32 === undefined) break
                    if (type == ScalarType.UINT32) assertUInt32(int32)
                    else assertInt32(int32)
                    return int32
                // int64, fixed64, uint64: JSON value will be a decimal string. Either numbers or strings are accepted.
                case ScalarType.INT64:
                case ScalarType.SFIXED64:
                case ScalarType.SINT64:
                    if (json === null) return reflectionLongConvert(PbLong.ZERO, longType)
                    if (typeof json != 'number' && typeof json != 'string') break
                    return reflectionLongConvert(PbLong.from(json), longType)
                case ScalarType.FIXED64:
                case ScalarType.UINT64:
                    if (json === null) return reflectionLongConvert(PbULong.ZERO, longType)
                    if (typeof json != 'number' && typeof json != 'string') break
                    return reflectionLongConvert(PbULong.from(json), longType)
                // bool:
                case ScalarType.BOOL:
                    if (json === null) return false
                    if (typeof json !== 'boolean') break
                    return json
                // string:
                case ScalarType.STRING:
                    if (json === null) return ''
                    if (typeof json !== 'string') {
                        e = 'extra whitespace'
                        break
                    }
                    try {
                        encodeURIComponent(json)
                    } catch (e) {
                        e = 'invalid UTF8'
                        break
                    }
                    return json
                // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
                // Either standard or URL-safe base64 encoding with/without paddings are accepted.
                case ScalarType.BYTES:
                    if (json === null || json === '') return new Uint8Array(0)
                    if (typeof json !== 'string') break
                    return base64decode(json)
            }
        } catch (error) {
            e = error.message
        }
        this.assert(false, fieldName + (e ? ' - ' + e : ''), json)
    }
}

/**
 * Writes proto3 messages in canonical JSON format using reflection
 * information.
 *
 * https://developers.google.com/protocol-buffers/docs/proto3#json
 */
class ReflectionJsonWriter {
    constructor(info) {
        var _a
        this.fields = (_a = info.fields) !== null && _a !== void 0 ? _a : []
    }
    /**
     * Converts the message to a JSON object, based on the field descriptors.
     */
    write(message, options) {
        const json = {},
            source = message
        for (const field of this.fields) {
            // field is not part of a oneof, simply write as is
            if (!field.oneof) {
                let jsonValue = this.field(field, source[field.localName], options)
                if (jsonValue !== undefined) json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue
                continue
            }
            // field is part of a oneof
            const group = source[field.oneof]
            if (group.oneofKind !== field.localName) continue // not selected, skip
            const opt = field.kind == 'scalar' || field.kind == 'enum' ? Object.assign(Object.assign({}, options), { emitDefaultValues: true }) : options
            let jsonValue = this.field(field, group[field.localName], opt)
            assert(jsonValue !== undefined)
            json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue
        }
        return json
    }
    field(field, value, options) {
        let jsonValue = undefined
        if (field.kind == 'map') {
            assert(typeof value == 'object' && value !== null)
            const jsonObj = {}
            switch (field.V.kind) {
                case 'scalar':
                    for (const [entryKey, entryValue] of Object.entries(value)) {
                        const val = this.scalar(field.V.T, entryValue, field.name, false, true)
                        assert(val !== undefined)
                        jsonObj[entryKey.toString()] = val // JSON standard allows only (double quoted) string as property key
                    }
                    break
                case 'message':
                    const messageType = field.V.T()
                    for (const [entryKey, entryValue] of Object.entries(value)) {
                        const val = this.message(messageType, entryValue, field.name, options)
                        assert(val !== undefined)
                        jsonObj[entryKey.toString()] = val // JSON standard allows only (double quoted) string as property key
                    }
                    break
                case 'enum':
                    const enumInfo = field.V.T()
                    for (const [entryKey, entryValue] of Object.entries(value)) {
                        assert(entryValue === undefined || typeof entryValue == 'number')
                        const val = this.enum(enumInfo, entryValue, field.name, false, true, options.enumAsInteger)
                        assert(val !== undefined)
                        jsonObj[entryKey.toString()] = val // JSON standard allows only (double quoted) string as property key
                    }
                    break
            }
            if (options.emitDefaultValues || Object.keys(jsonObj).length > 0) jsonValue = jsonObj
        } else if (field.repeat) {
            assert(Array.isArray(value))
            const jsonArr = []
            switch (field.kind) {
                case 'scalar':
                    for (let i = 0; i < value.length; i++) {
                        const val = this.scalar(field.T, value[i], field.name, field.opt, true)
                        assert(val !== undefined)
                        jsonArr.push(val)
                    }
                    break
                case 'enum':
                    const enumInfo = field.T()
                    for (let i = 0; i < value.length; i++) {
                        assert(value[i] === undefined || typeof value[i] == 'number')
                        const val = this.enum(enumInfo, value[i], field.name, field.opt, true, options.enumAsInteger)
                        assert(val !== undefined)
                        jsonArr.push(val)
                    }
                    break
                case 'message':
                    const messageType = field.T()
                    for (let i = 0; i < value.length; i++) {
                        const val = this.message(messageType, value[i], field.name, options)
                        assert(val !== undefined)
                        jsonArr.push(val)
                    }
                    break
            }
            // add converted array to json output
            if (options.emitDefaultValues || jsonArr.length > 0 || options.emitDefaultValues) jsonValue = jsonArr
        } else {
            switch (field.kind) {
                case 'scalar':
                    jsonValue = this.scalar(field.T, value, field.name, field.opt, options.emitDefaultValues)
                    break
                case 'enum':
                    jsonValue = this.enum(field.T(), value, field.name, field.opt, options.emitDefaultValues, options.enumAsInteger)
                    break
                case 'message':
                    jsonValue = this.message(field.T(), value, field.name, options)
                    break
            }
        }
        return jsonValue
    }
    /**
     * Returns `null` as the default for google.protobuf.NullValue.
     */
    enum(type, value, fieldName, optional, emitDefaultValues, enumAsInteger) {
        if (type[0] == 'google.protobuf.NullValue') return !emitDefaultValues && !optional ? undefined : null
        if (value === undefined) {
            assert(optional)
            return undefined
        }
        if (value === 0 && !emitDefaultValues && !optional)
            // we require 0 to be default value for all enums
            return undefined
        assert(typeof value == 'number')
        assert(Number.isInteger(value))
        if (enumAsInteger || !type[1].hasOwnProperty(value))
            // if we don't now the enum value, just return the number
            return value
        if (type[2])
            // restore the dropped prefix
            return type[2] + type[1][value]
        return type[1][value]
    }
    message(type, value, fieldName, options) {
        if (value === undefined) return options.emitDefaultValues ? null : undefined
        return type.internalJsonWrite(value, options)
    }
    scalar(type, value, fieldName, optional, emitDefaultValues) {
        if (value === undefined) {
            assert(optional)
            return undefined
        }
        const ed = emitDefaultValues || optional
        // noinspection FallThroughInSwitchStatementJS
        switch (type) {
            // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
            case ScalarType.INT32:
            case ScalarType.SFIXED32:
            case ScalarType.SINT32:
                if (value === 0) return ed ? 0 : undefined
                assertInt32(value)
                return value
            case ScalarType.FIXED32:
            case ScalarType.UINT32:
                if (value === 0) return ed ? 0 : undefined
                assertUInt32(value)
                return value
            // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
            // Either numbers or strings are accepted. Exponent notation is also accepted.
            case ScalarType.FLOAT:
                assertFloat32(value)
            case ScalarType.DOUBLE:
                if (value === 0) return ed ? 0 : undefined
                assert(typeof value == 'number')
                if (Number.isNaN(value)) return 'NaN'
                if (value === Number.POSITIVE_INFINITY) return 'Infinity'
                if (value === Number.NEGATIVE_INFINITY) return '-Infinity'
                return value
            // string:
            case ScalarType.STRING:
                if (value === '') return ed ? '' : undefined
                assert(typeof value == 'string')
                return value
            // bool:
            case ScalarType.BOOL:
                if (value === false) return ed ? false : undefined
                assert(typeof value == 'boolean')
                return value
            // JSON value will be a decimal string. Either numbers or strings are accepted.
            case ScalarType.UINT64:
            case ScalarType.FIXED64:
                assert(typeof value == 'number' || typeof value == 'string' || typeof value == 'bigint')
                let ulong = PbULong.from(value)
                if (ulong.isZero() && !ed) return undefined
                return ulong.toString()
            // JSON value will be a decimal string. Either numbers or strings are accepted.
            case ScalarType.INT64:
            case ScalarType.SFIXED64:
            case ScalarType.SINT64:
                assert(typeof value == 'number' || typeof value == 'string' || typeof value == 'bigint')
                let long = PbLong.from(value)
                if (long.isZero() && !ed) return undefined
                return long.toString()
            // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
            // Either standard or URL-safe base64 encoding with/without paddings are accepted.
            case ScalarType.BYTES:
                assert(value instanceof Uint8Array)
                if (!value.byteLength) return ed ? '' : undefined
                return base64encode(value)
        }
    }
}

/**
 * Creates the default value for a scalar type.
 */
function reflectionScalarDefault(type, longType = LongType.STRING) {
    switch (type) {
        case ScalarType.BOOL:
            return false
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
            return reflectionLongConvert(PbULong.ZERO, longType)
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
            return reflectionLongConvert(PbLong.ZERO, longType)
        case ScalarType.DOUBLE:
        case ScalarType.FLOAT:
            return 0.0
        case ScalarType.BYTES:
            return new Uint8Array(0)
        case ScalarType.STRING:
            return ''
        default:
            // case ScalarType.INT32:
            // case ScalarType.UINT32:
            // case ScalarType.SINT32:
            // case ScalarType.FIXED32:
            // case ScalarType.SFIXED32:
            return 0
    }
}

/**
 * Reads proto3 messages in binary format using reflection information.
 *
 * https://developers.google.com/protocol-buffers/docs/encoding
 */
class ReflectionBinaryReader {
    constructor(info) {
        this.info = info
    }
    prepare() {
        var _a
        if (!this.fieldNoToField) {
            const fieldsInput = (_a = this.info.fields) !== null && _a !== void 0 ? _a : []
            this.fieldNoToField = new Map(fieldsInput.map((field) => [field.no, field]))
        }
    }
    /**
     * Reads a message from binary format into the target message.
     *
     * Repeated fields are appended. Map entries are added, overwriting
     * existing keys.
     *
     * If a message field is already present, it will be merged with the
     * new data.
     */
    read(reader, message, options, length) {
        this.prepare()
        const end = length === undefined ? reader.len : reader.pos + length
        while (reader.pos < end) {
            // read the tag and find the field
            const [fieldNo, wireType] = reader.tag(),
                field = this.fieldNoToField.get(fieldNo)
            if (!field) {
                let u = options.readUnknownField
                if (u == 'throw') throw new Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.info.typeName}`)
                let d = reader.skip(wireType)
                if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.info.typeName, message, fieldNo, wireType, d)
                continue
            }
            // target object for the field we are reading
            let target = message,
                repeated = field.repeat,
                localName = field.localName
            // if field is member of oneof ADT, use ADT as target
            if (field.oneof) {
                target = target[field.oneof]
                // if other oneof member selected, set new ADT
                if (target.oneofKind !== localName)
                    target = message[field.oneof] = {
                        oneofKind: localName,
                    }
            }
            // we have handled oneof above, we just have read the value into `target[localName]`
            switch (field.kind) {
                case 'scalar':
                case 'enum':
                    let T = field.kind == 'enum' ? ScalarType.INT32 : field.T
                    let L = field.kind == 'scalar' ? field.L : undefined
                    if (repeated) {
                        let arr = target[localName] // safe to assume presence of array, oneof cannot contain repeated values
                        if (wireType == WireType.LengthDelimited && T != ScalarType.STRING && T != ScalarType.BYTES) {
                            let e = reader.uint32() + reader.pos
                            while (reader.pos < e) arr.push(this.scalar(reader, T, L))
                        } else arr.push(this.scalar(reader, T, L))
                    } else target[localName] = this.scalar(reader, T, L)
                    break
                case 'message':
                    if (repeated) {
                        let arr = target[localName] // safe to assume presence of array, oneof cannot contain repeated values
                        let msg = field.T().internalBinaryRead(reader, reader.uint32(), options)
                        arr.push(msg)
                    } else target[localName] = field.T().internalBinaryRead(reader, reader.uint32(), options, target[localName])
                    break
                case 'map':
                    let [mapKey, mapVal] = this.mapEntry(field, reader, options)
                    // safe to assume presence of map object, oneof cannot contain repeated values
                    target[localName][mapKey] = mapVal
                    break
            }
        }
    }
    /**
     * Read a map field, expecting key field = 1, value field = 2
     */
    mapEntry(field, reader, options) {
        let length = reader.uint32()
        let end = reader.pos + length
        let key = undefined // javascript only allows number or string for object properties
        let val = undefined
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag()
            switch (fieldNo) {
                case 1:
                    if (field.K == ScalarType.BOOL) key = reader.bool().toString()
                    // long types are read as string, number types are okay as number
                    else key = this.scalar(reader, field.K, LongType.STRING)
                    break
                case 2:
                    switch (field.V.kind) {
                        case 'scalar':
                            val = this.scalar(reader, field.V.T, field.V.L)
                            break
                        case 'enum':
                            val = reader.int32()
                            break
                        case 'message':
                            val = field.V.T().internalBinaryRead(reader, reader.uint32(), options)
                            break
                    }
                    break
                default:
                    throw new Error(`Unknown field ${fieldNo} (wire type ${wireType}) in map entry for ${this.info.typeName}#${field.name}`)
            }
        }
        if (key === undefined) {
            let keyRaw = reflectionScalarDefault(field.K)
            key = field.K == ScalarType.BOOL ? keyRaw.toString() : keyRaw
        }
        if (val === undefined)
            switch (field.V.kind) {
                case 'scalar':
                    val = reflectionScalarDefault(field.V.T, field.V.L)
                    break
                case 'enum':
                    val = 0
                    break
                case 'message':
                    val = field.V.T().create()
                    break
            }
        return [key, val]
    }
    scalar(reader, type, longType) {
        switch (type) {
            case ScalarType.INT32:
                return reader.int32()
            case ScalarType.STRING:
                return reader.string()
            case ScalarType.BOOL:
                return reader.bool()
            case ScalarType.DOUBLE:
                return reader.double()
            case ScalarType.FLOAT:
                return reader.float()
            case ScalarType.INT64:
                return reflectionLongConvert(reader.int64(), longType)
            case ScalarType.UINT64:
                return reflectionLongConvert(reader.uint64(), longType)
            case ScalarType.FIXED64:
                return reflectionLongConvert(reader.fixed64(), longType)
            case ScalarType.FIXED32:
                return reader.fixed32()
            case ScalarType.BYTES:
                return reader.bytes()
            case ScalarType.UINT32:
                return reader.uint32()
            case ScalarType.SFIXED32:
                return reader.sfixed32()
            case ScalarType.SFIXED64:
                return reflectionLongConvert(reader.sfixed64(), longType)
            case ScalarType.SINT32:
                return reader.sint32()
            case ScalarType.SINT64:
                return reflectionLongConvert(reader.sint64(), longType)
        }
    }
}

/**
 * Writes proto3 messages in binary format using reflection information.
 *
 * https://developers.google.com/protocol-buffers/docs/encoding
 */
class ReflectionBinaryWriter {
    constructor(info) {
        this.info = info
    }
    prepare() {
        if (!this.fields) {
            const fieldsInput = this.info.fields ? this.info.fields.concat() : []
            this.fields = fieldsInput.sort((a, b) => a.no - b.no)
        }
    }
    /**
     * Writes the message to binary format.
     */
    write(message, writer, options) {
        this.prepare()
        for (const field of this.fields) {
            let value, // this will be our field value, whether it is member of a oneof or not
                emitDefault, // whether we emit the default value (only true for oneof members)
                repeated = field.repeat,
                localName = field.localName
            // handle oneof ADT
            if (field.oneof) {
                const group = message[field.oneof]
                if (group.oneofKind !== localName) continue // if field is not selected, skip
                value = group[localName]
                emitDefault = true
            } else {
                value = message[localName]
                emitDefault = false
            }
            // we have handled oneof above. we just have to honor `emitDefault`.
            switch (field.kind) {
                case 'scalar':
                case 'enum':
                    let T = field.kind == 'enum' ? ScalarType.INT32 : field.T
                    if (repeated) {
                        assert(Array.isArray(value))
                        if (repeated == RepeatType.PACKED) this.packed(writer, T, field.no, value)
                        else for (const item of value) this.scalar(writer, T, field.no, item, true)
                    } else if (value === undefined) assert(field.opt)
                    else this.scalar(writer, T, field.no, value, emitDefault || field.opt)
                    break
                case 'message':
                    if (repeated) {
                        assert(Array.isArray(value))
                        for (const item of value) this.message(writer, options, field.T(), field.no, item)
                    } else {
                        this.message(writer, options, field.T(), field.no, value)
                    }
                    break
                case 'map':
                    assert(typeof value == 'object' && value !== null)
                    for (const [key, val] of Object.entries(value)) this.mapEntry(writer, options, field, key, val)
                    break
            }
        }
        let u = options.writeUnknownFields
        if (u !== false) (u === true ? UnknownFieldHandler.onWrite : u)(this.info.typeName, message, writer)
    }
    mapEntry(writer, options, field, key, value) {
        writer.tag(field.no, WireType.LengthDelimited)
        writer.fork()
        // javascript only allows number or string for object properties
        // we convert from our representation to the protobuf type
        let keyValue = key
        switch (field.K) {
            case ScalarType.INT32:
            case ScalarType.FIXED32:
            case ScalarType.UINT32:
            case ScalarType.SFIXED32:
            case ScalarType.SINT32:
                keyValue = Number.parseInt(key)
                break
            case ScalarType.BOOL:
                assert(key == 'true' || key == 'false')
                keyValue = key == 'true'
                break
        }
        // write key, expecting key field number = 1
        this.scalar(writer, field.K, 1, keyValue, true)
        // write value, expecting value field number = 2
        switch (field.V.kind) {
            case 'scalar':
                this.scalar(writer, field.V.T, 2, value, true)
                break
            case 'enum':
                this.scalar(writer, ScalarType.INT32, 2, value, true)
                break
            case 'message':
                this.message(writer, options, field.V.T(), 2, value)
                break
        }
        writer.join()
    }
    message(writer, options, handler, fieldNo, value) {
        if (value === undefined) return
        handler.internalBinaryWrite(value, writer.tag(fieldNo, WireType.LengthDelimited).fork(), options)
        writer.join()
    }
    /**
     * Write a single scalar value.
     */
    scalar(writer, type, fieldNo, value, emitDefault) {
        let [wireType, method, isDefault] = this.scalarInfo(type, value)
        if (!isDefault || emitDefault) {
            writer.tag(fieldNo, wireType)
            writer[method](value)
        }
    }
    /**
     * Write an array of scalar values in packed format.
     */
    packed(writer, type, fieldNo, value) {
        if (!value.length) return
        assert(type !== ScalarType.BYTES && type !== ScalarType.STRING)
        // write tag
        writer.tag(fieldNo, WireType.LengthDelimited)
        // begin length-delimited
        writer.fork()
        // write values without tags
        let [, method] = this.scalarInfo(type)
        for (let i = 0; i < value.length; i++) writer[method](value[i])
        // end length delimited
        writer.join()
    }
    /**
     * Get information for writing a scalar value.
     *
     * Returns tuple:
     * [0]: appropriate WireType
     * [1]: name of the appropriate method of IBinaryWriter
     * [2]: whether the given value is a default value
     *
     * If argument `value` is omitted, [2] is always false.
     */
    scalarInfo(type, value) {
        let t = WireType.Varint
        let m
        let i = value === undefined
        let d = value === 0
        switch (type) {
            case ScalarType.INT32:
                m = 'int32'
                break
            case ScalarType.STRING:
                d = i || !value.length
                t = WireType.LengthDelimited
                m = 'string'
                break
            case ScalarType.BOOL:
                d = value === false
                m = 'bool'
                break
            case ScalarType.UINT32:
                m = 'uint32'
                break
            case ScalarType.DOUBLE:
                t = WireType.Bit64
                m = 'double'
                break
            case ScalarType.FLOAT:
                t = WireType.Bit32
                m = 'float'
                break
            case ScalarType.INT64:
                d = i || PbLong.from(value).isZero()
                m = 'int64'
                break
            case ScalarType.UINT64:
                d = i || PbULong.from(value).isZero()
                m = 'uint64'
                break
            case ScalarType.FIXED64:
                d = i || PbULong.from(value).isZero()
                t = WireType.Bit64
                m = 'fixed64'
                break
            case ScalarType.BYTES:
                d = i || !value.byteLength
                t = WireType.LengthDelimited
                m = 'bytes'
                break
            case ScalarType.FIXED32:
                t = WireType.Bit32
                m = 'fixed32'
                break
            case ScalarType.SFIXED32:
                t = WireType.Bit32
                m = 'sfixed32'
                break
            case ScalarType.SFIXED64:
                d = i || PbLong.from(value).isZero()
                t = WireType.Bit64
                m = 'sfixed64'
                break
            case ScalarType.SINT32:
                m = 'sint32'
                break
            case ScalarType.SINT64:
                d = i || PbLong.from(value).isZero()
                m = 'sint64'
                break
        }
        return [t, m, i || d]
    }
}

/**
 * Creates an instance of the generic message, using the field
 * information.
 */
function reflectionCreate(type) {
    /**
     * This ternary can be removed in the next major version.
     * The `Object.create()` code path utilizes a new `messagePrototype`
     * property on the `IMessageType` which has this same `MESSAGE_TYPE`
     * non-enumerable property on it. Doing it this way means that we only
     * pay the cost of `Object.defineProperty()` once per `IMessageType`
     * class of once per "instance". The falsy code path is only provided
     * for backwards compatibility in cases where the runtime library is
     * updated without also updating the generated code.
     */
    const msg = type.messagePrototype ? Object.create(type.messagePrototype) : Object.defineProperty({}, MESSAGE_TYPE, { value: type })
    for (let field of type.fields) {
        let name = field.localName
        if (field.opt) continue
        if (field.oneof) msg[field.oneof] = { oneofKind: undefined }
        else if (field.repeat) msg[name] = []
        else
            switch (field.kind) {
                case 'scalar':
                    msg[name] = reflectionScalarDefault(field.T, field.L)
                    break
                case 'enum':
                    // we require 0 to be default value for all enums
                    msg[name] = 0
                    break
                case 'map':
                    msg[name] = {}
                    break
            }
    }
    return msg
}

/**
 * Copy partial data into the target message.
 *
 * If a singular scalar or enum field is present in the source, it
 * replaces the field in the target.
 *
 * If a singular message field is present in the source, it is merged
 * with the target field by calling mergePartial() of the responsible
 * message type.
 *
 * If a repeated field is present in the source, its values replace
 * all values in the target array, removing extraneous values.
 * Repeated message fields are copied, not merged.
 *
 * If a map field is present in the source, entries are added to the
 * target map, replacing entries with the same key. Entries that only
 * exist in the target remain. Entries with message values are copied,
 * not merged.
 *
 * Note that this function differs from protobuf merge semantics,
 * which appends repeated fields.
 */
function reflectionMergePartial(info, target, source) {
    let fieldValue, // the field value we are working with
        input = source,
        output // where we want our field value to go
    for (let field of info.fields) {
        let name = field.localName
        if (field.oneof) {
            const group = input[field.oneof] // this is the oneof`s group in the source
            if ((group === null || group === void 0 ? void 0 : group.oneofKind) == undefined) {
                // the user is free to omit
                continue // we skip this field, and all other members too
            }
            fieldValue = group[name] // our value comes from the the oneof group of the source
            output = target[field.oneof] // and our output is the oneof group of the target
            output.oneofKind = group.oneofKind // always update discriminator
            if (fieldValue == undefined) {
                delete output[name] // remove any existing value
                continue // skip further work on field
            }
        } else {
            fieldValue = input[name] // we are using the source directly
            output = target // we want our field value to go directly into the target
            if (fieldValue == undefined) {
                continue // skip further work on field, existing value is used as is
            }
        }
        if (field.repeat) output[name].length = fieldValue.length // resize target array to match source array
        // now we just work with `fieldValue` and `output` to merge the value
        switch (field.kind) {
            case 'scalar':
            case 'enum':
                if (field.repeat) for (let i = 0; i < fieldValue.length; i++) output[name][i] = fieldValue[i]
                // not a reference type
                else output[name] = fieldValue // not a reference type
                break
            case 'message':
                let T = field.T()
                if (field.repeat) for (let i = 0; i < fieldValue.length; i++) output[name][i] = T.create(fieldValue[i])
                else if (output[name] === undefined) output[name] = T.create(fieldValue) // nothing to merge with
                else T.mergePartial(output[name], fieldValue)
                break
            case 'map':
                // Map and repeated fields are simply overwritten, not appended or merged
                switch (field.V.kind) {
                    case 'scalar':
                    case 'enum':
                        Object.assign(output[name], fieldValue) // elements are not reference types
                        break
                    case 'message':
                        let T = field.V.T()
                        for (let k of Object.keys(fieldValue)) output[name][k] = T.create(fieldValue[k])
                        break
                }
                break
        }
    }
}

/**
 * Determines whether two message of the same type have the same field values.
 * Checks for deep equality, traversing repeated fields, oneof groups, maps
 * and messages recursively.
 * Will also return true if both messages are `undefined`.
 */
function reflectionEquals(info, a, b) {
    if (a === b) return true
    if (!a || !b) return false
    for (let field of info.fields) {
        let localName = field.localName
        let val_a = field.oneof ? a[field.oneof][localName] : a[localName]
        let val_b = field.oneof ? b[field.oneof][localName] : b[localName]
        switch (field.kind) {
            case 'enum':
            case 'scalar':
                let t = field.kind == 'enum' ? ScalarType.INT32 : field.T
                if (!(field.repeat ? repeatedPrimitiveEq(t, val_a, val_b) : primitiveEq(t, val_a, val_b))) return false
                break
            case 'map':
                if (
                    !(field.V.kind == 'message'
                        ? repeatedMsgEq(field.V.T(), objectValues(val_a), objectValues(val_b))
                        : repeatedPrimitiveEq(field.V.kind == 'enum' ? ScalarType.INT32 : field.V.T, objectValues(val_a), objectValues(val_b)))
                )
                    return false
                break
            case 'message':
                let T = field.T()
                if (!(field.repeat ? repeatedMsgEq(T, val_a, val_b) : T.equals(val_a, val_b))) return false
                break
        }
    }
    return true
}
const objectValues = Object.values
function primitiveEq(type, a, b) {
    if (a === b) return true
    if (type !== ScalarType.BYTES) return false
    let ba = a
    let bb = b
    if (ba.length !== bb.length) return false
    for (let i = 0; i < ba.length; i++) if (ba[i] != bb[i]) return false
    return true
}
function repeatedPrimitiveEq(type, a, b) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (!primitiveEq(type, a[i], b[i])) return false
    return true
}
function repeatedMsgEq(type, a, b) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (!type.equals(a[i], b[i])) return false
    return true
}

const baseDescriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({}))
/**
 * This standard message type provides reflection-based
 * operations to work with a message.
 */
class MessageType {
    constructor(name, fields, options) {
        this.defaultCheckDepth = 16
        this.typeName = name
        this.fields = fields.map(normalizeFieldInfo)
        this.options = options !== null && options !== void 0 ? options : {}
        this.messagePrototype = Object.create(null, Object.assign(Object.assign({}, baseDescriptors), { [MESSAGE_TYPE]: { value: this } }))
        this.refTypeCheck = new ReflectionTypeCheck(this)
        this.refJsonReader = new ReflectionJsonReader(this)
        this.refJsonWriter = new ReflectionJsonWriter(this)
        this.refBinReader = new ReflectionBinaryReader(this)
        this.refBinWriter = new ReflectionBinaryWriter(this)
    }
    create(value) {
        let message = reflectionCreate(this)
        if (value !== undefined) {
            reflectionMergePartial(this, message, value)
        }
        return message
    }
    /**
     * Clone the message.
     *
     * Unknown fields are discarded.
     */
    clone(message) {
        let copy = this.create()
        reflectionMergePartial(this, copy, message)
        return copy
    }
    /**
     * Determines whether two message of the same type have the same field values.
     * Checks for deep equality, traversing repeated fields, oneof groups, maps
     * and messages recursively.
     * Will also return true if both messages are `undefined`.
     */
    equals(a, b) {
        return reflectionEquals(this, a, b)
    }
    /**
     * Is the given value assignable to our message type
     * and contains no [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks)?
     */
    is(arg, depth = this.defaultCheckDepth) {
        return this.refTypeCheck.is(arg, depth, false)
    }
    /**
     * Is the given value assignable to our message type,
     * regardless of [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks)?
     */
    isAssignable(arg, depth = this.defaultCheckDepth) {
        return this.refTypeCheck.is(arg, depth, true)
    }
    /**
     * Copy partial data into the target message.
     */
    mergePartial(target, source) {
        reflectionMergePartial(this, target, source)
    }
    /**
     * Create a new message from binary format.
     */
    fromBinary(data, options) {
        let opt = binaryReadOptions(options)
        return this.internalBinaryRead(opt.readerFactory(data), data.byteLength, opt)
    }
    /**
     * Read a new message from a JSON value.
     */
    fromJson(json, options) {
        return this.internalJsonRead(json, jsonReadOptions(options))
    }
    /**
     * Read a new message from a JSON string.
     * This is equivalent to `T.fromJson(JSON.parse(json))`.
     */
    fromJsonString(json, options) {
        let value = JSON.parse(json)
        return this.fromJson(value, options)
    }
    /**
     * Write the message to canonical JSON value.
     */
    toJson(message, options) {
        return this.internalJsonWrite(message, jsonWriteOptions(options))
    }
    /**
     * Convert the message to canonical JSON string.
     * This is equivalent to `JSON.stringify(T.toJson(t))`
     */
    toJsonString(message, options) {
        var _a
        let value = this.toJson(message, options)
        return JSON.stringify(value, null, (_a = options === null || options === void 0 ? void 0 : options.prettySpaces) !== null && _a !== void 0 ? _a : 0)
    }
    /**
     * Write the message to binary format.
     */
    toBinary(message, options) {
        let opt = binaryWriteOptions(options)
        return this.internalBinaryWrite(message, opt.writerFactory(), opt).finish()
    }
    /**
     * This is an internal method. If you just want to read a message from
     * JSON, use `fromJson()` or `fromJsonString()`.
     *
     * Reads JSON value and merges the fields into the target
     * according to protobuf rules. If the target is omitted,
     * a new instance is created first.
     */
    internalJsonRead(json, options, target) {
        if (json !== null && typeof json == 'object' && !Array.isArray(json)) {
            let message = target !== null && target !== void 0 ? target : this.create()
            this.refJsonReader.read(json, message, options)
            return message
        }
        throw new Error(`Unable to parse message ${this.typeName} from JSON ${typeofJsonValue(json)}.`)
    }
    /**
     * This is an internal method. If you just want to write a message
     * to JSON, use `toJson()` or `toJsonString().
     *
     * Writes JSON value and returns it.
     */
    internalJsonWrite(message, options) {
        return this.refJsonWriter.write(message, options)
    }
    /**
     * This is an internal method. If you just want to write a message
     * in binary format, use `toBinary()`.
     *
     * Serializes the message in binary format and appends it to the given
     * writer. Returns passed writer.
     */
    internalBinaryWrite(message, writer, options) {
        this.refBinWriter.write(message, writer, options)
        return writer
    }
    /**
     * This is an internal method. If you just want to read a message from
     * binary data, use `fromBinary()`.
     *
     * Reads data from binary format and merges the fields into
     * the target according to protobuf rules. If the target is
     * omitted, a new instance is created first.
     */
    internalBinaryRead(reader, length, options, target) {
        let message = target !== null && target !== void 0 ? target : this.create()
        this.refBinReader.read(reader, message, options, length)
        return message
    }
}

class RelateCard$Type extends MessageType {
    constructor() {
        super('bilibili.app.viewunite.common.RelateCard', [
            { no: 1, name: 'relate_card_type', kind: 'enum', T: () => ['bilibili.app.viewunite.common.RelateCardType', RelateCardType] },
        ])
    }
    create(value) {
        const message = {
            relateCardType: 0,
            card: { oneofKind: undefined },
        }
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this })
        if (value !== undefined) reflectionMergePartial < RelateCard > (this, message, value)
        return message
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(),
            end = reader.pos + length
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag()
            switch (fieldNo) {
                case 1:
                    message.relateCardType = reader.int32()
                    break
                default:
                    let u = options.readUnknownField
                    if (u === 'throw') throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`)
                    let d = reader.skip(wireType)
                    if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d)
            }
        }
        return message
    }
    internalBinaryWrite(message, writer, options) {
        if (message.relateCardType !== 0) writer.tag(1, WireType.Varint).int32(message.relateCardType)
        let u = options.writeUnknownFields
        if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer)
        return writer
    }
}
const RelateCard = new RelateCard$Type()

class RelatesFeedReply$Type extends MessageType {
    constructor() {
        super('bilibili.app.viewunite.v1.RelatesFeedReply', [{ no: 1, name: 'relates', kind: 'message', repeat: 1, T: () => RelateCard }])
    }
    create(value) {
        const message = { relates: [] }
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this })
        if (value !== undefined) reflectionMergePartial(this, message, value)
        return message
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(),
            end = reader.pos + length
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag()
            switch (fieldNo) {
                case 1:
                    message.relates.push(RelateCard.internalBinaryRead(reader, reader.uint32(), options))
                    break
                default:
                    let u = options.readUnknownField
                    if (u === 'throw') throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`)
                    let d = reader.skip(wireType)
                    if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d)
            }
        }
        return message
    }
    internalBinaryWrite(message, writer, options) {
        for (let i = 0; i < message.relates.length; i++)
            RelateCard.internalBinaryWrite(message.relates[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join()
        let u = options.writeUnknownFields
        if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer)
        return writer
    }
}
const RelatesFeedReply = new RelatesFeedReply$Type()

/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
// prettier-ignore
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).pako={})}(this,(function(t){"use strict";function e(t){let e=t.length;for(;--e>=0;)t[e]=0}const a=256,i=286,n=30,s=15,r=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),o=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),l=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),h=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),d=new Array(576);e(d);const _=new Array(60);e(_);const f=new Array(512);e(f);const c=new Array(256);e(c);const u=new Array(29);e(u);const w=new Array(n);function m(t,e,a,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=i,this.max_length=n,this.has_stree=t&&t.length}let b,g,p;function k(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}e(w);const v=t=>t<256?f[t]:f[256+(t>>>7)],y=(t,e)=>{t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255},x=(t,e,a)=>{t.bi_valid>16-a?(t.bi_buf|=e<<t.bi_valid&65535,y(t,t.bi_buf),t.bi_buf=e>>16-t.bi_valid,t.bi_valid+=a-16):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)},z=(t,e,a)=>{x(t,a[2*e],a[2*e+1])},A=(t,e)=>{let a=0;do{a|=1&t,t>>>=1,a<<=1}while(--e>0);return a>>>1},E=(t,e,a)=>{const i=new Array(16);let n,r,o=0;for(n=1;n<=s;n++)o=o+a[n-1]<<1,i[n]=o;for(r=0;r<=e;r++){let e=t[2*r+1];0!==e&&(t[2*r]=A(i[e]++,e))}},R=t=>{let e;for(e=0;e<i;e++)t.dyn_ltree[2*e]=0;for(e=0;e<n;e++)t.dyn_dtree[2*e]=0;for(e=0;e<19;e++)t.bl_tree[2*e]=0;t.dyn_ltree[512]=1,t.opt_len=t.static_len=0,t.sym_next=t.matches=0},Z=t=>{t.bi_valid>8?y(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0},U=(t,e,a,i)=>{const n=2*e,s=2*a;return t[n]<t[s]||t[n]===t[s]&&i[e]<=i[a]},S=(t,e,a)=>{const i=t.heap[a];let n=a<<1;for(;n<=t.heap_len&&(n<t.heap_len&&U(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!U(e,i,t.heap[n],t.depth));)t.heap[a]=t.heap[n],a=n,n<<=1;t.heap[a]=i},D=(t,e,i)=>{let n,s,l,h,d=0;if(0!==t.sym_next)do{n=255&t.pending_buf[t.sym_buf+d++],n+=(255&t.pending_buf[t.sym_buf+d++])<<8,s=t.pending_buf[t.sym_buf+d++],0===n?z(t,s,e):(l=c[s],z(t,l+a+1,e),h=r[l],0!==h&&(s-=u[l],x(t,s,h)),n--,l=v(n),z(t,l,i),h=o[l],0!==h&&(n-=w[l],x(t,n,h)))}while(d<t.sym_next);z(t,256,e)},T=(t,e)=>{const a=e.dyn_tree,i=e.stat_desc.static_tree,n=e.stat_desc.has_stree,r=e.stat_desc.elems;let o,l,h,d=-1;for(t.heap_len=0,t.heap_max=573,o=0;o<r;o++)0!==a[2*o]?(t.heap[++t.heap_len]=d=o,t.depth[o]=0):a[2*o+1]=0;for(;t.heap_len<2;)h=t.heap[++t.heap_len]=d<2?++d:0,a[2*h]=1,t.depth[h]=0,t.opt_len--,n&&(t.static_len-=i[2*h+1]);for(e.max_code=d,o=t.heap_len>>1;o>=1;o--)S(t,a,o);h=r;do{o=t.heap[1],t.heap[1]=t.heap[t.heap_len--],S(t,a,1),l=t.heap[1],t.heap[--t.heap_max]=o,t.heap[--t.heap_max]=l,a[2*h]=a[2*o]+a[2*l],t.depth[h]=(t.depth[o]>=t.depth[l]?t.depth[o]:t.depth[l])+1,a[2*o+1]=a[2*l+1]=h,t.heap[1]=h++,S(t,a,1)}while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],((t,e)=>{const a=e.dyn_tree,i=e.max_code,n=e.stat_desc.static_tree,r=e.stat_desc.has_stree,o=e.stat_desc.extra_bits,l=e.stat_desc.extra_base,h=e.stat_desc.max_length;let d,_,f,c,u,w,m=0;for(c=0;c<=s;c++)t.bl_count[c]=0;for(a[2*t.heap[t.heap_max]+1]=0,d=t.heap_max+1;d<573;d++)_=t.heap[d],c=a[2*a[2*_+1]+1]+1,c>h&&(c=h,m++),a[2*_+1]=c,_>i||(t.bl_count[c]++,u=0,_>=l&&(u=o[_-l]),w=a[2*_],t.opt_len+=w*(c+u),r&&(t.static_len+=w*(n[2*_+1]+u)));if(0!==m){do{for(c=h-1;0===t.bl_count[c];)c--;t.bl_count[c]--,t.bl_count[c+1]+=2,t.bl_count[h]--,m-=2}while(m>0);for(c=h;0!==c;c--)for(_=t.bl_count[c];0!==_;)f=t.heap[--d],f>i||(a[2*f+1]!==c&&(t.opt_len+=(c-a[2*f+1])*a[2*f],a[2*f+1]=c),_--)}})(t,e),E(a,d,t.bl_count)},O=(t,e,a)=>{let i,n,s=-1,r=e[1],o=0,l=7,h=4;for(0===r&&(l=138,h=3),e[2*(a+1)+1]=65535,i=0;i<=a;i++)n=r,r=e[2*(i+1)+1],++o<l&&n===r||(o<h?t.bl_tree[2*n]+=o:0!==n?(n!==s&&t.bl_tree[2*n]++,t.bl_tree[32]++):o<=10?t.bl_tree[34]++:t.bl_tree[36]++,o=0,s=n,0===r?(l=138,h=3):n===r?(l=6,h=3):(l=7,h=4))},I=(t,e,a)=>{let i,n,s=-1,r=e[1],o=0,l=7,h=4;for(0===r&&(l=138,h=3),i=0;i<=a;i++)if(n=r,r=e[2*(i+1)+1],!(++o<l&&n===r)){if(o<h)do{z(t,n,t.bl_tree)}while(0!=--o);else 0!==n?(n!==s&&(z(t,n,t.bl_tree),o--),z(t,16,t.bl_tree),x(t,o-3,2)):o<=10?(z(t,17,t.bl_tree),x(t,o-3,3)):(z(t,18,t.bl_tree),x(t,o-11,7));o=0,s=n,0===r?(l=138,h=3):n===r?(l=6,h=3):(l=7,h=4)}};let F=!1;const L=(t,e,a,i)=>{x(t,0+(i?1:0),3),Z(t),y(t,a),y(t,~a),a&&t.pending_buf.set(t.window.subarray(e,e+a),t.pending),t.pending+=a};var N=(t,e,i,n)=>{let s,r,o=0;t.level>0?(2===t.strm.data_type&&(t.strm.data_type=(t=>{let e,i=4093624447;for(e=0;e<=31;e++,i>>>=1)if(1&i&&0!==t.dyn_ltree[2*e])return 0;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return 1;for(e=32;e<a;e++)if(0!==t.dyn_ltree[2*e])return 1;return 0})(t)),T(t,t.l_desc),T(t,t.d_desc),o=(t=>{let e;for(O(t,t.dyn_ltree,t.l_desc.max_code),O(t,t.dyn_dtree,t.d_desc.max_code),T(t,t.bl_desc),e=18;e>=3&&0===t.bl_tree[2*h[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e})(t),s=t.opt_len+3+7>>>3,r=t.static_len+3+7>>>3,r<=s&&(s=r)):s=r=i+5,i+4<=s&&-1!==e?L(t,e,i,n):4===t.strategy||r===s?(x(t,2+(n?1:0),3),D(t,d,_)):(x(t,4+(n?1:0),3),((t,e,a,i)=>{let n;for(x(t,e-257,5),x(t,a-1,5),x(t,i-4,4),n=0;n<i;n++)x(t,t.bl_tree[2*h[n]+1],3);I(t,t.dyn_ltree,e-1),I(t,t.dyn_dtree,a-1)})(t,t.l_desc.max_code+1,t.d_desc.max_code+1,o+1),D(t,t.dyn_ltree,t.dyn_dtree)),R(t),n&&Z(t)},B={_tr_init:t=>{F||((()=>{let t,e,a,h,k;const v=new Array(16);for(a=0,h=0;h<28;h++)for(u[h]=a,t=0;t<1<<r[h];t++)c[a++]=h;for(c[a-1]=h,k=0,h=0;h<16;h++)for(w[h]=k,t=0;t<1<<o[h];t++)f[k++]=h;for(k>>=7;h<n;h++)for(w[h]=k<<7,t=0;t<1<<o[h]-7;t++)f[256+k++]=h;for(e=0;e<=s;e++)v[e]=0;for(t=0;t<=143;)d[2*t+1]=8,t++,v[8]++;for(;t<=255;)d[2*t+1]=9,t++,v[9]++;for(;t<=279;)d[2*t+1]=7,t++,v[7]++;for(;t<=287;)d[2*t+1]=8,t++,v[8]++;for(E(d,287,v),t=0;t<n;t++)_[2*t+1]=5,_[2*t]=A(t,5);b=new m(d,r,257,i,s),g=new m(_,o,0,n,s),p=new m(new Array(0),l,0,19,7)})(),F=!0),t.l_desc=new k(t.dyn_ltree,b),t.d_desc=new k(t.dyn_dtree,g),t.bl_desc=new k(t.bl_tree,p),t.bi_buf=0,t.bi_valid=0,R(t)},_tr_stored_block:L,_tr_flush_block:N,_tr_tally:(t,e,i)=>(t.pending_buf[t.sym_buf+t.sym_next++]=e,t.pending_buf[t.sym_buf+t.sym_next++]=e>>8,t.pending_buf[t.sym_buf+t.sym_next++]=i,0===e?t.dyn_ltree[2*i]++:(t.matches++,e--,t.dyn_ltree[2*(c[i]+a+1)]++,t.dyn_dtree[2*v(e)]++),t.sym_next===t.sym_end),_tr_align:t=>{x(t,2,3),z(t,256,d),(t=>{16===t.bi_valid?(y(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)})(t)}};var C=(t,e,a,i)=>{let n=65535&t|0,s=t>>>16&65535|0,r=0;for(;0!==a;){r=a>2e3?2e3:a,a-=r;do{n=n+e[i++]|0,s=s+n|0}while(--r);n%=65521,s%=65521}return n|s<<16|0};const M=new Uint32Array((()=>{let t,e=[];for(var a=0;a<256;a++){t=a;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e})());var H=(t,e,a,i)=>{const n=M,s=i+a;t^=-1;for(let a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t},j={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"},K={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};const{_tr_init:P,_tr_stored_block:Y,_tr_flush_block:G,_tr_tally:X,_tr_align:W}=B,{Z_NO_FLUSH:q,Z_PARTIAL_FLUSH:J,Z_FULL_FLUSH:Q,Z_FINISH:V,Z_BLOCK:$,Z_OK:tt,Z_STREAM_END:et,Z_STREAM_ERROR:at,Z_DATA_ERROR:it,Z_BUF_ERROR:nt,Z_DEFAULT_COMPRESSION:st,Z_FILTERED:rt,Z_HUFFMAN_ONLY:ot,Z_RLE:lt,Z_FIXED:ht,Z_DEFAULT_STRATEGY:dt,Z_UNKNOWN:_t,Z_DEFLATED:ft}=K,ct=258,ut=262,wt=42,mt=113,bt=666,gt=(t,e)=>(t.msg=j[e],e),pt=t=>2*t-(t>4?9:0),kt=t=>{let e=t.length;for(;--e>=0;)t[e]=0},vt=t=>{let e,a,i,n=t.w_size;e=t.hash_size,i=e;do{a=t.head[--i],t.head[i]=a>=n?a-n:0}while(--e);e=n,i=e;do{a=t.prev[--i],t.prev[i]=a>=n?a-n:0}while(--e)};let yt=(t,e,a)=>(e<<t.hash_shift^a)&t.hash_mask;const xt=t=>{const e=t.state;let a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(t.output.set(e.pending_buf.subarray(e.pending_out,e.pending_out+a),t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))},zt=(t,e)=>{G(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,xt(t.strm)},At=(t,e)=>{t.pending_buf[t.pending++]=e},Et=(t,e)=>{t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e},Rt=(t,e,a,i)=>{let n=t.avail_in;return n>i&&(n=i),0===n?0:(t.avail_in-=n,e.set(t.input.subarray(t.next_in,t.next_in+n),a),1===t.state.wrap?t.adler=C(t.adler,e,n,a):2===t.state.wrap&&(t.adler=H(t.adler,e,n,a)),t.next_in+=n,t.total_in+=n,n)},Zt=(t,e)=>{let a,i,n=t.max_chain_length,s=t.strstart,r=t.prev_length,o=t.nice_match;const l=t.strstart>t.w_size-ut?t.strstart-(t.w_size-ut):0,h=t.window,d=t.w_mask,_=t.prev,f=t.strstart+ct;let c=h[s+r-1],u=h[s+r];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do{if(a=e,h[a+r]===u&&h[a+r-1]===c&&h[a]===h[s]&&h[++a]===h[s+1]){s+=2,a++;do{}while(h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&s<f);if(i=ct-(f-s),s=f-ct,i>r){if(t.match_start=e,r=i,i>=o)break;c=h[s+r-1],u=h[s+r]}}}while((e=_[e&d])>l&&0!=--n);return r<=t.lookahead?r:t.lookahead},Ut=t=>{const e=t.w_size;let a,i,n;do{if(i=t.window_size-t.lookahead-t.strstart,t.strstart>=e+(e-ut)&&(t.window.set(t.window.subarray(e,e+e-i),0),t.match_start-=e,t.strstart-=e,t.block_start-=e,t.insert>t.strstart&&(t.insert=t.strstart),vt(t),i+=e),0===t.strm.avail_in)break;if(a=Rt(t.strm,t.window,t.strstart+t.lookahead,i),t.lookahead+=a,t.lookahead+t.insert>=3)for(n=t.strstart-t.insert,t.ins_h=t.window[n],t.ins_h=yt(t,t.ins_h,t.window[n+1]);t.insert&&(t.ins_h=yt(t,t.ins_h,t.window[n+3-1]),t.prev[n&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=n,n++,t.insert--,!(t.lookahead+t.insert<3)););}while(t.lookahead<ut&&0!==t.strm.avail_in)},St=(t,e)=>{let a,i,n,s=t.pending_buf_size-5>t.w_size?t.w_size:t.pending_buf_size-5,r=0,o=t.strm.avail_in;do{if(a=65535,n=t.bi_valid+42>>3,t.strm.avail_out<n)break;if(n=t.strm.avail_out-n,i=t.strstart-t.block_start,a>i+t.strm.avail_in&&(a=i+t.strm.avail_in),a>n&&(a=n),a<s&&(0===a&&e!==V||e===q||a!==i+t.strm.avail_in))break;r=e===V&&a===i+t.strm.avail_in?1:0,Y(t,0,0,r),t.pending_buf[t.pending-4]=a,t.pending_buf[t.pending-3]=a>>8,t.pending_buf[t.pending-2]=~a,t.pending_buf[t.pending-1]=~a>>8,xt(t.strm),i&&(i>a&&(i=a),t.strm.output.set(t.window.subarray(t.block_start,t.block_start+i),t.strm.next_out),t.strm.next_out+=i,t.strm.avail_out-=i,t.strm.total_out+=i,t.block_start+=i,a-=i),a&&(Rt(t.strm,t.strm.output,t.strm.next_out,a),t.strm.next_out+=a,t.strm.avail_out-=a,t.strm.total_out+=a)}while(0===r);return o-=t.strm.avail_in,o&&(o>=t.w_size?(t.matches=2,t.window.set(t.strm.input.subarray(t.strm.next_in-t.w_size,t.strm.next_in),0),t.strstart=t.w_size,t.insert=t.strstart):(t.window_size-t.strstart<=o&&(t.strstart-=t.w_size,t.window.set(t.window.subarray(t.w_size,t.w_size+t.strstart),0),t.matches<2&&t.matches++,t.insert>t.strstart&&(t.insert=t.strstart)),t.window.set(t.strm.input.subarray(t.strm.next_in-o,t.strm.next_in),t.strstart),t.strstart+=o,t.insert+=o>t.w_size-t.insert?t.w_size-t.insert:o),t.block_start=t.strstart),t.high_water<t.strstart&&(t.high_water=t.strstart),r?4:e!==q&&e!==V&&0===t.strm.avail_in&&t.strstart===t.block_start?2:(n=t.window_size-t.strstart,t.strm.avail_in>n&&t.block_start>=t.w_size&&(t.block_start-=t.w_size,t.strstart-=t.w_size,t.window.set(t.window.subarray(t.w_size,t.w_size+t.strstart),0),t.matches<2&&t.matches++,n+=t.w_size,t.insert>t.strstart&&(t.insert=t.strstart)),n>t.strm.avail_in&&(n=t.strm.avail_in),n&&(Rt(t.strm,t.window,t.strstart,n),t.strstart+=n,t.insert+=n>t.w_size-t.insert?t.w_size-t.insert:n),t.high_water<t.strstart&&(t.high_water=t.strstart),n=t.bi_valid+42>>3,n=t.pending_buf_size-n>65535?65535:t.pending_buf_size-n,s=n>t.w_size?t.w_size:n,i=t.strstart-t.block_start,(i>=s||(i||e===V)&&e!==q&&0===t.strm.avail_in&&i<=n)&&(a=i>n?n:i,r=e===V&&0===t.strm.avail_in&&a===i?1:0,Y(t,t.block_start,a,r),t.block_start+=a,xt(t.strm)),r?3:1)},Dt=(t,e)=>{let a,i;for(;;){if(t.lookahead<ut){if(Ut(t),t.lookahead<ut&&e===q)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-ut&&(t.match_length=Zt(t,a)),t.match_length>=3)if(i=X(t,t.strstart-t.match_start,t.match_length-3),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=3){t.match_length--;do{t.strstart++,t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart}while(0!=--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=yt(t,t.ins_h,t.window[t.strstart+1]);else i=X(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=t.strstart<2?t.strstart:2,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2},Tt=(t,e)=>{let a,i,n;for(;;){if(t.lookahead<ut){if(Ut(t),t.lookahead<ut&&e===q)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=2,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-ut&&(t.match_length=Zt(t,a),t.match_length<=5&&(t.strategy===rt||3===t.match_length&&t.strstart-t.match_start>4096)&&(t.match_length=2)),t.prev_length>=3&&t.match_length<=t.prev_length){n=t.strstart+t.lookahead-3,i=X(t,t.strstart-1-t.prev_match,t.prev_length-3),t.lookahead-=t.prev_length-1,t.prev_length-=2;do{++t.strstart<=n&&(t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart)}while(0!=--t.prev_length);if(t.match_available=0,t.match_length=2,t.strstart++,i&&(zt(t,!1),0===t.strm.avail_out))return 1}else if(t.match_available){if(i=X(t,0,t.window[t.strstart-1]),i&&zt(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return 1}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=X(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<2?t.strstart:2,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2};function Ot(t,e,a,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=i,this.func=n}const It=[new Ot(0,0,0,0,St),new Ot(4,4,8,4,Dt),new Ot(4,5,16,8,Dt),new Ot(4,6,32,32,Dt),new Ot(4,4,16,16,Tt),new Ot(8,16,32,32,Tt),new Ot(8,16,128,128,Tt),new Ot(8,32,128,256,Tt),new Ot(32,128,258,1024,Tt),new Ot(32,258,258,4096,Tt)];function Ft(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=ft,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(1146),this.dyn_dtree=new Uint16Array(122),this.bl_tree=new Uint16Array(78),kt(this.dyn_ltree),kt(this.dyn_dtree),kt(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(16),this.heap=new Uint16Array(573),kt(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(573),kt(this.depth),this.sym_buf=0,this.lit_bufsize=0,this.sym_next=0,this.sym_end=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}const Lt=t=>{if(!t)return 1;const e=t.state;return!e||e.strm!==t||e.status!==wt&&57!==e.status&&69!==e.status&&73!==e.status&&91!==e.status&&103!==e.status&&e.status!==mt&&e.status!==bt?1:0},Nt=t=>{if(Lt(t))return gt(t,at);t.total_in=t.total_out=0,t.data_type=_t;const e=t.state;return e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=2===e.wrap?57:e.wrap?wt:mt,t.adler=2===e.wrap?0:1,e.last_flush=-2,P(e),tt},Bt=t=>{const e=Nt(t);var a;return e===tt&&((a=t.state).window_size=2*a.w_size,kt(a.head),a.max_lazy_match=It[a.level].max_lazy,a.good_match=It[a.level].good_length,a.nice_match=It[a.level].nice_length,a.max_chain_length=It[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=2,a.match_available=0,a.ins_h=0),e},Ct=(t,e,a,i,n,s)=>{if(!t)return at;let r=1;if(e===st&&(e=6),i<0?(r=0,i=-i):i>15&&(r=2,i-=16),n<1||n>9||a!==ft||i<8||i>15||e<0||e>9||s<0||s>ht||8===i&&1!==r)return gt(t,at);8===i&&(i=9);const o=new Ft;return t.state=o,o.strm=t,o.status=wt,o.wrap=r,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=n+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+3-1)/3),o.window=new Uint8Array(2*o.w_size),o.head=new Uint16Array(o.hash_size),o.prev=new Uint16Array(o.w_size),o.lit_bufsize=1<<n+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new Uint8Array(o.pending_buf_size),o.sym_buf=o.lit_bufsize,o.sym_end=3*(o.lit_bufsize-1),o.level=e,o.strategy=s,o.method=a,Bt(t)};var Mt={deflateInit:(t,e)=>Ct(t,e,ft,15,8,dt),deflateInit2:Ct,deflateReset:Bt,deflateResetKeep:Nt,deflateSetHeader:(t,e)=>Lt(t)||2!==t.state.wrap?at:(t.state.gzhead=e,tt),deflate:(t,e)=>{if(Lt(t)||e>$||e<0)return t?gt(t,at):at;const a=t.state;if(!t.output||0!==t.avail_in&&!t.input||a.status===bt&&e!==V)return gt(t,0===t.avail_out?nt:at);const i=a.last_flush;if(a.last_flush=e,0!==a.pending){if(xt(t),0===t.avail_out)return a.last_flush=-1,tt}else if(0===t.avail_in&&pt(e)<=pt(i)&&e!==V)return gt(t,nt);if(a.status===bt&&0!==t.avail_in)return gt(t,nt);if(a.status===wt&&0===a.wrap&&(a.status=mt),a.status===wt){let e=ft+(a.w_bits-8<<4)<<8,i=-1;if(i=a.strategy>=ot||a.level<2?0:a.level<6?1:6===a.level?2:3,e|=i<<6,0!==a.strstart&&(e|=32),e+=31-e%31,Et(a,e),0!==a.strstart&&(Et(a,t.adler>>>16),Et(a,65535&t.adler)),t.adler=1,a.status=mt,xt(t),0!==a.pending)return a.last_flush=-1,tt}if(57===a.status)if(t.adler=0,At(a,31),At(a,139),At(a,8),a.gzhead)At(a,(a.gzhead.text?1:0)+(a.gzhead.hcrc?2:0)+(a.gzhead.extra?4:0)+(a.gzhead.name?8:0)+(a.gzhead.comment?16:0)),At(a,255&a.gzhead.time),At(a,a.gzhead.time>>8&255),At(a,a.gzhead.time>>16&255),At(a,a.gzhead.time>>24&255),At(a,9===a.level?2:a.strategy>=ot||a.level<2?4:0),At(a,255&a.gzhead.os),a.gzhead.extra&&a.gzhead.extra.length&&(At(a,255&a.gzhead.extra.length),At(a,a.gzhead.extra.length>>8&255)),a.gzhead.hcrc&&(t.adler=H(t.adler,a.pending_buf,a.pending,0)),a.gzindex=0,a.status=69;else if(At(a,0),At(a,0),At(a,0),At(a,0),At(a,0),At(a,9===a.level?2:a.strategy>=ot||a.level<2?4:0),At(a,3),a.status=mt,xt(t),0!==a.pending)return a.last_flush=-1,tt;if(69===a.status){if(a.gzhead.extra){let e=a.pending,i=(65535&a.gzhead.extra.length)-a.gzindex;for(;a.pending+i>a.pending_buf_size;){let n=a.pending_buf_size-a.pending;if(a.pending_buf.set(a.gzhead.extra.subarray(a.gzindex,a.gzindex+n),a.pending),a.pending=a.pending_buf_size,a.gzhead.hcrc&&a.pending>e&&(t.adler=H(t.adler,a.pending_buf,a.pending-e,e)),a.gzindex+=n,xt(t),0!==a.pending)return a.last_flush=-1,tt;e=0,i-=n}let n=new Uint8Array(a.gzhead.extra);a.pending_buf.set(n.subarray(a.gzindex,a.gzindex+i),a.pending),a.pending+=i,a.gzhead.hcrc&&a.pending>e&&(t.adler=H(t.adler,a.pending_buf,a.pending-e,e)),a.gzindex=0}a.status=73}if(73===a.status){if(a.gzhead.name){let e,i=a.pending;do{if(a.pending===a.pending_buf_size){if(a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i)),xt(t),0!==a.pending)return a.last_flush=-1,tt;i=0}e=a.gzindex<a.gzhead.name.length?255&a.gzhead.name.charCodeAt(a.gzindex++):0,At(a,e)}while(0!==e);a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i)),a.gzindex=0}a.status=91}if(91===a.status){if(a.gzhead.comment){let e,i=a.pending;do{if(a.pending===a.pending_buf_size){if(a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i)),xt(t),0!==a.pending)return a.last_flush=-1,tt;i=0}e=a.gzindex<a.gzhead.comment.length?255&a.gzhead.comment.charCodeAt(a.gzindex++):0,At(a,e)}while(0!==e);a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i))}a.status=103}if(103===a.status){if(a.gzhead.hcrc){if(a.pending+2>a.pending_buf_size&&(xt(t),0!==a.pending))return a.last_flush=-1,tt;At(a,255&t.adler),At(a,t.adler>>8&255),t.adler=0}if(a.status=mt,xt(t),0!==a.pending)return a.last_flush=-1,tt}if(0!==t.avail_in||0!==a.lookahead||e!==q&&a.status!==bt){let i=0===a.level?St(a,e):a.strategy===ot?((t,e)=>{let a;for(;;){if(0===t.lookahead&&(Ut(t),0===t.lookahead)){if(e===q)return 1;break}if(t.match_length=0,a=X(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2})(a,e):a.strategy===lt?((t,e)=>{let a,i,n,s;const r=t.window;for(;;){if(t.lookahead<=ct){if(Ut(t),t.lookahead<=ct&&e===q)return 1;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=3&&t.strstart>0&&(n=t.strstart-1,i=r[n],i===r[++n]&&i===r[++n]&&i===r[++n])){s=t.strstart+ct;do{}while(i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&n<s);t.match_length=ct-(s-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=3?(a=X(t,1,t.match_length-3),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=X(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2})(a,e):It[a.level].func(a,e);if(3!==i&&4!==i||(a.status=bt),1===i||3===i)return 0===t.avail_out&&(a.last_flush=-1),tt;if(2===i&&(e===J?W(a):e!==$&&(Y(a,0,0,!1),e===Q&&(kt(a.head),0===a.lookahead&&(a.strstart=0,a.block_start=0,a.insert=0))),xt(t),0===t.avail_out))return a.last_flush=-1,tt}return e!==V?tt:a.wrap<=0?et:(2===a.wrap?(At(a,255&t.adler),At(a,t.adler>>8&255),At(a,t.adler>>16&255),At(a,t.adler>>24&255),At(a,255&t.total_in),At(a,t.total_in>>8&255),At(a,t.total_in>>16&255),At(a,t.total_in>>24&255)):(Et(a,t.adler>>>16),Et(a,65535&t.adler)),xt(t),a.wrap>0&&(a.wrap=-a.wrap),0!==a.pending?tt:et)},deflateEnd:t=>{if(Lt(t))return at;const e=t.state.status;return t.state=null,e===mt?gt(t,it):tt},deflateSetDictionary:(t,e)=>{let a=e.length;if(Lt(t))return at;const i=t.state,n=i.wrap;if(2===n||1===n&&i.status!==wt||i.lookahead)return at;if(1===n&&(t.adler=C(t.adler,e,a,0)),i.wrap=0,a>=i.w_size){0===n&&(kt(i.head),i.strstart=0,i.block_start=0,i.insert=0);let t=new Uint8Array(i.w_size);t.set(e.subarray(a-i.w_size,a),0),e=t,a=i.w_size}const s=t.avail_in,r=t.next_in,o=t.input;for(t.avail_in=a,t.next_in=0,t.input=e,Ut(i);i.lookahead>=3;){let t=i.strstart,e=i.lookahead-2;do{i.ins_h=yt(i,i.ins_h,i.window[t+3-1]),i.prev[t&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=t,t++}while(--e);i.strstart=t,i.lookahead=2,Ut(i)}return i.strstart+=i.lookahead,i.block_start=i.strstart,i.insert=i.lookahead,i.lookahead=0,i.match_length=i.prev_length=2,i.match_available=0,t.next_in=r,t.input=o,t.avail_in=s,i.wrap=n,tt},deflateInfo:"pako deflate (from Nodeca project)"};const Ht=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var jt=function(t){const e=Array.prototype.slice.call(arguments,1);for(;e.length;){const a=e.shift();if(a){if("object"!=typeof a)throw new TypeError(a+"must be non-object");for(const e in a)Ht(a,e)&&(t[e]=a[e])}}return t},Kt=t=>{let e=0;for(let a=0,i=t.length;a<i;a++)e+=t[a].length;const a=new Uint8Array(e);for(let e=0,i=0,n=t.length;e<n;e++){let n=t[e];a.set(n,i),i+=n.length}return a};let Pt=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){Pt=!1}const Yt=new Uint8Array(256);for(let t=0;t<256;t++)Yt[t]=t>=252?6:t>=248?5:t>=240?4:t>=224?3:t>=192?2:1;Yt[254]=Yt[254]=1;var Gt=t=>{if("function"==typeof TextEncoder&&TextEncoder.prototype.encode)return(new TextEncoder).encode(t);let e,a,i,n,s,r=t.length,o=0;for(n=0;n<r;n++)a=t.charCodeAt(n),55296==(64512&a)&&n+1<r&&(i=t.charCodeAt(n+1),56320==(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),n++)),o+=a<128?1:a<2048?2:a<65536?3:4;for(e=new Uint8Array(o),s=0,n=0;s<o;n++)a=t.charCodeAt(n),55296==(64512&a)&&n+1<r&&(i=t.charCodeAt(n+1),56320==(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),n++)),a<128?e[s++]=a:a<2048?(e[s++]=192|a>>>6,e[s++]=128|63&a):a<65536?(e[s++]=224|a>>>12,e[s++]=128|a>>>6&63,e[s++]=128|63&a):(e[s++]=240|a>>>18,e[s++]=128|a>>>12&63,e[s++]=128|a>>>6&63,e[s++]=128|63&a);return e},Xt=(t,e)=>{const a=e||t.length;if("function"==typeof TextDecoder&&TextDecoder.prototype.decode)return(new TextDecoder).decode(t.subarray(0,e));let i,n;const s=new Array(2*a);for(n=0,i=0;i<a;){let e=t[i++];if(e<128){s[n++]=e;continue}let r=Yt[e];if(r>4)s[n++]=65533,i+=r-1;else{for(e&=2===r?31:3===r?15:7;r>1&&i<a;)e=e<<6|63&t[i++],r--;r>1?s[n++]=65533:e<65536?s[n++]=e:(e-=65536,s[n++]=55296|e>>10&1023,s[n++]=56320|1023&e)}}return((t,e)=>{if(e<65534&&t.subarray&&Pt)return String.fromCharCode.apply(null,t.length===e?t:t.subarray(0,e));let a="";for(let i=0;i<e;i++)a+=String.fromCharCode(t[i]);return a})(s,n)},Wt=(t,e)=>{(e=e||t.length)>t.length&&(e=t.length);let a=e-1;for(;a>=0&&128==(192&t[a]);)a--;return a<0||0===a?e:a+Yt[t[a]]>e?a:e};var qt=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0};const Jt=Object.prototype.toString,{Z_NO_FLUSH:Qt,Z_SYNC_FLUSH:Vt,Z_FULL_FLUSH:$t,Z_FINISH:te,Z_OK:ee,Z_STREAM_END:ae,Z_DEFAULT_COMPRESSION:ie,Z_DEFAULT_STRATEGY:ne,Z_DEFLATED:se}=K;function re(t){this.options=jt({level:ie,method:se,chunkSize:16384,windowBits:15,memLevel:8,strategy:ne},t||{});let e=this.options;e.raw&&e.windowBits>0?e.windowBits=-e.windowBits:e.gzip&&e.windowBits>0&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new qt,this.strm.avail_out=0;let a=Mt.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==ee)throw new Error(j[a]);if(e.header&&Mt.deflateSetHeader(this.strm,e.header),e.dictionary){let t;if(t="string"==typeof e.dictionary?Gt(e.dictionary):"[object ArrayBuffer]"===Jt.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,a=Mt.deflateSetDictionary(this.strm,t),a!==ee)throw new Error(j[a]);this._dict_set=!0}}function oe(t,e){const a=new re(e);if(a.push(t,!0),a.err)throw a.msg||j[a.err];return a.result}re.prototype.push=function(t,e){const a=this.strm,i=this.options.chunkSize;let n,s;if(this.ended)return!1;for(s=e===~~e?e:!0===e?te:Qt,"string"==typeof t?a.input=Gt(t):"[object ArrayBuffer]"===Jt.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;)if(0===a.avail_out&&(a.output=new Uint8Array(i),a.next_out=0,a.avail_out=i),(s===Vt||s===$t)&&a.avail_out<=6)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else{if(n=Mt.deflate(a,s),n===ae)return a.next_out>0&&this.onData(a.output.subarray(0,a.next_out)),n=Mt.deflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===ee;if(0!==a.avail_out){if(s>0&&a.next_out>0)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else if(0===a.avail_in)break}else this.onData(a.output)}return!0},re.prototype.onData=function(t){this.chunks.push(t)},re.prototype.onEnd=function(t){t===ee&&(this.result=Kt(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var le={Deflate:re,deflate:oe,deflateRaw:function(t,e){return(e=e||{}).raw=!0,oe(t,e)},gzip:function(t,e){return(e=e||{}).gzip=!0,oe(t,e)},constants:K};const he=16209;var de=function(t,e){let a,i,n,s,r,o,l,h,d,_,f,c,u,w,m,b,g,p,k,v,y,x,z,A;const E=t.state;a=t.next_in,z=t.input,i=a+(t.avail_in-5),n=t.next_out,A=t.output,s=n-(e-t.avail_out),r=n+(t.avail_out-257),o=E.dmax,l=E.wsize,h=E.whave,d=E.wnext,_=E.window,f=E.hold,c=E.bits,u=E.lencode,w=E.distcode,m=(1<<E.lenbits)-1,b=(1<<E.distbits)-1;t:do{c<15&&(f+=z[a++]<<c,c+=8,f+=z[a++]<<c,c+=8),g=u[f&m];e:for(;;){if(p=g>>>24,f>>>=p,c-=p,p=g>>>16&255,0===p)A[n++]=65535&g;else{if(!(16&p)){if(0==(64&p)){g=u[(65535&g)+(f&(1<<p)-1)];continue e}if(32&p){E.mode=16191;break t}t.msg="invalid literal/length code",E.mode=he;break t}k=65535&g,p&=15,p&&(c<p&&(f+=z[a++]<<c,c+=8),k+=f&(1<<p)-1,f>>>=p,c-=p),c<15&&(f+=z[a++]<<c,c+=8,f+=z[a++]<<c,c+=8),g=w[f&b];a:for(;;){if(p=g>>>24,f>>>=p,c-=p,p=g>>>16&255,!(16&p)){if(0==(64&p)){g=w[(65535&g)+(f&(1<<p)-1)];continue a}t.msg="invalid distance code",E.mode=he;break t}if(v=65535&g,p&=15,c<p&&(f+=z[a++]<<c,c+=8,c<p&&(f+=z[a++]<<c,c+=8)),v+=f&(1<<p)-1,v>o){t.msg="invalid distance too far back",E.mode=he;break t}if(f>>>=p,c-=p,p=n-s,v>p){if(p=v-p,p>h&&E.sane){t.msg="invalid distance too far back",E.mode=he;break t}if(y=0,x=_,0===d){if(y+=l-p,p<k){k-=p;do{A[n++]=_[y++]}while(--p);y=n-v,x=A}}else if(d<p){if(y+=l+d-p,p-=d,p<k){k-=p;do{A[n++]=_[y++]}while(--p);if(y=0,d<k){p=d,k-=p;do{A[n++]=_[y++]}while(--p);y=n-v,x=A}}}else if(y+=d-p,p<k){k-=p;do{A[n++]=_[y++]}while(--p);y=n-v,x=A}for(;k>2;)A[n++]=x[y++],A[n++]=x[y++],A[n++]=x[y++],k-=3;k&&(A[n++]=x[y++],k>1&&(A[n++]=x[y++]))}else{y=n-v;do{A[n++]=A[y++],A[n++]=A[y++],A[n++]=A[y++],k-=3}while(k>2);k&&(A[n++]=A[y++],k>1&&(A[n++]=A[y++]))}break}}break}}while(a<i&&n<r);k=c>>3,a-=k,c-=k<<3,f&=(1<<c)-1,t.next_in=a,t.next_out=n,t.avail_in=a<i?i-a+5:5-(a-i),t.avail_out=n<r?r-n+257:257-(n-r),E.hold=f,E.bits=c};const _e=15,fe=new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),ce=new Uint8Array([16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78]),ue=new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),we=new Uint8Array([16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]);var me=(t,e,a,i,n,s,r,o)=>{const l=o.bits;let h,d,_,f,c,u,w=0,m=0,b=0,g=0,p=0,k=0,v=0,y=0,x=0,z=0,A=null;const E=new Uint16Array(16),R=new Uint16Array(16);let Z,U,S,D=null;for(w=0;w<=_e;w++)E[w]=0;for(m=0;m<i;m++)E[e[a+m]]++;for(p=l,g=_e;g>=1&&0===E[g];g--);if(p>g&&(p=g),0===g)return n[s++]=20971520,n[s++]=20971520,o.bits=1,0;for(b=1;b<g&&0===E[b];b++);for(p<b&&(p=b),y=1,w=1;w<=_e;w++)if(y<<=1,y-=E[w],y<0)return-1;if(y>0&&(0===t||1!==g))return-1;for(R[1]=0,w=1;w<_e;w++)R[w+1]=R[w]+E[w];for(m=0;m<i;m++)0!==e[a+m]&&(r[R[e[a+m]]++]=m);if(0===t?(A=D=r,u=20):1===t?(A=fe,D=ce,u=257):(A=ue,D=we,u=0),z=0,m=0,w=b,c=s,k=p,v=0,_=-1,x=1<<p,f=x-1,1===t&&x>852||2===t&&x>592)return 1;for(;;){Z=w-v,r[m]+1<u?(U=0,S=r[m]):r[m]>=u?(U=D[r[m]-u],S=A[r[m]-u]):(U=96,S=0),h=1<<w-v,d=1<<k,b=d;do{d-=h,n[c+(z>>v)+d]=Z<<24|U<<16|S|0}while(0!==d);for(h=1<<w-1;z&h;)h>>=1;if(0!==h?(z&=h-1,z+=h):z=0,m++,0==--E[w]){if(w===g)break;w=e[a+r[m]]}if(w>p&&(z&f)!==_){for(0===v&&(v=p),c+=b,k=w-v,y=1<<k;k+v<g&&(y-=E[k+v],!(y<=0));)k++,y<<=1;if(x+=1<<k,1===t&&x>852||2===t&&x>592)return 1;_=z&f,n[_]=p<<24|k<<16|c-s|0}}return 0!==z&&(n[c+z]=w-v<<24|64<<16|0),o.bits=p,0};const{Z_FINISH:be,Z_BLOCK:ge,Z_TREES:pe,Z_OK:ke,Z_STREAM_END:ve,Z_NEED_DICT:ye,Z_STREAM_ERROR:xe,Z_DATA_ERROR:ze,Z_MEM_ERROR:Ae,Z_BUF_ERROR:Ee,Z_DEFLATED:Re}=K,Ze=16180,Ue=16190,Se=16191,De=16192,Te=16194,Oe=16199,Ie=16200,Fe=16206,Le=16209,Ne=t=>(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24);function Be(){this.strm=null,this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}const Ce=t=>{if(!t)return 1;const e=t.state;return!e||e.strm!==t||e.mode<Ze||e.mode>16211?1:0},Me=t=>{if(Ce(t))return xe;const e=t.state;return t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=Ze,e.last=0,e.havedict=0,e.flags=-1,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new Int32Array(852),e.distcode=e.distdyn=new Int32Array(592),e.sane=1,e.back=-1,ke},He=t=>{if(Ce(t))return xe;const e=t.state;return e.wsize=0,e.whave=0,e.wnext=0,Me(t)},je=(t,e)=>{let a;if(Ce(t))return xe;const i=t.state;return e<0?(a=0,e=-e):(a=5+(e>>4),e<48&&(e&=15)),e&&(e<8||e>15)?xe:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=a,i.wbits=e,He(t))},Ke=(t,e)=>{if(!t)return xe;const a=new Be;t.state=a,a.strm=t,a.window=null,a.mode=Ze;const i=je(t,e);return i!==ke&&(t.state=null),i};let Pe,Ye,Ge=!0;const Xe=t=>{if(Ge){Pe=new Int32Array(512),Ye=new Int32Array(32);let e=0;for(;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(me(1,t.lens,0,288,Pe,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;me(2,t.lens,0,32,Ye,0,t.work,{bits:5}),Ge=!1}t.lencode=Pe,t.lenbits=9,t.distcode=Ye,t.distbits=5},We=(t,e,a,i)=>{let n;const s=t.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new Uint8Array(s.wsize)),i>=s.wsize?(s.window.set(e.subarray(a-s.wsize,a),0),s.wnext=0,s.whave=s.wsize):(n=s.wsize-s.wnext,n>i&&(n=i),s.window.set(e.subarray(a-i,a-i+n),s.wnext),(i-=n)?(s.window.set(e.subarray(a-i,a),0),s.wnext=i,s.whave=s.wsize):(s.wnext+=n,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=n))),0};var qe={inflateReset:He,inflateReset2:je,inflateResetKeep:Me,inflateInit:t=>Ke(t,15),inflateInit2:Ke,inflate:(t,e)=>{let a,i,n,s,r,o,l,h,d,_,f,c,u,w,m,b,g,p,k,v,y,x,z=0;const A=new Uint8Array(4);let E,R;const Z=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);if(Ce(t)||!t.output||!t.input&&0!==t.avail_in)return xe;a=t.state,a.mode===Se&&(a.mode=De),r=t.next_out,n=t.output,l=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,_=o,f=l,x=ke;t:for(;;)switch(a.mode){case Ze:if(0===a.wrap){a.mode=De;break}for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(2&a.wrap&&35615===h){0===a.wbits&&(a.wbits=15),a.check=0,A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0),h=0,d=0,a.mode=16181;break}if(a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&h)<<8)+(h>>8))%31){t.msg="incorrect header check",a.mode=Le;break}if((15&h)!==Re){t.msg="unknown compression method",a.mode=Le;break}if(h>>>=4,d-=4,y=8+(15&h),0===a.wbits&&(a.wbits=y),y>15||y>a.wbits){t.msg="invalid window size",a.mode=Le;break}a.dmax=1<<a.wbits,a.flags=0,t.adler=a.check=1,a.mode=512&h?16189:Se,h=0,d=0;break;case 16181:for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(a.flags=h,(255&a.flags)!==Re){t.msg="unknown compression method",a.mode=Le;break}if(57344&a.flags){t.msg="unknown header flags set",a.mode=Le;break}a.head&&(a.head.text=h>>8&1),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0)),h=0,d=0,a.mode=16182;case 16182:for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.head&&(a.head.time=h),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,A[2]=h>>>16&255,A[3]=h>>>24&255,a.check=H(a.check,A,4,0)),h=0,d=0,a.mode=16183;case 16183:for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.head&&(a.head.xflags=255&h,a.head.os=h>>8),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0)),h=0,d=0,a.mode=16184;case 16184:if(1024&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.length=h,a.head&&(a.head.extra_len=h),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0)),h=0,d=0}else a.head&&(a.head.extra=null);a.mode=16185;case 16185:if(1024&a.flags&&(c=a.length,c>o&&(c=o),c&&(a.head&&(y=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Uint8Array(a.head.extra_len)),a.head.extra.set(i.subarray(s,s+c),y)),512&a.flags&&4&a.wrap&&(a.check=H(a.check,i,c,s)),o-=c,s+=c,a.length-=c),a.length))break t;a.length=0,a.mode=16186;case 16186:if(2048&a.flags){if(0===o)break t;c=0;do{y=i[s+c++],a.head&&y&&a.length<65536&&(a.head.name+=String.fromCharCode(y))}while(y&&c<o);if(512&a.flags&&4&a.wrap&&(a.check=H(a.check,i,c,s)),o-=c,s+=c,y)break t}else a.head&&(a.head.name=null);a.length=0,a.mode=16187;case 16187:if(4096&a.flags){if(0===o)break t;c=0;do{y=i[s+c++],a.head&&y&&a.length<65536&&(a.head.comment+=String.fromCharCode(y))}while(y&&c<o);if(512&a.flags&&4&a.wrap&&(a.check=H(a.check,i,c,s)),o-=c,s+=c,y)break t}else a.head&&(a.head.comment=null);a.mode=16188;case 16188:if(512&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(4&a.wrap&&h!==(65535&a.check)){t.msg="header crc mismatch",a.mode=Le;break}h=0,d=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),t.adler=a.check=0,a.mode=Se;break;case 16189:for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}t.adler=a.check=Ne(h),h=0,d=0,a.mode=Ue;case Ue:if(0===a.havedict)return t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,ye;t.adler=a.check=1,a.mode=Se;case Se:if(e===ge||e===pe)break t;case De:if(a.last){h>>>=7&d,d-=7&d,a.mode=Fe;break}for(;d<3;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}switch(a.last=1&h,h>>>=1,d-=1,3&h){case 0:a.mode=16193;break;case 1:if(Xe(a),a.mode=Oe,e===pe){h>>>=2,d-=2;break t}break;case 2:a.mode=16196;break;case 3:t.msg="invalid block type",a.mode=Le}h>>>=2,d-=2;break;case 16193:for(h>>>=7&d,d-=7&d;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if((65535&h)!=(h>>>16^65535)){t.msg="invalid stored block lengths",a.mode=Le;break}if(a.length=65535&h,h=0,d=0,a.mode=Te,e===pe)break t;case Te:a.mode=16195;case 16195:if(c=a.length,c){if(c>o&&(c=o),c>l&&(c=l),0===c)break t;n.set(i.subarray(s,s+c),r),o-=c,s+=c,l-=c,r+=c,a.length-=c;break}a.mode=Se;break;case 16196:for(;d<14;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(a.nlen=257+(31&h),h>>>=5,d-=5,a.ndist=1+(31&h),h>>>=5,d-=5,a.ncode=4+(15&h),h>>>=4,d-=4,a.nlen>286||a.ndist>30){t.msg="too many length or distance symbols",a.mode=Le;break}a.have=0,a.mode=16197;case 16197:for(;a.have<a.ncode;){for(;d<3;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.lens[Z[a.have++]]=7&h,h>>>=3,d-=3}for(;a.have<19;)a.lens[Z[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,E={bits:a.lenbits},x=me(0,a.lens,0,19,a.lencode,0,a.work,E),a.lenbits=E.bits,x){t.msg="invalid code lengths set",a.mode=Le;break}a.have=0,a.mode=16198;case 16198:for(;a.have<a.nlen+a.ndist;){for(;z=a.lencode[h&(1<<a.lenbits)-1],m=z>>>24,b=z>>>16&255,g=65535&z,!(m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(g<16)h>>>=m,d-=m,a.lens[a.have++]=g;else{if(16===g){for(R=m+2;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(h>>>=m,d-=m,0===a.have){t.msg="invalid bit length repeat",a.mode=Le;break}y=a.lens[a.have-1],c=3+(3&h),h>>>=2,d-=2}else if(17===g){for(R=m+3;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=m,d-=m,y=0,c=3+(7&h),h>>>=3,d-=3}else{for(R=m+7;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=m,d-=m,y=0,c=11+(127&h),h>>>=7,d-=7}if(a.have+c>a.nlen+a.ndist){t.msg="invalid bit length repeat",a.mode=Le;break}for(;c--;)a.lens[a.have++]=y}}if(a.mode===Le)break;if(0===a.lens[256]){t.msg="invalid code -- missing end-of-block",a.mode=Le;break}if(a.lenbits=9,E={bits:a.lenbits},x=me(1,a.lens,0,a.nlen,a.lencode,0,a.work,E),a.lenbits=E.bits,x){t.msg="invalid literal/lengths set",a.mode=Le;break}if(a.distbits=6,a.distcode=a.distdyn,E={bits:a.distbits},x=me(2,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,E),a.distbits=E.bits,x){t.msg="invalid distances set",a.mode=Le;break}if(a.mode=Oe,e===pe)break t;case Oe:a.mode=Ie;case Ie:if(o>=6&&l>=258){t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,de(t,f),r=t.next_out,n=t.output,l=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,a.mode===Se&&(a.back=-1);break}for(a.back=0;z=a.lencode[h&(1<<a.lenbits)-1],m=z>>>24,b=z>>>16&255,g=65535&z,!(m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(b&&0==(240&b)){for(p=m,k=b,v=g;z=a.lencode[v+((h&(1<<p+k)-1)>>p)],m=z>>>24,b=z>>>16&255,g=65535&z,!(p+m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=p,d-=p,a.back+=p}if(h>>>=m,d-=m,a.back+=m,a.length=g,0===b){a.mode=16205;break}if(32&b){a.back=-1,a.mode=Se;break}if(64&b){t.msg="invalid literal/length code",a.mode=Le;break}a.extra=15&b,a.mode=16201;case 16201:if(a.extra){for(R=a.extra;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.length+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=16202;case 16202:for(;z=a.distcode[h&(1<<a.distbits)-1],m=z>>>24,b=z>>>16&255,g=65535&z,!(m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(0==(240&b)){for(p=m,k=b,v=g;z=a.distcode[v+((h&(1<<p+k)-1)>>p)],m=z>>>24,b=z>>>16&255,g=65535&z,!(p+m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=p,d-=p,a.back+=p}if(h>>>=m,d-=m,a.back+=m,64&b){t.msg="invalid distance code",a.mode=Le;break}a.offset=g,a.extra=15&b,a.mode=16203;case 16203:if(a.extra){for(R=a.extra;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.offset+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){t.msg="invalid distance too far back",a.mode=Le;break}a.mode=16204;case 16204:if(0===l)break t;if(c=f-l,a.offset>c){if(c=a.offset-c,c>a.whave&&a.sane){t.msg="invalid distance too far back",a.mode=Le;break}c>a.wnext?(c-=a.wnext,u=a.wsize-c):u=a.wnext-c,c>a.length&&(c=a.length),w=a.window}else w=n,u=r-a.offset,c=a.length;c>l&&(c=l),l-=c,a.length-=c;do{n[r++]=w[u++]}while(--c);0===a.length&&(a.mode=Ie);break;case 16205:if(0===l)break t;n[r++]=a.length,l--,a.mode=Ie;break;case Fe:if(a.wrap){for(;d<32;){if(0===o)break t;o--,h|=i[s++]<<d,d+=8}if(f-=l,t.total_out+=f,a.total+=f,4&a.wrap&&f&&(t.adler=a.check=a.flags?H(a.check,n,f,r-f):C(a.check,n,f,r-f)),f=l,4&a.wrap&&(a.flags?h:Ne(h))!==a.check){t.msg="incorrect data check",a.mode=Le;break}h=0,d=0}a.mode=16207;case 16207:if(a.wrap&&a.flags){for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(4&a.wrap&&h!==(4294967295&a.total)){t.msg="incorrect length check",a.mode=Le;break}h=0,d=0}a.mode=16208;case 16208:x=ve;break t;case Le:x=ze;break t;case 16210:return Ae;default:return xe}return t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,(a.wsize||f!==t.avail_out&&a.mode<Le&&(a.mode<Fe||e!==be))&&We(t,t.output,t.next_out,f-t.avail_out),_-=t.avail_in,f-=t.avail_out,t.total_in+=_,t.total_out+=f,a.total+=f,4&a.wrap&&f&&(t.adler=a.check=a.flags?H(a.check,n,f,t.next_out-f):C(a.check,n,f,t.next_out-f)),t.data_type=a.bits+(a.last?64:0)+(a.mode===Se?128:0)+(a.mode===Oe||a.mode===Te?256:0),(0===_&&0===f||e===be)&&x===ke&&(x=Ee),x},inflateEnd:t=>{if(Ce(t))return xe;let e=t.state;return e.window&&(e.window=null),t.state=null,ke},inflateGetHeader:(t,e)=>{if(Ce(t))return xe;const a=t.state;return 0==(2&a.wrap)?xe:(a.head=e,e.done=!1,ke)},inflateSetDictionary:(t,e)=>{const a=e.length;let i,n,s;return Ce(t)?xe:(i=t.state,0!==i.wrap&&i.mode!==Ue?xe:i.mode===Ue&&(n=1,n=C(n,e,a,0),n!==i.check)?ze:(s=We(t,e,a,a),s?(i.mode=16210,Ae):(i.havedict=1,ke)))},inflateInfo:"pako inflate (from Nodeca project)"};var Je=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1};const Qe=Object.prototype.toString,{Z_NO_FLUSH:Ve,Z_FINISH:$e,Z_OK:ta,Z_STREAM_END:ea,Z_NEED_DICT:aa,Z_STREAM_ERROR:ia,Z_DATA_ERROR:na,Z_MEM_ERROR:sa}=K;function ra(t){this.options=jt({chunkSize:65536,windowBits:15,to:""},t||{});const e=this.options;e.raw&&e.windowBits>=0&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(e.windowBits>=0&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),e.windowBits>15&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new qt,this.strm.avail_out=0;let a=qe.inflateInit2(this.strm,e.windowBits);if(a!==ta)throw new Error(j[a]);if(this.header=new Je,qe.inflateGetHeader(this.strm,this.header),e.dictionary&&("string"==typeof e.dictionary?e.dictionary=Gt(e.dictionary):"[object ArrayBuffer]"===Qe.call(e.dictionary)&&(e.dictionary=new Uint8Array(e.dictionary)),e.raw&&(a=qe.inflateSetDictionary(this.strm,e.dictionary),a!==ta)))throw new Error(j[a])}function oa(t,e){const a=new ra(e);if(a.push(t),a.err)throw a.msg||j[a.err];return a.result}ra.prototype.push=function(t,e){const a=this.strm,i=this.options.chunkSize,n=this.options.dictionary;let s,r,o;if(this.ended)return!1;for(r=e===~~e?e:!0===e?$e:Ve,"[object ArrayBuffer]"===Qe.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;){for(0===a.avail_out&&(a.output=new Uint8Array(i),a.next_out=0,a.avail_out=i),s=qe.inflate(a,r),s===aa&&n&&(s=qe.inflateSetDictionary(a,n),s===ta?s=qe.inflate(a,r):s===na&&(s=aa));a.avail_in>0&&s===ea&&a.state.wrap>0&&0!==t[a.next_in];)qe.inflateReset(a),s=qe.inflate(a,r);switch(s){case ia:case na:case aa:case sa:return this.onEnd(s),this.ended=!0,!1}if(o=a.avail_out,a.next_out&&(0===a.avail_out||s===ea))if("string"===this.options.to){let t=Wt(a.output,a.next_out),e=a.next_out-t,n=Xt(a.output,t);a.next_out=e,a.avail_out=i-e,e&&a.output.set(a.output.subarray(t,t+e),0),this.onData(n)}else this.onData(a.output.length===a.next_out?a.output:a.output.subarray(0,a.next_out));if(s!==ta||0!==o){if(s===ea)return s=qe.inflateEnd(this.strm),this.onEnd(s),this.ended=!0,!0;if(0===a.avail_in)break}}return!0},ra.prototype.onData=function(t){this.chunks.push(t)},ra.prototype.onEnd=function(t){t===ta&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=Kt(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var la={Inflate:ra,inflate:oa,inflateRaw:function(t,e){return(e=e||{}).raw=!0,oa(t,e)},ungzip:oa,constants:K};const{Deflate:ha,deflate:da,deflateRaw:_a,gzip:fa}=le,{Inflate:ca,inflate:ua,inflateRaw:wa,ungzip:ma}=la;var ba=ha,ga=da,pa=_a,ka=fa,va=ca,ya=ua,xa=wa,za=ma,Aa=K,Ea={Deflate:ba,deflate:ga,deflateRaw:pa,gzip:ka,Inflate:va,inflate:ya,inflateRaw:xa,ungzip:za,constants:Aa};t.Deflate=ba,t.Inflate=va,t.constants=Aa,t.default=Ea,t.deflate=ga,t.deflateRaw=pa,t.gzip=ka,t.inflate=ya,t.inflateRaw=xa,t.ungzip=za,Object.defineProperty(t,"__esModule",{value:!0})}));

/**
 * Add gRPC Header
 * @author app2smile
 * @param {ArrayBuffer} header - unGzip Header
 * @param {ArrayBuffer} body - unGzip Body
 * @param {String} type - encoding type
 * @return {ArrayBuffer} new raw Body with Checksum Header
 */
function addgRPCHeader({ header, body }, encoding = undefined) {
    console.log(`☑️ Add gRPC Header`, '')
    // Header: 1位：是否校验数据 （0或者1） + 4位:校验值（数据长度）
    const flag = encoding == 'gzip' ? 1 : encoding == 'identity' ? 0 : encoding == undefined ? 0 : header?.[0] ?? 0 // encoding flag
    const checksum = Checksum(body.length) // 校验值为未压缩情况下的数据长度, 不是压缩后的长度
    if (encoding == 'gzip') body = pako.gzip(body) // gzip压缩（有问题，别压）
    let rawBody = new Uint8Array(header.length + body.length)
    rawBody.set([flag], 0) // 0位：Encoding类型，当为1的时候, app会校验1-4位的校验值是否正确
    rawBody.set(checksum, 1) // 1-4位： 校验值(4位)
    rawBody.set(body, 5) // 5-end位：protobuf数据
    console.log(`✅ Add gRPC Header`, '')
    return rawBody

    // 计算校验和 (B站为数据本体字节数)
    function Checksum(num) {
        let arr = new ArrayBuffer(4) // an Int32 takes 4 bytes
        let view = new DataView(arr)
        // 首位填充计算过的新数据长度
        view.setUint32(0, num, false) // byteOffset = 0; litteEndian = false
        return new Uint8Array(arr)
    }
}

const $ = new ENV('RelatesFeed')

let data = $response.body
let rawBody = new Uint8Array(data)

// 先拆分B站gRPC校验头和protobuf数据体
let header = rawBody.slice(0, 5)
let body = rawBody.slice(5)
// console.log(header?.[0])

// 处理response压缩protobuf数据体
switch (header?.[0]) {
    case 0: // unGzip
        break
    case 1: // Gzip
        body = pako.ungzip(body)
        header[0] = 0 // unGzip
        break
}

let test = RelatesFeedReply.fromBinary(body)
test.relates = test.relates.filter((item) => {
    if (item.relateCardType == 5) {
        $.log('Remove RelatesFeed CM ads')
        $.msg('Remove RelatesFeed CM ads')
        return false
    }
    return true
})
body = RelatesFeedReply.toBinary(test)
// protobuf部分处理完后，重新计算并添加B站gRPC校验头
rawBody = addgRPCHeader({ header, body }) // gzip压缩有问题，别用
// 写入二进制数据
// $response.body = rawBody
$.done({ body: rawBody })

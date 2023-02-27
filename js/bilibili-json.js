let body = $response.body;
if (body) {
    switch (!0) {
        case /^https:\/\/app\.bilibili\.com\/x\/v2\/feed\/index\?/.test($request.url):
            try {
                let t = JSON.parse(body),
                    i = [];
                for (let a of t.data.items)
                    if (!a.hasOwnProperty("banner_item")) {
                        if (!(!a.hasOwnProperty("ad_info") && -1 === a.card_goto?.indexOf("ad") && ["small_cover_v2", "large_cover_v1", "large_cover_single_v9"].includes(a.card_type))) continue;
                        else if (a.uri.includes("bilibili://story")) {
                  a.uri = a.uri.replace("bilibili://story", "bilibili://video");
                } else i.push(a)
                    } t.data.items = i, body = JSON.stringify(t)
            } catch (e) {
                console.log("bilibili index:" + e)
            }
            break;
        case /^https?:\/\/app\.bilibili\.com\/x\/v2\/feed\/index\/story\?/.test($request.url):
            try {
                let s = JSON.parse(body),
                    l = [];
                for (let o of s.data.items) o.hasOwnProperty("ad_info") || -1 !== o.card_goto.indexOf("ad") || l.push(o);
                s.data.items = l, body = JSON.stringify(s)
            } catch (d) {
                console.log("bilibili Story:" + d)
            }
            break;
        case /^https?:\/\/app\.bilibili\.com\/x\/v\d\/account\/teenagers\/status\?/.test($request.url):
            try {
                let r = JSON.parse(body);
                r.data.teenagers_status = 0, body = JSON.stringify(r)
            } catch (b) {
                console.log("bilibili teenagers:" + b)
            }
            break;
        case /^https?:\/\/app\.bilibili\.com\/x\/resource\/show\/tab/.test($request.url):
            try {
          const tabList = new Set([39, 40, 41, 545, 151, 442, 99, 100, 101, 554, 556, 1049, 801, 1050, 1271]);
          const tabNameList = new Set(["直播", "推薦", "IVE", "LESSERAFIM", "韓綜", "動畫", "STAYC"]);
          const topList = new Set([176]);
          const bottomList = new Set([177, 178, 179, 181, 690, 102, 103, 104, 105, 106]);
          let obj = JSON.parse(body);
          if (obj["data"]["tab"]) {
            let tab = obj["data"]["tab"].filter((e) => {
              return tabNameList.has(e.name) || tabList.has(e.id);
            });
            obj["data"]["tab"] = tab;
          }
          if (obj["data"]["top"]) {
            let top = obj["data"]["top"].filter((e) => {
              return topList.has(e.id);
            });
            obj["data"]["top"] = top;
          }
          if (obj["data"]["bottom"]) {
            let bottom = obj["data"]["bottom"].filter((e) => {
              return bottomList.has(e.id);
            });
            obj["data"]["bottom"] = bottom;
          }
          body = JSON.stringify(obj);
            } catch (y) {
                console.log("bilibili tab processing:" + y)
            }
            break;
        case /^https?:\/\/app\.bilibili\.com\/x\/v2\/account\/mine/.test($request.url):
            try {
                let u = JSON.parse(body),
                    f = new Set([396, 397, 398, 399, 410, 425, 426, 427, 428, 430, 432, 433, 434, 494, 495, 496, 497, 500, 501]);
                u.data.sections_v2.forEach((t, i) => {
                    let a = t.items.filter(t => f.has(t.id));
                    u.data.sections_v2[i].items = a, u.data.sections_v2[i].button = {}, delete u.data.sections_v2[i].be_up_title, delete u.data.sections_v2[i].tip_icon, delete u.data.sections_v2[i].tip_title, "创作中心" && "推薦服務" == u.data.sections_v2[i].title && (delete u.data.sections_v2[i].title, delete u.data.sections_v2[i].type)
                }), delete u.data.vip_section_v2, delete u.data.vip_section, u.data.hasOwnProperty("live_tip") && (u.data.live_tip = {}), u.data.hasOwnProperty("answer") && (u.data.answer = {}), u.data.vip_type = 2, u.data.vip.type = 2, u.data.vip.status = 1, u.data.vip.vip_pay_type = 1, u.data.vip.due_date = 4669824160, body = JSON.stringify(u)
            } catch (h) {
                console.log("bilibili mypage:" + h)
            }
            break;
        case /^https?:\/\/api\.live\.bilibili\.com\/xlive\/app-room\/v1\/index\/getInfoByRoom/.test($request.url):
            try {
                let m = JSON.parse(body);
                m.data.activity_banner_info = null, m.data?.shopping_info && (m.data.shopping_info = {
                    is_show: 0
                }), m.data?.new_tab_info?.outer_list && m.data.new_tab_info.outer_list.length && (m.data.new_tab_info.outer_list = m.data.new_tab_info.outer_list.filter(t => 33 != t.biz_id)), body = JSON.stringify(m)
            } catch (g) {
                console.log("bilibili live broadcast:" + g)
            }
            break;
        case /^https?:\/\/app\.bilibili\.com\/x\/resource\/top\/activity/.test($request.url):
            try {
                let v = JSON.parse(body);
                v.data && (v.data.hash = "9453", v.data.online.icon = ""), body = JSON.stringify(v)
            } catch (_) {
                console.log("bilibili right corner:" + _)
            }
            break;
        case /ecommerce-user\/get_shopping_info\?/.test($request.url):
            try {
                let $ = JSON.parse(body);
                $.data && ($.data = {
                    shopping_card_detail: {},
                    bubbles_detail: {},
                    recommend_card_detail: {},
                    selected_goods: {},
                    h5jump_popup: []
                }), body = JSON.stringify($)
            } catch (x) {
                console.log("bilibili shopping info:" + x)
            }
            break;
        case /^https?:\/\/app\.bilibili\.com\/x\/v2\/search\/square/.test($request.url):
            try {
                let k = JSON.parse(body);
                k.data = k.data.filter((n) => n.type == "history"), body = JSON.stringify(k)
            } catch (w) {
                console.log("bilibili hot search:" + w)
            }
            break;
        case /https?:\/\/app\.bilibili\.com\/x\/v2\/account\/myinfo\?/.test($request.url):
            try {
                let O = JSON.parse(body);
                O.data.vip.type = 2, O.data.vip.status = 1, O.data.vip.vip_pay_type = 1, O.data.vip.due_date = 4669824160, body = JSON.stringify(O)
            } catch (P) {
                console.log("bilibili 1080p:" + P)
            }
            break;
        case /pgc\/page\/(bangumi|cinema\/tab\?)/.test($request.url):
            try {
                let W = JSON.parse(body);
                W.result.modules.forEach(t => {
                    t.style.startsWith("banner") && (t.items = t.items.filter(t => -1 != t.link.indexOf("play"))), t.style.startsWith("function") && (t.items = t.items.filter(t => -1 == t.blink.indexOf("bilibili.com")), [1283, 241, 1441, 1284].includes(t.module_id) && (t.items = [])), t.style.startsWith("tip") && (t.items = [])
                }), body = JSON.stringify(W)
            } catch (j) {
                console.log("bilibili fanju:" + j)
            }
            break;
        case /^https:\/\/app\.bilibili\.com\/x\/v2\/splash\/list/.test($request.url):
            try {
                let E = JSON.parse(body);
                if (E.data && E.data.list)
                    for (let q of E.data.list) q.duration = 0, q.begin_time = 2240150400, q.end_time = 2240150400;
                body = JSON.stringify(E)
            } catch (z) {
                console.log("bilibili openad:" + z)
            }
            break;
        case /^https:\/\/api\.live\.bilibili\.com\/xlive\/app-interface\/v2\/index\/feed/.test($request.url):
            try {
                let B = JSON.parse(body);
                B.data && B.data.card_list && (B.data.card_list = B.data.card_list.filter(t => "banner_v1" != t.card_type)), body = JSON.stringify(B)
            } catch (I) {
                console.log("bilibili xlive:" + I)
            }
            break;
        default:
            $done({})
    }
    $done({
        body
    })
} else $done({});
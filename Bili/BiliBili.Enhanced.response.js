/*
WEBSITE: https://biliuniverse.io
README: https://github.com/BiliUniverse
*/
const $ = new Env("📺 BiliBili: ⚙️ Enhanced v0.2.1(10) response");
const URL = new URLs();
const DataBase = {
	"Enhanced":{
		"Settings":{
			"Switch":"true",
			"Home":{"Top_left":"mine","Top":["消息Top"],"Top_more":[],"Tab":["直播tab","推荐tab","hottopic","bangumi","anime","film","koreavtw"],"Tab_default":"bangumi"},
			"Bottom":["home","dynamic","ogv","会员购Bottom","我的Bottom"],
			"Mine":{"CreatorCenter":[],"Recommend":["400","402","403","404"],"More":["407","410","1028"]},
			"Region":["1","3","4","5","11","13","23","36","119","129","155","160","167","177","181","188","202","211","217","223","234","6544","65537","65539","65541","65545","65549","65550","65551","65552","65553","65555","65556","65557","65559","65560","65561","65563","95636","168312"]
		},
		"Configs":{
			"Tab":{
				"tab":[{"id":2036,"name":"直播","uri":"bilibili://live/home","tab_id":"直播tab"},{"id":2037,"name":"推荐","uri":"bilibili://pegasus/promo","tab_id":"推荐tab"},{"id":780,"name":"热门","uri":"bilibili://pegasus/hottopic","tab_id":"hottopic"},{"id":545,"name":"追番","uri":"bilibili://pgc/home","tab_id":"bangumi"},{"id":774,"name":"动画","uri":"bilibili://following/home_activity_tab/6544","tab_id":"anime"},{"id":151,"name":"影视","uri":"bilibili://pgc/cinema-tab","tab_id":"film"},{"id":801,"name":"韩综","uri":"bilibili://following/home_activity_tab/95636","tab_id":"koreavtw"},{"id":861,"name":"游戏","uri":"bilibili://pegasus/vertical/802","tab_id":"game"},{"id":843,"name":"minecraft","uri":"bilibili://pegasus/vertical/2485003","tab_id":"mctab"},{"id":1229,"name":"动画同人","uri":"bilibili://pegasus/vertical/27555107","tab_id":"dhtr"},{"id":1405,"name":"搞笑","uri":"bilibili://pegasus/vertical/1833","tab_id":"gaoxiao"},{"id":2280,"name":"校园","uri":"bilibili://campus/home_tab","tab_id":"school"},{"id":1716,"name":"数码","uri":"bilibili://pegasus/vertical/13807","tab_id":"kj"},{"id":136117,"name":"新征程","uri":"bilibili://following/home_activity_tab/136117","tab_id":"165","color":"#DD1225"},{"id":1050,"tab_id": "ive","name": "IVE","uri": "bilibili://pegasus/vertical/168073"},{"id": 1272,"tab_id": "stayc","name": "STAYC","uri": "bilibili://pegasus/vertical/16961522"},{"id": 1271,"tab_id": "le","name": "LESSERAFIM","uri": "bilibili://pegasus/vertical/25270553"},{"id": 859,"tab_id": "kpop","name": "kpop","uri": "bilibili:\/\/pegasus\/vertical\/123465"},{"id": 1052,"tab_id": "gidle","name": "(G)I-DLE","uri": "bilibili:\/\/pegasus\/vertical\/6945542"}],
				"top":[{"id":222,"icon":"http://i0.hdslb.com/bfs/archive/734a3b610a953df398bbe6d787944514dcd94a46.png","name":"游戏中心","uri":"bilibili://game_center/home","tab_id":"游戏中心Top"},{"id":108,"icon":"http://i0.hdslb.com/bfs/archive/9d1c0985b9d0e2da2c2f919cc2ee0e36ea41fd90.png","name":"会员购","uri":"bilibili://mall/home/","tab_id":"会员购Top"},{"id":176,"icon":"http://i0.hdslb.com/bfs/archive/d43047538e72c9ed8fd8e4e34415fbe3a4f632cb.png","name":"消息","uri":"bilibili://link/im_home","tab_id":"消息Top"}],
				"bottom":[{"id":177,"icon":"http://i0.hdslb.com/bfs/archive/63d7ee88d471786c1af45af86e8cb7f607edf91b.png","icon_selected":"http://i0.hdslb.com/bfs/archive/e5106aa688dc729e7f0eafcbb80317feb54a43bd.png","name":"首页","uri":"bilibili://main/home/","tab_id":"home"},{"id":103,"icon":"http://i0.hdslb.com/bfs/archive/b4f621f268c1f9eda501805135f132aa9498b0ba.png","icon_selected":"http://i0.hdslb.com/bfs/archive/94539249e59621214f7dc1226cf38a2b8fe4c64f.png","name":"频道","uri":"bilibili://pegasus/channel/","tab_id":"频道Bottom"},{"id":179,"icon":"http://i0.hdslb.com/bfs/archive/86dfbe5fa32f11a8588b9ae0fccb77d3c27cedf6.png","icon_selected":"http://i0.hdslb.com/bfs/archive/25b658e1f6b6da57eecba328556101dbdcb4b53f.png","name":"动态","uri":"bilibili://following/home/","tab_id":"dynamic"},{"id":670,"icon":"http://i0.hdslb.com/bfs/feed-admin/c25cabacb40e9df2ccf54c327350e1afc4ae2f8c.png","name":"发布","uri":"bilibili://uper/center_plus?relation_from=center_plus\u0026tab_index=2","tab_id":"publish","dialog_items":[{"id":617,"name":"开直播","icon":"http://i0.hdslb.com/bfs/feed-admin/01f9b3f8ed61a4e59af693da9fcd38fc342ee7e5.png","uri":"activity://liveStreaming/home?source_event=14"},{"id":618,"name":"拍摄","icon":"http://i0.hdslb.com/bfs/feed-admin/30636aa60e594550ec47422e3875b4345e7d6017.png","uri":"bilibili://uper/user_center/add_archive/?from=1\u0026is_new_ui=1\u0026relation_from=center_plus"},{"id":619,"name":"上传","icon":"http://i0.hdslb.com/bfs/feed-admin/55c3c112f4885adc6cce0b4b94149409fd1c147b.png","uri":"bilibili://uper/user_center/add_archive/?from=0\u0026is_new_ui=1\u0026relation_from=center_plus"},{"id":620,"name":"模板创作","icon":"http://i0.hdslb.com/bfs/feed-admin/4e5188d8390754655dee0fdfd90c1088da3cdf90.png","uri":"bilibili://uper/user_center/add_archive/?from=2\u0026is_new_ui=1\u0026relation_from=center_plus"}],"type":3},{"id":884,"icon":"http://i0.hdslb.com/bfs/feed-admin/68b1625cef3a8315d6fe3fbfd2a8b06c905f323a.png","icon_selected":"http://i0.hdslb.com/bfs/feed-admin/1903c6f1dc881ed4c459ab337767fd8436cda159.png","name":"节目","uri":"bilibili://following/home_bottom_tab_activity_tab/168312","tab_id":"ogv","type":4},{"id":242,"icon":"http://i0.hdslb.com/bfs/archive/6090d5fa7ece2a94de839e7cce4f1e774dae7779.png","icon_selected":"http://i0.hdslb.com/bfs/archive/eeaf83fb7157000776dd93f61702a049f56801d3.png","name":"会员购","uri":"bilibili://mall/home","tab_id":"会员购Bottom"},{"id":105,"icon":"http://i0.hdslb.com/bfs/archive/93dae0f0fb2c9887effb2840800d5b639be69351.png","icon_selected":"http://i0.hdslb.com/bfs/archive/f96bfd9ffea2e51443aed44dba6d76b7b34891c8.png","name":"消息","uri":"bilibili://link/im_home","tab_id":"消息Bottom"},{"id":181,"icon":"http://i0.hdslb.com/bfs/archive/4b0b2c49ffeb4f0c2e6a4cceebeef0aab1c53fe1.png","icon_selected":"http://i0.hdslb.com/bfs/archive/a54a8009116cb896e64ef14dcf50e5cade401e00.png","name":"我的","uri":"bilibili://user_center/","tab_id":"我的Bottom"}],
				"top_more":[{"id":621,"icon":"http://i0.hdslb.com/bfs/feed-admin/f95dfa31c793c857af6e7b65b5387a05f30d31ba.png","name":"更多分区","uri":"bilibili://main/top_category"},{"id":922,"icon":"http://i0.hdslb.com/bfs/feed-admin/38beac42189ad4d838d20259a5b2cdfd302fef40.png","name":"搜索","uri":"bilibili://search"}],
				"top_left":{"mine":{"exp":0,"head_tag":"","url":"bilibili://user_center/","goto":1,"story_background_image":"","story_foreground_image":"","listen_background_image":"","listen_foreground_image":""},"videoshortcut":{"exp":1,"head_tag":"https://i0.hdslb.com/bfs/app/92e7b36c3bd10c850e8a2ba85d19566937751540.png","url":"bilibili://videoshortcut?user_reg_state=0","goto":2,"story_background_image":"http://i0.hdslb.com/bfs/app/7391267ec11cfe99823a8cfd80532a7bc6eca390.png","story_foreground_image":"http://i0.hdslb.com/bfs/app/98098cfd9349b7500c233216169d768cd536d305.png","listen_background_image":"http://i0.hdslb.com/bfs/app/365848675f453e32b42567ba9e249a347a5df061.png","listen_foreground_image":"http://i0.hdslb.com/bfs/app/986ee5e963237d511802c4084c83c2f228e97369.png"}}
			},
			"Mine":{
				"sections_v2":[{"items":[{"id":396,"title":"离线缓存","icon":"http://i0.hdslb.com/bfs/archive/5fc84565ab73e716d20cd2f65e0e1de9495d56f8.png","common_op_item":{},"uri":"bilibili://user_center/download"},{"id":397,"title":"历史记录","icon":"http://i0.hdslb.com/bfs/archive/8385323c6acde52e9cd52514ae13c8b9481c1a16.png","common_op_item":{},"uri":"bilibili://user_center/history"},{"id":398,"title":"我的收藏","icon":"http://i0.hdslb.com/bfs/archive/d79b19d983067a1b91614e830a7100c05204a821.png","common_op_item":{},"uri":"bilibili://user_center/favourite"},{"id":399,"title":"稍后再看","icon":"http://i0.hdslb.com/bfs/archive/63bb768caa02a68cb566a838f6f2415f0d1d02d6.png","need_login":1,"uri":"bilibili://user_center/watch_later","common_op_item":{}}],"style":1,"button":{}},{"up_title":"创作中心","title":"创作中心","items":[{"need_login":1,"display":1,"id":171,"title":"创作中心","global_red_dot":1,"uri":"bilibili://uper/homevc","icon":"http://i0.hdslb.com/bfs/archive/d3aad2d07538d2d43805f1fa14a412d7a45cc861.png"},{"need_login":1,"display":1,"id":172,"title":"稿件管理","global_red_dot":1,"uri":"bilibili://uper/user_center/archive_list","icon":"http://i0.hdslb.com/bfs/archive/97acb2d8dec09b296a38f7f7093d651947d13b91.png"},{"need_login":1,"display":1,"id":174,"title":"有奖活动","red_dot":1,"global_red_dot":1,"uri":"https://member.bilibili.com/york/hot-activity","icon":"http://i0.hdslb.com/bfs/archive/7f4fa86d99bf3814bf10f8ee5d6c8c9db6e931c8.png"},{"need_login":1,"display":1,"id":533,"title":"任务中心","global_red_dot":1,"uri":"https://member.bilibili.com/york/mission-center?navhide=1","icon":"http://i0.hdslb.com/bfs/archive/ae18624fd2a7bdda6d95ca606d5e4cf2647bfa4d.png"},{"id":707,"title":"主播中心","icon":"http://i0.hdslb.com/bfs/feed-admin/48e17ccd0ce0cfc9c7826422d5e47ce98f064c2a.png","need_login":1,"uri":"https://live.bilibili.com/p/html/live-app-anchor-center/index.html?is_live_webview=1#/","display":1},{"id":708,"title":"主播活动","icon":"http://i0.hdslb.com/bfs/feed-admin/5bc5a1aa8dd4bc5d6f5222d29ebaca9ef9ce37de.png","need_login":1,"uri":"https://live.bilibili.com/activity/live-activity-full/activity_center/mobile.html?is_live_webview=1","display":1},{"id":709,"title":"开播福利","icon":"https://i0.hdslb.com/bfs/legacy/97a52b64cbd8c099d6520c6be57006c954ec0f5c.png","need_login":1,"uri":"https://live.bilibili.com/p/html/live-anchor-galaxy/task_center/?source_event=16&week_live_btn=1&is_live_full_webview=1#/","display":1},{"id":710,"title":"我的直播","icon":"http://i0.hdslb.com/bfs/feed-admin/a9be4fa50ea4772142c1fc7992cde28294d63021.png","need_login":1,"uri":"https://live.bilibili.com/p/html/live-app-center/index.html?is_live_webview=1&foreground=pink&background=white","display":1}],"style":1,"button":{"icon":"http://i0.hdslb.com/bfs/archive/205f47675eaaca7912111e0e9b1ac94cb985901f.png","style":1,"url":"bilibili://uper/user_center/archive_selection","text":"发布"},"type":1},{"title":"推荐服务","items":[{"id":400,"title":"我的课程","icon":"http://i0.hdslb.com/bfs/archive/aa3a13c287e4d54a62b75917dd9970a3cde472e1.png","common_op_item":{},"uri":"https://m.bilibili.com/cheese/mine?navhide=1&native.theme=1&night=0&spm_id_from=main.my-information.0.0.pv&csource=Me_myclass"},{"id":401,"title":"看视频免流量","icon":"http://i0.hdslb.com/bfs/archive/393dd15a4f0a149e016cd81b55bd8bd6fe40882c.png","common_op_item":{},"uri":"bilibili://user_center/free_traffic"},{"id":402,"title":"个性装扮","icon":"http://i0.hdslb.com/bfs/archive/0bcad10661b50f583969b5a188c12e5f0731628c.png","common_op_item":{},"uri":"https://www.bilibili.com/h5/mall/home?navhide=1&f_source=shop"},{"id":403,"title":"游戏中心","icon":"http://i0.hdslb.com/bfs/archive/873e3c16783fe660b111c02ebc4c50279cb5db57.png","common_op_item":{},"uri":"bilibili://game_center/user?sourceFrom=100003"},{"id":404,"title":"我的钱包","icon":"http://i0.hdslb.com/bfs/archive/f416634e361824e74a855332b6ff14e2e7c2e082.png","need_login":1,"common_op_item":{},"uri":"bilibili://bilipay/mine_wallet"},{"id":406,"title":"直播中心","icon":"http://i0.hdslb.com/bfs/archive/1db5791746a0112890b77a0236baf263d71ecb27.png","common_op_item":{},"uri":"bilibili://user_center/live_center"},{"id":423,"title":"邀好友赚红包","icon":"http://i0.hdslb.com/bfs/archive/de39fc8899204a4e5abaab68fa4bd604068ce124.png","common_op_item":{},"uri":"https://www.bilibili.com/blackboard/redpack/activity-8SX5lYqUj.html?from=wode","red_dot_for_new":true},{"id":514,"title":"社区中心","icon":"http://i0.hdslb.com/bfs/archive/551a39b7539e64d3b15775295c4b2e13e5513b43.png","need_login":1,"uri":"https://www.bilibili.com/blackboard/dynamic/169422","common_op_item":{}},{"id":544,"title":"创作中心","icon":"http://i0.hdslb.com/bfs/archive/a879489af0406067c39940316396ae63aeefe088.png","need_login":1,"uri":"bilibili://upper/homevc","common_op_item":{}},{"id":622,"title":"会员购中心","icon":"http://i0.hdslb.com/bfs/archive/19c794f01def1a267b894be84427d6a8f67081a9.png","common_op_item":{},"uri":"bilibili://mall/mine?msource=mine"},{"id":924,"title":"哔哩哔哩公益","icon":"http://i0.hdslb.com/bfs/feed-admin/a943016e8bef03222998b4760818894ba2bd5c80.png","common_op_item":{},"uri":"https://love.bilibili.com/h5/?navhide=1&c=1"},{"id":990,"title":"能量加油站","icon":"http://i0.hdslb.com/bfs/feed-admin/6acb0cb1f719703c62eb443ba6cf3abfc51164ab.png","common_op_item":{},"uri":"https://www.bilibili.com/blackboard/dynamic/306424"}],"style":1,"button":{}},{"title":"更多服务","items":[{"id":407,"title":"联系客服","icon":"http://i0.hdslb.com/bfs/archive/7ca840cf1d887a45ee1ef441ab57845bf26ef5fa.png","common_op_item":{},"uri":"bilibili://user_center/feedback"},{"id":410,"title":"设置","icon":"http://i0.hdslb.com/bfs/archive/e932404f2ee62e075a772920019e9fbdb4b5656a.png","common_op_item":{},"uri":"bilibili://user_center/setting"},{"id":741,"title":"我的钱包","icon":"http://i0.hdslb.com/bfs/archive/f416634e361824e74a855332b6ff14e2e7c2e082.png","need_login":1,"uri":"bilibili://bilipay/mine_wallet","common_op_item":{}},{"id":742,"title":"稿件管理","icon":"http://i0.hdslb.com/bfs/archive/97acb2d8dec09b296a38f7f7093d651947d13b91.png","need_login":1,"uri":"bilibili://uper//user_center/manuscript-list/","common_op_item":{}},{"id":812,"title":"听视频","icon":"http://i0.hdslb.com/bfs/feed-admin/97276c5df099e516946682edf4ef10dc6b18c7dc.png","common_op_item":{},"uri":"bilibili://podcast","red_dot_for_new":true},{"id":950,"title":"青少年模式","icon":"http://i0.hdslb.com/bfs/archive/68acfd37a735411ad56b59b3253acc33f94f7046.png","common_op_item":{},"uri":"bilibili://user_center/teenagersmode"},{"id":964,"title":"青少年守护","icon":"http://i0.hdslb.com/bfs/feed-admin/90f5920ac351da19c6451757ad71704fcea8192b.png","common_op_item":{},"uri":"https://www.bilibili.com/h5/teenagers/home?navhide=1"},{"id":1028,"title":"我的NFT","icon":"http://i0.hdslb.com/bfs/feed-admin/569a9178aa707f2f2494e34bb6eb1d9d14bd9a7b.png","need_login":1,"uri":"https://www.bilibili.com/h5/pangu/gat?navhide=1","common_op_item":{}}],"style":2,"button":{}}]
			},
			"Region":{
				"index":[{"tid":1,"reid":0,"name":"动画","logo":"http://i0.hdslb.com/bfs/archive/9b3bb8cfc8d87809ffa409bc65def8d8c3eaf72b.png","goto":"0","param":"","uri":"bilibili://region/1","type":0,"children":[{"tid":24,"reid":1,"name":"MAD·AMV","logo":"","goto":"0","param":"","type":0},{"tid":25,"reid":1,"name":"MMD·3D","logo":"","goto":"0","param":"","type":0},{"tid":27,"reid":1,"name":"综合","logo":"","goto":"0","param":"","type":0},{"tid":47,"reid":1,"name":"短片·手书·配音","logo":"","goto":"0","param":"","type":0},{"tid":210,"reid":1,"name":"手办·模玩","logo":"","goto":"0","param":"","type":0},{"tid":86,"reid":1,"name":"特摄","logo":"","goto":"0","param":"","type":0},{"tid":253,"reid":1,"name":"动漫杂谈","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":3,"reid":0,"name":"音乐","logo":"http://i0.hdslb.com/bfs/archive/3a99c51d00038ced3989686b6f3c49d01aa34207.png","goto":"0","param":"","uri":"bilibili://region/3","type":0,"children":[{"tid":28,"reid":3,"name":"原创音乐","logo":"","goto":"0","param":"","type":0},{"tid":29,"reid":3,"name":"音乐现场","logo":"","goto":"0","param":"","type":0},{"tid":30,"reid":3,"name":"VOCALOID·UTAU","logo":"","goto":"0","param":"","type":0},{"tid":31,"reid":3,"name":"翻唱","logo":"","goto":"0","param":"","type":0},{"tid":59,"reid":3,"name":"演奏","logo":"","goto":"0","param":"","type":0},{"tid":193,"reid":3,"name":"MV","logo":"","goto":"0","param":"","type":0},{"tid":243,"reid":3,"name":"乐评盘点","logo":"","goto":"0","param":"","type":0},{"tid":244,"reid":3,"name":"音乐教学","logo":"","goto":"0","param":"","type":0},{"tid":130,"reid":3,"name":"音乐综合","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":4,"reid":0,"name":"游戏","logo":"http://i0.hdslb.com/bfs/archive/9c88ce1adaecf31e27121bdbb5a29824d655d0a6.png","goto":"0","param":"","uri":"bilibili://region/4","type":0,"children":[{"tid":17,"reid":4,"name":"单机游戏","logo":"","goto":"0","param":"","type":0},{"tid":171,"reid":4,"name":"电子竞技","logo":"http://i0.hdslb.com/bfs/archive/0511bbb27a1f175a91bf34cfd46a8a8303e607bd.png","goto":"0","param":"","type":0},{"tid":172,"reid":4,"name":"手机游戏","logo":"http://i0.hdslb.com/bfs/archive/572945562c8f04437564ba37083f1c2c5ca9432b.png","goto":"0","param":"","type":0},{"tid":65,"reid":4,"name":"网络游戏","logo":"","goto":"0","param":"","type":0},{"tid":173,"reid":4,"name":"桌游棋牌","logo":"http://i0.hdslb.com/bfs/archive/95acf71eacc1cf1fa542d0dcbf3480bafaa6005c.png","goto":"0","param":"","type":0},{"tid":121,"reid":4,"name":"GMV","logo":"","goto":"0","param":"","type":0},{"tid":136,"reid":4,"name":"音游","logo":"","goto":"0","param":"","type":0},{"tid":19,"reid":4,"name":"Mugen","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":5,"reid":0,"name":"娱乐","logo":"http://i0.hdslb.com/bfs/archive/a9bcb4cb7e216c2ea28ba3dc10acd2d210f739bd.png","goto":"0","param":"","uri":"bilibili://region/5","type":0,"children":[{"tid":71,"reid":5,"name":"综艺","logo":"","goto":"0","param":"","type":0},{"tid":241,"reid":5,"name":"娱乐杂谈","logo":"","goto":"0","param":"","type":0},{"tid":242,"reid":5,"name":"粉丝创作","logo":"","goto":"0","param":"","type":0},{"tid":137,"reid":5,"name":"明星综合","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":11,"reid":0,"name":"电视剧","logo":"http://i0.hdslb.com/bfs/archive/30779a6904875754762e666b7076014528ef4834.png","goto":"0","param":"","uri":"bilibili://pgc/cinema/tv","type":0,"is_bangumi":1,"children":[{"tid":185,"reid":11,"name":"国产剧","logo":"","goto":"0","param":"","type":0},{"tid":187,"reid":11,"name":"海外剧","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":11,"reid":0,"name":"电视剧","logo":"http://i0.hdslb.com/bfs/archive/30779a6904875754762e666b7076014528ef4834.png","goto":"0","param":"","uri":"bilibili://pgc/partition_page?page_name=tv-operation\u0026title=%E7%94%B5%E8%A7%86%E5%89%A7\u0026select_id=1","type":0,"is_bangumi":1,"children":[{"tid":185,"reid":11,"name":"国产剧","logo":"","goto":"0","param":"","type":0},{"tid":187,"reid":11,"name":"海外剧","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":13,"reid":0,"name":"番剧","logo":"http://i0.hdslb.com/bfs/archive/6f629bd0dcd71d7b9911803f8e4f94fd0e5b4bfd.png","goto":"0","param":"","uri":"bilibili://pgc/partition_page?page_name=bangumi-operation\u0026title=%E7%95%AA%E5%89%A7\u0026select_id=1","type":1,"is_bangumi":1,"children":[{"tid":33,"reid":13,"name":"连载动画","logo":"http://i0.hdslb.com/bfs/archive/02c1ddbe698c4cba3c6db941047957d17b7910d7.png","goto":"0","param":"","type":0},{"tid":32,"reid":13,"name":"完结动画","logo":"http://i0.hdslb.com/bfs/archive/efb691127ea5b547b64431a59b27b278d6803172.png","goto":"0","param":"","type":0},{"tid":51,"reid":13,"name":"资讯","logo":"","goto":"0","param":"","type":0},{"tid":152,"reid":13,"name":"官方延伸","logo":"http://i0.hdslb.com/bfs/archive/8eb0bf53223544526bf99ec6f636758e2afed503.png","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"top"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":13,"reid":0,"name":"番剧","logo":"http://i0.hdslb.com/bfs/archive/6f629bd0dcd71d7b9911803f8e4f94fd0e5b4bfd.png","goto":"0","param":"","uri":"bilibili://pgc/bangumi","type":0,"is_bangumi":1,"children":[{"tid":33,"reid":13,"name":"连载动画","logo":"http://i0.hdslb.com/bfs/archive/02c1ddbe698c4cba3c6db941047957d17b7910d7.png","goto":"0","param":"","type":0},{"tid":32,"reid":13,"name":"完结动画","logo":"http://i0.hdslb.com/bfs/archive/efb691127ea5b547b64431a59b27b278d6803172.png","goto":"0","param":"","type":0},{"tid":51,"reid":13,"name":"资讯","logo":"","goto":"0","param":"","type":0},{"tid":152,"reid":13,"name":"官方延伸","logo":"http://i0.hdslb.com/bfs/archive/8eb0bf53223544526bf99ec6f636758e2afed503.png","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"top"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":13,"reid":0,"name":"番劇","logo":"http://i0.hdslb.com/bfs/archive/6f629bd0dcd71d7b9911803f8e4f94fd0e5b4bfd.png","goto":"0","param":"","uri":"bilibili://pgc/bangumi","type":1,"is_bangumi":1,"config":[{"scenes_name":"region","scenes_type":"top"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":23,"reid":0,"name":"电影","logo":"http://i0.hdslb.com/bfs/archive/137edde9deb7dfcdf610ed2d1ec63bae6ef3ba0a.png","goto":"0","param":"","uri":"bilibili://pgc/cinema/movie","type":0,"is_bangumi":1,"children":[{"tid":147,"reid":23,"name":"华语电影","logo":"","goto":"0","param":"","type":0},{"tid":145,"reid":23,"name":"欧美电影","logo":"","goto":"0","param":"","type":0},{"tid":146,"reid":23,"name":"日本电影","logo":"","goto":"0","param":"","type":0},{"tid":83,"reid":23,"name":"其他国家","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":36,"reid":0,"name":"知识","logo":"http://i0.hdslb.com/bfs/archive/d5bb279936dbe661f958683231566214056987b2.png","goto":"0","param":"","uri":"bilibili://region/36","type":0,"children":[{"tid":39,"reid":36,"name":"演講·公開課","logo":"","goto":"0","param":"","type":0},{"tid":95,"reid":36,"name":"數碼","logo":"","goto":"0","param":"","type":0},{"tid":98,"reid":36,"name":"機械","logo":"","goto":"0","param":"","type":0},{"tid":122,"reid":36,"name":"野生技能协会","logo":"","goto":"0","param":"","type":0},{"tid":124,"reid":36,"name":"社科·法律·心理","logo":"","goto":"0","param":"","type":0},{"tid":201,"reid":36,"name":"科学科普","logo":"","goto":"0","param":"","type":0},{"tid":207,"reid":36,"name":"财经商业","logo":"","goto":"0","param":"","type":0},{"tid":208,"reid":36,"name":"校园学习","logo":"","goto":"0","param":"","type":0},{"tid":209,"reid":36,"name":"职业职场","logo":"","goto":"0","param":"","type":0},{"tid":228,"reid":36,"name":"人文历史","logo":"","goto":"0","param":"","type":0},{"tid":229,"reid":36,"name":"设计·创意","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":119,"reid":0,"name":"鬼畜","logo":"http://i0.hdslb.com/bfs/archive/de50290b11c65108eb70766fa887032b948d2e4b.png","goto":"0","param":"","uri":"bilibili://region/119","type":0,"children":[{"tid":22,"reid":119,"name":"鬼畜调教","logo":"","goto":"0","param":"","type":0},{"tid":26,"reid":119,"name":"音MAD","logo":"","goto":"0","param":"","type":0},{"tid":126,"reid":119,"name":"人力VOCALOID","logo":"","goto":"0","param":"","type":0},{"tid":127,"reid":119,"name":"教程演示","logo":"","goto":"0","param":"","type":0},{"tid":216,"reid":119,"name":"鬼畜剧场","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":129,"reid":0,"name":"舞蹈","logo":"http://i0.hdslb.com/bfs/archive/4769a6faa9ccfde4a029eca36b979bac486afd14.png","goto":"0","param":"","uri":"bilibili://region/129","type":0,"children":[{"tid":20,"reid":129,"name":"宅舞","logo":"","goto":"0","param":"","type":0},{"tid":154,"reid":129,"name":"舞蹈综合","logo":"","goto":"0","param":"","type":0},{"tid":156,"reid":129,"name":"舞蹈教程","logo":"http://i0.hdslb.com/bfs/archive/c4a42b0d7df5e4eed9fa0980445f45fff6903c5c.png","goto":"0","param":"","type":0},{"tid":198,"reid":129,"name":"街舞","logo":"","goto":"0","param":"","type":0},{"tid":199,"reid":129,"name":"明星舞蹈","logo":"","goto":"0","param":"","type":0},{"tid":200,"reid":129,"name":"国风舞蹈","logo":"","goto":"0","param":"","type":0},{"tid":255,"reid":129,"name":"手势·网红舞","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":155,"reid":0,"name":"时尚","logo":"http://i0.hdslb.com/bfs/archive/1842562be5ded346d79312b24fafedbc1d78c8e2.png","goto":"0","param":"","uri":"bilibili://region/155","type":0,"children":[{"tid":157,"reid":155,"name":"美妆护肤","logo":"http://i0.hdslb.com/bfs/archive/3f6d8cc081e5dd413eda83527b5ca91fa51f5891.png","goto":"0","param":"","type":0},{"tid":158,"reid":155,"name":"穿搭","logo":"http://i0.hdslb.com/bfs/archive/5df77c1b13f20af22ec9f595f6a83f8b65d469a0.png","goto":"0","param":"","type":0},{"tid":159,"reid":155,"name":"时尚潮流","logo":"http://i0.hdslb.com/bfs/archive/5d5767ed736a2808e7bf9e74a58f1eb5eea963cd.png","goto":"0","param":"","type":0},{"tid":164,"reid":155,"name":"健身","logo":"http://i0.hdslb.com/bfs/archive/c5da2d170056227118594ab2c70d40ad9d0eed5c.png","goto":"0","param":"","type":0},{"tid":252,"reid":155,"name":"仿妆cos","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":160,"reid":0,"name":"生活","logo":"http://i0.hdslb.com/bfs/archive/50731fc4b9ec487ef2e3861a97e0eb4671b7bcef.png","goto":"0","param":"","uri":"bilibili://region/160","type":0,"children":[{"tid":21,"reid":160,"name":"日常","logo":"","goto":"0","param":"","type":0},{"tid":75,"reid":160,"name":"動物圈","logo":"","goto":"0","param":"","type":0},{"tid":76,"reid":160,"name":"美食圈","logo":"","goto":"0","param":"","type":0},{"tid":138,"reid":160,"name":"搞笑","logo":"","goto":"0","param":"","type":0},{"tid":161,"reid":160,"name":"手工","logo":"http://i0.hdslb.com/bfs/archive/f87bb34913e8f7eeef216aba813961c47117e783.png","goto":"0","param":"","type":0},{"tid":162,"reid":160,"name":"绘画","logo":"http://i0.hdslb.com/bfs/archive/e6b66a76eb07f2acffd00b8f8c1cc0ff57e75e53.png","goto":"0","param":"","type":0},{"tid":163,"reid":160,"name":"運動","logo":"http://i0.hdslb.com/bfs/archive/e6b66a76eb07f2acffd00b8f8c1cc0ff57e75e53.png","goto":"0","param":"","type":0},{"tid":250,"reid":160,"name":"出行","logo":"","goto":"0","param":"","type":0},{"tid":251,"reid":160,"name":"三农","logo":"","goto":"0","param":"","type":0},{"tid":239,"reid":160,"name":"家居房产","logo":"","goto":"0","param":"","type":0},{"tid":254,"reid":160,"name":"亲子","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":167,"reid":0,"name":"国创","logo":"http://i0.hdslb.com/bfs/archive/1586ec926eac1ea876cb74d32df51394d8e72341.png","goto":"0","param":"","uri":"bilibili://pgc/partition_page?page_name=gc-operation\u0026title=%E5%9B%BD%E5%88%9B\u0026select_id=1","type":1,"is_bangumi":1,"children":[{"tid":153,"reid":167,"name":"国产动画","logo":"","goto":"0","param":"","type":0},{"tid":168,"reid":167,"name":"国产原创相关","logo":"","goto":"0","param":"","type":0},{"tid":169,"reid":167,"name":"布袋戏","logo":"","goto":"0","param":"","type":0},{"tid":195,"reid":167,"name":"动态漫·广播剧","logo":"","goto":"0","param":"","type":0},{"tid":170,"reid":167,"name":"资讯","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"top"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":167,"reid":0,"name":"国创","logo":"http://i0.hdslb.com/bfs/archive/1586ec926eac1ea876cb74d32df51394d8e72341.png","goto":"0","param":"","uri":"bilibili://pgc/domestic","type":0,"is_bangumi":1,"children":[{"tid":153,"reid":167,"name":"国产动画","logo":"","goto":"0","param":"","type":0},{"tid":168,"reid":167,"name":"国产原创相关","logo":"","goto":"0","param":"","type":0},{"tid":169,"reid":167,"name":"布袋戏","logo":"","goto":"0","param":"","type":0},{"tid":195,"reid":167,"name":"动态漫·广播剧","logo":"","goto":"0","param":"","type":0},{"tid":170,"reid":167,"name":"资讯","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"top"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":167,"reid":0,"name":"國創","logo":"http://i0.hdslb.com/bfs/archive/1586ec926eac1ea876cb74d32df51394d8e72341.png","goto":"0","param":"","uri":"bilibili://pgc/domestic","type":1,"is_bangumi":1,"config":[{"scenes_name":"region","scenes_type":"top"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":177,"reid":0,"name":"纪录片","logo":"http://i0.hdslb.com/bfs/archive/884a644c6bb4b8bb16f9746ef35fbaba396e0b8c.png","goto":"0","param":"","uri":"bilibili://pgc/partition_page?page_name=documentary-operation\u0026title=%E7%BA%AA%E5%BD%95%E7%89%87\u0026select_id=1","type":1,"children":[{"tid":37,"reid":177,"name":"人文·历史","logo":"","goto":"0","param":"","type":0},{"tid":178,"reid":177,"name":"科学·探索·自然","logo":"","goto":"0","param":"","type":0},{"tid":179,"reid":177,"name":"军事","logo":"","goto":"0","param":"","type":0},{"tid":180,"reid":177,"name":"社会·美食·旅行","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"top"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":177,"reid":0,"name":"纪录片","logo":"http://i0.hdslb.com/bfs/archive/884a644c6bb4b8bb16f9746ef35fbaba396e0b8c.png","goto":"0","param":"","uri":"bilibili://pgc/cinema/doc","type":0,"children":[{"tid":37,"reid":177,"name":"人文·历史","logo":"","goto":"0","param":"","type":0},{"tid":178,"reid":177,"name":"科学·探索·自然","logo":"","goto":"0","param":"","type":0},{"tid":179,"reid":177,"name":"军事","logo":"","goto":"0","param":"","type":0},{"tid":180,"reid":177,"name":"社会·美食·旅行","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"},{"scenes_name":"region","scenes_type":"top"}]},{"tid":181,"reid":0,"name":"影视","logo":"http://i0.hdslb.com/bfs/archive/f90bb1ef59630ad9765486c6088a4944b96e88a3.png","goto":"0","param":"","uri":"bilibili://region/181","type":0,"children":[{"tid":182,"reid":181,"name":"影视杂谈","logo":"","goto":"0","param":"","type":0},{"tid":183,"reid":181,"name":"影视剪辑","logo":"","goto":"0","param":"","type":0},{"tid":85,"reid":181,"name":"小剧场","logo":"","goto":"0","param":"","type":0},{"tid":184,"reid":181,"name":"预告·资讯","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":188,"reid":0,"name":"科技","logo":"http://i0.hdslb.com/bfs/feed-admin/4a687a86b49feea68d423fd1bf2c461acfe59b70.png","goto":"0","param":"","uri":"bilibili://region/188","type":0,"children":[{"tid":95,"reid":188,"name":"数码","logo":"","goto":"0","param":"","type":0},{"tid":230,"reid":188,"name":"软件应用","logo":"","goto":"0","param":"","type":0},{"tid":231,"reid":188,"name":"计算机技术","logo":"","goto":"0","param":"","type":0},{"tid":232,"reid":188,"name":"科工机械","logo":"","goto":"0","param":"","type":0},{"tid":233,"reid":188,"name":"极客DIY","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"},{"scenes_name":"attention"}]},{"tid":202,"reid":0,"name":"资讯","logo":"https://i0.hdslb.com/bfs/legacy/d71e70e1bfcb7b27ffe88e6cb82868c68b084464.png","goto":"0","param":"","uri":"bilibili://region/202","type":0,"children":[{"tid":203,"reid":202,"name":"热点","logo":"","goto":"0","param":"","type":0},{"tid":204,"reid":202,"name":"环球","logo":"","goto":"0","param":"","type":0},{"tid":205,"reid":202,"name":"社会","logo":"","goto":"0","param":"","type":0},{"tid":206,"reid":202,"name":"综合","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"search"},{"scenes_name":"tag"},{"scenes_name":"attention"}]},{"tid":211,"reid":0,"name":"美食","logo":"http://i0.hdslb.com/bfs/feed-admin/0f5e21f08616f9c02d706433ba1c00bd5b889c7b.png","goto":"0","param":"","uri":"bilibili://region/211","type":0,"children":[{"tid":76,"reid":211,"name":"美食制作","logo":"","goto":"0","param":"","type":0},{"tid":212,"reid":211,"name":"美食侦探","logo":"","goto":"0","param":"","type":0},{"tid":213,"reid":211,"name":"美食测评","logo":"","goto":"0","param":"","type":0},{"tid":214,"reid":211,"name":"田园美食","logo":"","goto":"0","param":"","type":0},{"tid":215,"reid":211,"name":"美食记录","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":217,"reid":0,"name":"动物圈","logo":"http://i0.hdslb.com/bfs/feed-admin/9f3303b20e12ac874c379da09bca9ce4d0b2f88c.png","goto":"0","param":"","uri":"bilibili://region/217","type":0,"children":[{"tid":218,"reid":217,"name":"喵星人","logo":"","goto":"0","param":"","type":0},{"tid":219,"reid":217,"name":"汪星人","logo":"","goto":"0","param":"","type":0},{"tid":222,"reid":217,"name":"小宠异宠","logo":"","goto":"0","param":"","type":0},{"tid":221,"reid":217,"name":"野生动物","logo":"","goto":"0","param":"","type":0},{"tid":220,"reid":217,"name":"动物二创","logo":"","goto":"0","param":"","type":0},{"tid":75,"reid":217,"name":"动物综合","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"search"},{"scenes_name":"rank"},{"scenes_name":"tag"}]},{"tid":223,"reid":0,"name":"汽车","logo":"http://i0.hdslb.com/bfs/feed-admin/1515d944550494abf81b552a84484dce80287242.png","goto":"0","param":"","uri":"bilibili://region/223","type":0,"children":[{"tid":245,"reid":223,"name":"赛车","logo":"","goto":"0","param":"","type":0},{"tid":246,"reid":223,"name":"改装玩车","logo":"","goto":"0","param":"","type":0},{"tid":247,"reid":223,"name":"新能源车","logo":"","goto":"0","param":"","type":0},{"tid":248,"reid":223,"name":"房车","logo":"","goto":"0","param":"","type":0},{"tid":240,"reid":223,"name":"摩托车","logo":"","goto":"0","param":"","type":0},{"tid":227,"reid":223,"name":"购车攻略","logo":"","goto":"0","param":"","type":0},{"tid":176,"reid":223,"name":"汽车生活","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":234,"reid":0,"name":"运动","logo":"http://i0.hdslb.com/bfs/feed-admin/56a67fa38d8d7378ab4154307d26cffce2d1ae3f.png","goto":"0","param":"","uri":"bilibili://region/234","type":0,"children":[{"tid":235,"reid":234,"name":"篮球","logo":"","goto":"0","param":"","type":0},{"tid":249,"reid":234,"name":"足球","logo":"","goto":"0","param":"","type":0},{"tid":164,"reid":234,"name":"健身","logo":"","goto":"0","param":"","type":0},{"tid":236,"reid":234,"name":"竞技体育","logo":"","goto":"0","param":"","type":0},{"tid":237,"reid":234,"name":"运动文化","logo":"","goto":"0","param":"","type":0},{"tid":238,"reid":234,"name":"运动综合","logo":"","goto":"0","param":"","type":0}],"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"rank"},{"scenes_name":"search"},{"scenes_name":"tag"}]},{"tid":65537,"reid":0,"name":"直播","logo":"http://i0.hdslb.com/bfs/archive/1b0ac7eafd51b03a0dc5b2390eec2fbffb25adf7.png","goto":"0","param":"","uri":"bilibili://home/?tab=直播","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65539,"reid":0,"name":"游戏中心","logo":"http://i0.hdslb.com/bfs/archive/656df3124c81dd0e19bdc0a3e017091268b3db73.jpg","goto":"0","param":"","uri":"bilibili://game_center","type":1,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65541,"reid":0,"name":"专栏","logo":"http://i0.hdslb.com/bfs/archive/a0c0e133644c47d6263cf24cf8364e2106c102c3.png","goto":"0","param":"","uri":"bilibili://article/category/","type":1,"config":[{"scenes_name":"region","scenes_type":"bottom"},{"scenes_name":"search"}]},{"tid":65541,"reid":0,"name":"专栏","logo":"http://i0.hdslb.com/bfs/archive/a0c0e133644c47d6263cf24cf8364e2106c102c3.png","goto":"0","param":"","uri":"bilibili://article/category/","type":0,"config":[{"scenes_name":"region","scenes_type":"top"}]},{"tid":65545,"reid":0,"name":"放映厅","logo":"http://i0.hdslb.com/bfs/archive/3dfba664353bb2349917eaf81b60db34b2d4c61a.png","goto":"0","param":"","uri":"bilibili://pgc/cinema","type":1,"config":[{"scenes_name":"region","scenes_type":"top"}]},{"tid":65549,"reid":0,"name":"工房集市","logo":"http://i0.hdslb.com/bfs/feed-admin/d89a76f987820ffa3c7d5c62789ebd784c68ac07.png","goto":"0","param":"","uri":"https://mall.bilibili.com/neul-next/index.html?page=mall-up_market\u0026noTitleBar=1\u0026msource=js_subarea","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65550,"reid":0,"name":"游戏赛事","logo":"http://i0.hdslb.com/bfs/archive/a93687a7f29da88ee375109389b0634412847bd1.png","goto":"0","param":"","uri":"https://www.bilibili.com/h5/match/data/home?navhide=1","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65550,"reid":0,"name":"遊戲賽事","logo":"http://i0.hdslb.com/bfs/archive/a93687a7f29da88ee375109389b0634412847bd1.png","goto":"0","param":"","uri":"https://www.bilibili.com/h5/game/home?navhide=1","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65551,"reid":0,"name":"小黑屋","logo":"http://i0.hdslb.com/bfs/archive/ed4f676e8c1f1029b8e37e2f567875b682e632ce.png","goto":"0","param":"","uri":"https://www.bilibili.com/blackroom","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65552,"reid":0,"name":"全区排行榜","logo":"http://i0.hdslb.com/bfs/archive/34f46c749054b1c3c157b0c1c09a5ef2b3539204.png","goto":"0","param":"","uri":"bilibili://rank/","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65553,"reid":0,"name":"活动中心","logo":"http://i0.hdslb.com/bfs/archive/3e2e6d338aa8156dc6f63c5dc8c75ed298c5cc9a.png","goto":"0","param":"","uri":"bilibili://activity_center/","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65555,"reid":0,"name":"漫画","logo":"http://i0.hdslb.com/bfs/archive/d260e72fb98251dabe4f64858f65cc697a71587e.png","goto":"0","param":"","uri":"bilibili://comic/home?from=manga_channel","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65555,"reid":0,"name":"漫画","logo":"http://i0.hdslb.com/bfs/archive/d260e72fb98251dabe4f64858f65cc697a71587e.png","goto":"0","param":"","uri":"bilibili://comic/home?from=ipadmanga_channel","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65556,"reid":0,"name":"原創排行榜","logo":"http://i0.hdslb.com/bfs/archive/5f232dbcb590e81dbd3dab6d2c906cff70547841.png","goto":"0","param":"","uri":"bilibili://rank?type=original","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65557,"reid":0,"name":"公开课","logo":"http://i0.hdslb.com/bfs/feed-admin/99366a6ea47d7790f57699112bc1d0c6d5f0d302.png","goto":"0","param":"","uri":"https://www.bilibili.com/h5/mooc?navhide=1","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65559,"reid":0,"name":"VLOG","logo":"http://i0.hdslb.com/bfs/archive/c794e8220a8cbe3d83b83e76e753c57df67b036a.png","goto":"0","param":"","uri":"https://www.bilibili.com/h5/vlog?from=2","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65560,"reid":0,"name":"课堂","logo":"http://i0.hdslb.com/bfs/archive/7400e63e28ab9933a3fa8adb3bd63e3a20911641.png","goto":"0","param":"","uri":"https://m.bilibili.com/cheese/home?navhide=1","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65561,"reid":0,"name":"专题中心","logo":"http://i0.hdslb.com/bfs/archive/5c15009ace7f8bbb22c5b46cee3995525bbd9ed0.png","goto":"0","param":"","uri":"bilibili://topic/","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":65563,"reid":0,"name":"新歌热榜","logo":"http://i0.hdslb.com/bfs/archive/518ba4a46b8ca94c0f29397e09acb345020fb867.png","goto":"0","param":"","uri":"https://www.bilibili.com/h5/musicplus?navhide=1","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]}],
				"modify":[{"tid":6544,"reid":0,"name":"番劇(港澳台)","logo":"http://i0.hdslb.com/bfs/archive/6f629bd0dcd71d7b9911803f8e4f94fd0e5b4bfd.png","goto":"0","param":"","uri":"bilibili://following/home_bottom_tab_activity_tab/6544","type":0,"is_bangumi":1,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":95636,"reid":0,"name":"韩综(港澳台)","logo":"http://i0.hdslb.com/bfs/archive/a9bcb4cb7e216c2ea28ba3dc10acd2d210f739bd.png","goto":"0","param":"","uri":"bilibili://following/home_bottom_tab_activity_tab/95636","type":0,"is_bangumi":1,"config":[{"scenes_name":"region","scenes_type":"bottom"}]},{"tid":168312,"reid":0,"name":"節目(港澳台)","logo":"http://i0.hdslb.com/bfs/archive/f90bb1ef59630ad9765486c6088a4944b96e88a3.png","goto":"0","param":"","uri":"bilibili://following/home_bottom_tab_activity_tab/168312","type":0,"config":[{"scenes_name":"region","scenes_type":"bottom"}]}]
			}
		}
	},
	"Global":{
		"Settings":{
			"Switch":"true",
			"ForceHost":"1",
			"Locales":["CHN","HKG","TWN"],
			"Proxies":{"CHN":"DIRECT","HKG":"🇭🇰香港","MAC":"🇲🇴澳门","TWN":"🇹🇼台湾"}
		}
	},
	"Roaming":{
		"Settings":{
			"Switch":"true",
			"Proxy":{
				"Pool":["xn--2vrub.plus","api.qiu.moe","xn--2vrub.icu","xn--n4yr07d.xn--6qq986b3xl","xn--3dz622b.xn--n4y597a0mfle743a.icu","bili.tuturu.top","xn--7rv796dvkm.xn--6qq986b3xl","xn--7ovr3tf1cxr4d.fun","xn--8fv56a330gjea.icu","xn--qoqt3y678a.xn--6qq986b3xl","atri.ink","xn--kiv440b.xn--6qq986b3xl","xn--w4r620anpl.xn--oor00vs23b.icu","xn--chqwq129p.pch.pub","melusinesuki.site","bili.takami.ink"],
				"Customs":""
			}
		}
	},
	"Default": {
		"Settings":{"Switch":"true"}
	}
};

/***************** Processing *****************/
(async () => {
	const { Settings, Caches, Configs } = setENV("BiliBili", "Enhanced", DataBase);
	$.log(`⚠ ${$.name}`, `Settings.Switch: ${Settings?.Switch}`, "");
	switch (Settings?.Switch) {
		case "true":
		default:
			let url = URL.parse($request?.url);
			const METHOD = $request?.method, HOST = url?.host, PATH = url?.path, PATHs = PATH.split("/");
			// 解析格式
			const FORMAT = ($response?.headers?.["Content-Type"] ?? $response?.headers?.["content-type"])?.split(";")?.[0];
			$.log(`⚠ ${$.name}`, `METHOD: ${METHOD}`, `HOST: ${HOST}`, `PATH: ${PATH}`, `PATHs: ${PATHs}`, `FORMAT: ${FORMAT}`, "");
			// 创建空数据
			let body = { "code": 0, "message": "0", "data": {} };
			// 格式判断
			switch (FORMAT) {
				case undefined: // 视为无body
					break;
				case "application/x-www-form-urlencoded":
				case "text/plain":
				case "text/html":
				default:
					break;
				case "text/xml":
				case "text/plist":
				case "application/xml":
				case "application/plist":
				case "application/x-plist":
					break;
				case "text/json":
				case "application/json":
					body = JSON.parse($response.body);
					// 解析链接
					switch (HOST) {
						case "www.bilibili.com":
							break;
						case "app.bilibili.com":
						case "app.biliapi.net":
							// 先保存一下AccessKey
							/*
							if (url?.params?.access_key) {
								let newCaches = $.getjson("@BiliBili.Global.Caches", {});
								newCaches.AccessKey = url.params.access_key; // 总是刷新
								$.log(`newCaches = ${JSON.stringify(newCaches)}`);
								let isSave = $.setjson(newCaches, "@BiliBili.Global.Caches");
								$.log(`$.setjson ? ${isSave}`);
							};
							*/
							switch (PATH) {
								case "x/resource/top/activity": { // 右上角活動
									if (body.data) {
										let data = body.data;
										data.hash = "9453";
										data.online.icon = "";
									} else break;
								};
								case "x/resource/show/tab/v2": { // 首页-Tab
									let data = body.data;
									// 顶栏-左侧
									data.top_left = Configs.Tab.top_left[Settings.Home.Top_left];
									// 顶栏-右侧
									data.top = Configs.Tab.top.map(e => {
										if (Settings.Home.Top.includes(e.tab_id)) return e;
									}).filter(Boolean).map((e, i) => {
										e.pos = i + 1;
										return e;
									});
									// 标签栏
									data.tab = Configs.Tab.tab.map(e => {
										if (Settings.Home.Tab.includes(e.tab_id)) return e;
									}).filter(Boolean).map((e, i) => {
										if (Settings.Home.Tab_default == e.tab_id) e.default_selected = 1;
										e.pos = i + 1;
										return e;
									});
									// 底部导航栏
									data.bottom = Configs.Tab.bottom.map(e => {
										if (Settings.Bottom.includes(e.tab_id)) return e;
									}).filter(Boolean).map((e, i) => {
										e.pos = i + 1;
										return e;
									});
									break;
								};
								case "x/resource/show/tab/bubble": // 首页-Tab-?
									break;
								case "x/v2/account/mine": { // 账户信息-我的
									let data = body.data;
									data.sections_v2 = Configs.Mine.sections_v2.map(e => {
										switch (e.title) {
											case "创作中心":
												e.items = e.items.map(item => {
													if (Settings.Mine.CreatorCenter.includes(item.id.toString())) return item;
												}).filter(Boolean);
												break;
											case "推荐服务":
												e.items = e.items.map(item => {
													if (Settings.Mine.Recommend.includes(item.id.toString())) return item;
												}).filter(Boolean);
												break;
											case "更多服务":
												e.items = e.items.map(item => {
													if (Settings.Mine.More.includes(item.id.toString())) return item;
												}).filter(Boolean);
												break;
										};
										if (!e.items.some(() => true)) e = {};
										return e;
									});
									break;
								};
								case "x/v2/region/index":
								case "x/v2/channel/region/list": { // 分区页面-索引
									let data = body.data ?? [];
									data.push(...Configs.Region.index, ...Configs.Region.modify); // 末尾插入全部分区
									//$.log(JSON.stringify(data));
									data = uniqueFunc(data, "tid"); // 去重
									//$.log(JSON.stringify(data));
									data = data.sort(compareFn("tid")); // 排序
									//$.log(JSON.stringify(data));
									data = data.map(e => { // 过滤
										if (Settings.Region.includes(e.tid.toString())) return e;
									}).filter(Boolean);
									//$.log(JSON.stringify(data));

									switch (PATH) { // 特殊处理
										case "x/v2/region/index":
											break;
										case "x/v2/channel/region/list":
											data = data.map(e => {
												if (e.goto == "0") e.goto = "";
												delete e.children;
												delete e.config;
												return e;
											});
											break;
									};
									body.data = data;

									function uniqueFunc(array, property) { // 数组去重
										const res = new Map();
										return array.filter((item) => !res.has(item[property]) && res.set(item[property], 1));
									};

									function compareFn(property) { // 比较函数
										return function (m, n) {
											var a = m[property];
											var b = n[property];
											return a - b; // 升序
										}
									};
									break;
								};
							};
							break;
						case "api.bilibili.com":
						case "api.biliapi.net":
							break;
					};
					$response.body = JSON.stringify(body);
					break;
				case "application/x-protobuf":
				case "application/grpc":
				case "application/grpc+proto":
				case "applecation/octet-stream":
					break;
			};
			break;
		case "false":
			break;
	};
})()
	.catch((e) => $.logErr(e))
	.finally(() => {
		switch ($response) {
			default: { // 有回复数据，返回回复数据
				const FORMAT = ($response?.headers?.["Content-Type"] ?? $response?.headers?.["content-type"])?.split(";")?.[0];
				$.log(`🎉 ${$.name}, finally`, `$response`, `FORMAT: ${FORMAT}`, "");
				//$.log(`🚧 ${$.name}, finally`, `$response: ${JSON.stringify($response)}`, "");
				if ($response?.headers?.["Content-Encoding"]) $response.headers["Content-Encoding"] = "identity";
				if ($response?.headers?.["content-encoding"]) $response.headers["content-encoding"] = "identity";
				if ($.isQuanX()) {
					switch (FORMAT) {
						case undefined: // 视为无body
							// 返回普通数据
							$.done({ headers: $response.headers });
							break;
						case "application/x-www-form-urlencoded":
						case "text/plain":
						case "text/html":
						case "text/xml":
						case "text/plist":
						case "application/xml":
						case "application/plist":
						case "application/x-plist":
						case "text/json":
						case "application/json":
						default:
							// 返回普通数据
							$.done({ headers: $response.headers, body: $response.body });
							break;
						case "application/x-protobuf":
						case "application/grpc":
						case "application/grpc+proto":
						case "applecation/octet-stream":
							// 返回二进制数据
							//$.log(`${$response.bodyBytes.byteLength}---${$response.bodyBytes.buffer.byteLength}`);
							$.done({ headers: $response.headers, bodyBytes: $response.bodyBytes.buffer.slice($response.bodyBytes.byteOffset, $response.bodyBytes.byteLength + $response.bodyBytes.byteOffset) });
							break;
					};
				} else $.done($response);
				break;
			};
			case undefined: { // 无回复数据
				break;
			};
		};
	})

/***************** Function *****************/
/**
 * Set Environment Variables
 * @author VirgilClyne
 * @param {String} name - Persistent Store Key
 * @param {String} platform - Platform Name
 * @param {Object} database - Default DataBase
 * @return {Object} { Settings, Caches, Configs }
 */
function setENV(name, platform, database) {
	$.log(`⚠ ${$.name}, Set Environment Variables`, "");
	let { Settings, Caches, Configs } = getENV(name, platform, database);
	/***************** Prase *****************/
	traverseObject(Settings, (key, value) => value.includes(",") ? value.split(",") : value );
	$.log(`🎉 ${$.name}, Set Environment Variables`, `Settings: ${typeof Settings}`, `Settings内容: ${JSON.stringify(Settings)}`, "");
	/***************** Caches *****************/
	//$.log(`🎉 ${$.name}, Set Environment Variables`, `Caches: ${typeof Caches}`, `Caches内容: ${JSON.stringify(Caches)}`, "");
	/***************** Configs *****************/
	return { Settings, Caches, Configs };

	function traverseObject(o,c){for(var t in o){var n=o[t];o[t]="object"==typeof n&&null!==n?traverseObject(n,c):c(t,n)}return o}
};

/***************** Env *****************/
// prettier-ignore
// https://github.com/chavyleung/scripts/blob/master/Env.min.js
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,a)=>s(a))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),a)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),e+=`${s}=${a}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",a="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t);break;case"Node.js":this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}

// https://github.com/DualSubs/URL/blob/main/URLs.embedded.min.js
function URLs(s){return new class{constructor(s=[]){this.name="URL v1.0.2",this.opts=s,this.json={scheme:"",host:"",path:"",params:{}}}parse(s){let t=s.match(/(?<scheme>.+):\/\/(?<host>[^/]+)\/?(?<path>[^?]+)?\??(?<params>.*)?/)?.groups??null;return t?.path||(t.path=""),t?.params&&(t.params=Object.fromEntries(t.params.split("&").map((s=>s.split("="))))),t}stringify(s=this.json){return s?.params?s.scheme+"://"+s.host+"/"+s.path+"?"+Object.entries(s.params).map((s=>s.join("="))).join("&"):s.scheme+"://"+s.host+"/"+s.path}}(s)}

/**
 * Get Environment Variables
 * @link https://github.com/VirgilClyne/VirgilClyne/blob/main/function/getENV/getENV.min.js
 * @author VirgilClyne
 * @param {String} t - Persistent Store Key
 * @param {String} e - Platform Name
 * @param {Object} n - Default Database
 * @return {Object} { Settings, Caches, Configs }
 */
function getENV(t,e,n){let i=$.getjson(t,n),s={};if("undefined"!=typeof $argument&&Boolean($argument)){let t=Object.fromEntries($argument.split("&").map((t=>t.split("="))));for(let e in t)l(s,e,t[e])}let g={...n?.Default?.Settings,...n?.[e]?.Settings,...i?.[e]?.Settings,...s},f={...n?.Default?.Configs,...n?.[e]?.Configs,...i?.[e]?.Configs},o=i?.[e]?.Caches||{};return"string"==typeof o&&(o=JSON.parse(o)),{Settings:g,Caches:o,Configs:f};function l(t,e,n){e.split(".").reduce(((t,i,s)=>t[i]=e.split(".").length===++s?n:t[i]||{}),t)}}
/**
 * Created by fly on 2017/8/9.
 */


var worksid = '1797800906';
///worksid = '3845608200';
var data = {
	wxappid: 'wxec2401ee9a70f3d9',
	wxappsecret: 'fc2c8e7c243da9e8898516fa5da8cbbb'
}

/*data = {
	wxappid: 'wxfacf4a639d9e3bcc',
	wxappsecret: "149cdef95c99ff7cab523d8beca86080"
}*/
var zmitiUtil = {

	init: function() {
		var data = {
			left: .6 * document.documentElement.clientWidth / 10 / 2,
			top: 30,
			timespan: 1000
		}

		function Halo(obj, left, top) {
			var left = left;
			var top = top;

			obj.append('<div class="dot" style="top:' + top + 'px;left:' + left + 'px;"></div>')
			setTimeout(function() {
				obj.find('.dot:first-of-type').remove();
			}, 2500);
		}

		var container = $("#container");

		function loop() {
			var time = 200;
			setTimeout(function() {
				Halo(container, data.left, data.top);
			}, time)

			setTimeout(function() {
				Halo(container, data.left, data.top);
			}, time + data.timespan)

			/*setTimeout(function() {
				Halo($("#container"), data.left, data.top);
			}, time + data.timespan * 3)*/
		}
		loop();
		setInterval(function() {
			loop();
		}, 2500);

		this.bindEvent();

		//

		this.wxConfig('我是中国文明网网友，让我们一起为九寨沟祈福！', document.title, 'http://h5.zmiti.com/public/SC-earthquake/assets/images/300.jpg');
		this.getOauthurl();

		//this.wxConfig('#一份来自中国文明网网友的善提醒#都在关注九寨沟地震，这件事你是否忽略了', document.title, 'http://h5.zmiti.com/public/SC-earthquake/assets/images/300.jpg', undefined, location.href.split('#')[0]);
	},


	changeURLPar: function(destiny, par, par_value) {
		var pattern = par + '=([^&]*)';
		var replaceText = par + '=' + par_value;
		if (destiny.match(pattern)) {
			var tmp = '/\\' + par + '=[^&]*/';
			tmp = destiny.replace(eval(tmp), replaceText);
			return (tmp);
		} else {
			if (destiny.match('[\?]')) {
				return destiny + '&' + replaceText;
			} else {
				return destiny + '?' + replaceText;
			}
		}
		return destiny + '\n' + par + '\n' + par_value;
	},

	bindEvent: function() {
		$('#mask').on('touchstart', function() {
			$(this).hide();
		});
		$('.zmiti-share').on('touchstart', function() {
			$('#mask').show();
		})
	},
	isWeiXin: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},

	wxConfig: function(title, desc, img, url) {
		var s = this;
		var appId = 'wxfacf4a639d9e3bcc'; //'wxfacf4a639d9e3bcc'; // data.wxappid; // 'wxfacf4a639d9e3bcc'; //data.wxappid;

		var durl = url || location.href.split('#')[0];



		var code_durl = encodeURIComponent(durl);



		$.ajax({
			type: 'get',
			url: "http://api.zmiti.com/weixin/jssdk.php?type=signature&durl=" + code_durl,
			dataType: 'jsonp',
			jsonp: "callback",
			jsonpCallback: "jsonFlickrFeed",
			error() {

			},
			success(data) {
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: appId, // 必填，公众号的唯一标识
					timestamp: '1488558145', // 必填，生成签名的时间戳
					nonceStr: 'Wm3WZYTPz0wzccnW', // 必填，生成签名的随机串
					signature: data.signature, // 必填，签名，见附录1
					jsApiList: ['checkJsApi',
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareQQ',
							'onMenuShareWeibo',
							'hideMenuItems',
							'showMenuItems',
							'hideAllNonBaseMenuItem',
							'showAllNonBaseMenuItem'
						] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});

				wx.ready(() => {

					//朋友圈

					wx.onMenuShareTimeline({
						title: title, // 分享标题
						link: durl, // 分享链接
						imgUrl: img, // 分享图标
						desc: desc,
						success: function() {},
						cancel: function() {}
					});
					//朋友
					wx.onMenuShareAppMessage({
						title: title, // 分享标题
						link: durl,
						imgUrl: img, // 分享图标
						type: "link",
						dataUrl: "",
						desc: desc,
						success: function() {},
						cancel: function() {}
					});
					//qq
					wx.onMenuShareQQ({
						title: title, // 分享标题
						link: durl, // 分享链接
						imgUrl: img, // 分享图标
						desc: desc,
						success: function() {},
						cancel: function() {}
					});
				});
			}
		});

	},
	getQueryString: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return (r[2]);
		return null;
	},

	getOauthurl: function() {
		var s = this;
		$.ajax({
			type: 'post',
			url: 'http://api.zmiti.com/v2/weixin/getwxuserinfo/',
			data: {
				code: s.getQueryString('code'),
				wxappid: data.wxappid,
				wxappsecret: data.wxappsecret
			},
			error(e) {},
			success(dt) {

				if (dt.getret === 0) {
					s.openid = dt.userinfo.openid;
					s.nickname = dt.userinfo.nickname;
					s.headimgurl = dt.userinfo.headimgurl;

					$('.zmiti-name span').html(s.getQueryString('nickname') || s.nickname);

					var url = window.location.href;


					//
					setTimeout(function() {
						url = s.changeURLPar(url, 'nickname', s.nickname);
						url = url.split('#')[0];
						s.wxConfig('我是' + s.nickname + '，让我们一起为九寨沟祈福！', document.title, 'http://h5.zmiti.com/public/SC-earthquake/assets/images/300.jpg', url);

					}, 2000)
				} else {
					if (s.isWeiXin()) {


						var nickname = s.getQueryString('nickname');

						var redirect_uri = window.location.href.split('?')[0];
						var symbol = redirect_uri.indexOf('?') > -1 ? '&' : '?';
						if (nickname) {
							redirect_uri = s.changeURLPar(redirect_uri, 'nickname', nickname);
						}



						//url = s.changeURLPar(url, 'nickname', 'zmiti');
						$.ajax({
							url: 'http://api.zmiti.com/v2/weixin/getoauthurl/',
							type: 'post',
							data: {
								redirect_uri: redirect_uri,
								scope: 'snsapi_userinfo',
								worksid: worksid,
								state: new Date().getTime() + ''
							},
							error() {},
							success(dt) {
								if (dt.getret === 0) {

									window.location.href = dt.url;
								}
							}
						})
					} else {

						$('.zmiti-name span').html('中国文明网网友')



					}

				}


			}
		});
	}

};

zmitiUtil.init();
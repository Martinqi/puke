var sendTime = 60;
var sendFlag = true;
var imageCode;
var isLogin, isSend = false;
var configUrl = {}; //当前环境的参数 imgURL和sendURL
var imgcodeconfig = (function() {
	//当前模式
	var imgcode = {
		//生产环境
		pro: {
			imgURL: 'https://service.chinaums.com/uis-wxfront/wx/imageCode/create?'
		},
		//16测试环境
		pm: {
			imgURL: 'http://210.22.91.77:20081/uis-wxfront/wx/imageCode/create?'
		},
		//本地测试环境
		dev: {
			imgURL: 'http://localhost:8091/UisWxFront/wx/imageCode/create?'
		}
	};

	if(current == "pro") {
		configUrl = imgcode.pro;
	} else if(current == 'pm') {
		configUrl = imgcode.pm
	} else if(current == 'dev') {
		configUrl = imgcode.dev
	}
})();

$(function() {
	$(".codeImg").attr('src', configUrl.imgURL + (new Date()).Format("yyyyMMddhhmmss"));
	$(".codeImg").click(function() {
		$(".codeImg").attr('src', configUrl.imgURL + (new Date()).Format("yyyyMMddhhmmss"));
	});
	/**
	$("#phone").val("18568400138");
	$("#tyzm").val("18568");
	$("#yzm").val("185684");
	inputChange();*/
	
});

//输入内容提交按钮可用
function inputChange() {
	//手机号码
	var phone = $("#phone").val();
	//验证码
	var validatecode = $("#yzm").val();
	//图形验证码
	var tyzm = $("#tyzm").val();
	if(phone.length > 0 && tyzm.length > 0) {
        if($("#sendCode").val() == "获取验证码") {
            $("#sendCode").css("background-image", "linear-gradient(90deg, #3AC1FF 0%, #3A8BFF 100%)");
            isSend = true;
        }
	    if(validatecode.length > 0) {
			isLogin = true;
			$("#submit").css("background-image", "linear-gradient(90deg, #3AC1FF 0%, #3A8BFF 100%)");
		} else {
			isLogin = false;
			$("#submit").css("background-image", "url('img/kj11.jpg')")
		}
	} else {
		isSend = false;
		isLogin = false;
		$("#submit").css("background-image", "url('img/kj11.jpg')")
		$("#sendCode").css({
			"background-image":"url('img/kj22.png')",
			"background-size":"cover"

		})
	}
}

function register() {
	if(isLogin) {
		var authcode = validate({});
		if(authcode) {
			isLogin = false;
			//请求日期
			var appRequestDate = new Date().Format("yyyyMMddhhmmss");
			//手机号码
			var phone = $("#phone").val();
			//验证码
			var validatecode = $("#yzm").val();
			//ajax请求注册
			umswxapi.loadingBox();
			var urlData = umswxapi.getURLData();
			var param = {
						"service":"proActivityRegisterForWx",
						"appRequestDate":appRequestDate,
						"mobilePhone":phone,
						"authCode":validatecode,
						"ACode":"A0002",
						"ADescription":"0Yuan",
						"userAppId":urlData["userAppId"]?urlData["userAppId"]:"",
						"userMobile":urlData["userMobile"]?urlData["userMobile"]:"",
						"sign":urlData["sign"]
						};
			
			var sendJSON = JSON.stringify(param);
			sendJSON.type_ajax = "post";
			umswxapi.ajax(sendJSON, function(data) {
				if(data.responseCode == "000000") {
					umswxapi.loadingBoxauto(data.responseDesc,1000);
					//注册成功，跳转
					location.href ="http://app.chinaums.com/app/filedownload?appid=2844";
				} else {
					//关闭加载框
					umswxapi.closeLoading();
					if("SIGN001" == data.responseCode){
						umswxapi.loadingBoxauto("请求非法",3000);
					}else{
						umswxapi.loadingBoxauto(data.responseDesc,3000);
					}
				}
				//提交按钮是否可用
				isLogin = true;
			})
		}
	}

}

/**
 * 验证
 * @exclude:忽略的验证
 */
function validate(exclude) {
	//判断手机号
	var phone = $("#phone").val();
	//判断验证码
	var validateCode = $("#yzm").val();
	//判断图形验证码
	var tyzm = $("#tyzm").val();
	imageCode = tyzm ;
	//最新手机正则表达式
	var moble = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
	if(!exclude["phone"] && (!moble.test(phone))) {
		umswxapi.loadingBoxauto("请输入正确的手机号码",3000);
		return false;
	} else if(!exclude["validateCode"] && (validateCode.trim() == null || validateCode.trim() == "" || validateCode.trim().length != 6)) {
		umswxapi.loadingBoxauto("请输入正确的短信验证码",3000);
		return false;
	} else if(!exclude["tyzm"] && (tyzm.trim() == null || tyzm.trim() == "" || tyzm.trim().length != 5)) {
		umswxapi.loadingBoxauto("请输入正确的图形验证码",3000);
		return false;
	} else {
		return true;
	}

}
/**
 * 获取手机验证码
 */
function sendCodes() {
	//验证可以发送，并且详细验证除手机验证码外的验证
	if(isSend && validate({"validateCode":true})) {
		if($("#sendCode").val() == "获取验证码") {
			//获取手机号码
			var mobleNo = $("#phone").val();
			//最新手机正则表达式
			var moble = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			//验证正则
			if(moble.test(mobleNo)) {
				if(!sendFlag) {
					return false;
				}
				//ajax请求验证码
				var param = {
					"appRequestDate": (new Date()).Format("yyyyMMddhhmmss"),
					"service": "proAuthcodeSend",
					"mobilePhone": mobleNo,
					"imageCode": imageCode
				};
				var sendJSON = JSON.stringify(param);
				sendJSON.type_ajax = "post";
				console.log(sendJSON);
				umswxapi.ajax(sendJSON, function(data) {
					if(data.responseCode == "000000") {
						//短信发送成功
						$("#sendCode").val("发送中…");
						var sendInerval = setInterval(function() {
							$("#sendCode").val("[" + sendTime + "]重新发送");
							$("#sendCode").css({
								"background-image": "none",
								"background": "#ccc"
							});

							//数字更新
							sendTime--;
							if(sendTime == 0) {
								//初始化数据
								sendTime = 60;
								sendFlag = true;
								//获取验证码组件显示内容为:获取验证码，且更新组件背景色
								$("#sendCode").val("获取验证码");
								$("#sendCode").css("background-image", "linear-gradient(90deg, #3AC1FF 0%, #3A8BFF 100%)");
								clearInterval(sendInerval);
							}
						}, 1000);
						sendFlag = false;
					} else {
						umswxapi.loadingBoxauto(data.responseDesc,3000);
					}
				})
			} else {
				umswxapi.loadingBoxauto("请输入正确的手机号！",3000);
			}
		}
	}

}

/**
 * 时间格式化
 * @param {Object} fmt
 */
Date.prototype.Format = function(fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
//弹出活动规则
function show() {
	$(".shape").css('display', 'block')
}

function hide() {
	$(".shape").css('display', 'none')
}
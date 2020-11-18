<template>
	<div id="app">
		{{ran}}
		<br>
		<button @click="change">切换</button>
	</div>
</template>



<script>
	function ajaxSync(url, data) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var responseValue = xhr.responseText;
			}
		};
		//true：异步；false：同步
		xhr.open(
			"POST",
			url,
			false
		);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(data && JSON.stringify(data));
	}

	function myBrowser() {
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		var isOpera = userAgent.indexOf("Opera") > -1;
		if (isOpera) {
			return "Opera"
		}; //判断是否Opera浏览器
		if (userAgent.indexOf("Firefox") > -1) {
			return "FF";
		} //判断是否Firefox浏览器
		if (userAgent.indexOf("Chrome") > -1) {
			return "Chrome";
		}
		if (userAgent.indexOf("Safari") > -1) {
			return "Safari";
		} //判断是否Safari浏览器
		if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
			return "IE";
		}; //判断是否IE浏览器
	}
	import axios from 'axios';

	function postData(type) {
		const data = myBrowser() + '：' + Math.random();
		const ip = `http://192.168.13.61:3000`
		// const ip = `http://localhost:3000`
		localStorage[type] = data;
		ajaxSync(`${ip}/`, {
			[type]: myBrowser() + '：' + Math.random()
		})
		/* axios.get(`${ip}?${type}=${myBrowser() + '：' + Math.random()}`)
		axios.post(`${ip}/` + type, {
			[type]: myBrowser() + '：' + Math.random()
		}) */
	}
	export default {
		data() {
			return {
				ran: Math.random()
			}
		},
		mounted() {
			/* 
				浏览器会不稳定的触发接口事件，接口传参时有时无
			 */

			/* 
				console时触发
				vivo默认浏览器{
					刷新：全部触发
					关闭: {
						onbeforeunload:false
						onpagehide:true
						onunload:true
					}
				}
				Safari浏览器{
					刷新：全部触发
					关闭: {
						onbeforeunload:false
						onpagehide:true
						onunload:true
					}
				}
				搜狗浏览器 {
					刷新：全部触发
					关闭: 全部触发
				}
				QQ浏览器{
					刷新：全部触发
					关闭: {
						onbeforeunload:false
						onpagehide:true
						onunload:true
					}
				}
				UC览器{
					刷新：全部触发
					关闭: {
						onbeforeunload:false
						onpagehide:true
						onunload:false
					}
				}
				Chrome浏览器 {
					刷新：全部触发
					关闭: 全部触发
				}
				Firefox浏览器 {
					刷新：全部触发
					关闭: 全部触发
				}
				微信浏览器 {
					刷新：全部触发
					关闭: {
						onbeforeunload:false
						onpagehide:true
						onunload:true
					}
				}
				抖音浏览器 {
					刷新：全部触发
					关闭：全部触发 
				}
			 */
			// 函数在刷新页面时可以触发
			window.onload = () => {
				window.onbeforeunload = function() {
					postData('onbeforeunload');
				}
				window.onpagehide = function() {
					postData('onpagehide');
				}
				window.onunload = function() {
					postData('onunload');
				}
			}
		},
		beforeDestroy() {
			// postData('beforeDestroy');
		},
		destroyed() {
			// postData('destroyed');
		},
		methods: {
			change() {
				postData('change')
				this.ran = Math.random();
			}
		},
	}
</script>

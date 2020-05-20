export function getCookie(name){
	var arr = document.cookie.match( new RegExp("(^| )"+name+"=([^;]*)(;|$)") );
	return arr ? unescape(arr[2]) : null;
}
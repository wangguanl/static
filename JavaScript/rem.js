const calrem = () => {
	document.documentElement.style.fontSize = (document.documentElement.clientWidth / 750).toFixed(2) * 100 + 'px';
}
calrem();
window.addEventListener('resize', () => {
	calrem();
});
// 监听safari设备横竖屏
window.addEventListener('orientationchange', () => {
	calrem();
});

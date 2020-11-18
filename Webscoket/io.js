const socketio = require('socket.io')();
socketio.on('connection', socket => {
	socketio.emit('connectSuccess', 'allWebsocketLogin');
})
const chat = socketio.of('/chat').on('connection', (socket) => {
	// 用于所有人能看到
	chat.emit('chatIn', {
		type: 'all'
	});
	// 用户当前用户可以看到
	socket.emit('chatIn', {
		type: 'only'
	});
	// 自己看不到，其他人都可以看到
	socket.broadcast.emit('chatIn', {
		type: 'broadcast',
	});
	socket.on('message', function() {
		console.log('通过send接收消息')
	});
	socket.on('error', (error) => {
		console.log('监听到错误')
	});
	socket.on('chatMessage', function(msg, cb) {

		cb(msg); // 回调

		// 用于所有人能看到
		chat.emit('chatMessage', {
			type: 'all',
			msg
		});
		// 用户当前用户可以看到
		socket.emit('chatMessage', {
			type: 'only',
			msg
		});
		// 自己看不到，其他人都可以看到
		socket.broadcast.emit('chatMessage', {
			type: 'broadcast',
			msg
		});
	});
	socket.on('disconnect', function() {
		chat.emit('chatOut', '有人退出了');
	});
});
const check = socketio.of('/check').on('connection', (socket) => {
	// check.emit('checkStatus', 'checkStatus');
});
module.exports = _server => socketio.listen(_server, {
	path: '/test',
	// path: '/',
	serveClient: false,
	// below are engine.IO options
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: false
});

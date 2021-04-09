/* 
	上传文件
	  uploadFile(file.file).then(res => {});
*/
export const uploadFile = (file) => new Promise((resolve, reject) => {
	const FileBuffer = new FormData();
	FileBuffer.append('', file);

	const XHR = new XMLHttpRequest();

	XHR.open('post', 'url', true); //设置请求的类型及url

	XHR.send(FileBuffer); //发送请求

	XHR.onreadystatechange = () => {
		if (XHR.readyState == 4 && XHR.status == 200) {
			var res = JSON.parse((XHR.responseText).replace(/\\/g, '/').replace(/\/\//g, '/'));
			resolve(res);
		} else {
			reject();
		}
	}
})

export const uploadFile2 = (file) => {

	const FileBuffer = new FormData();
	FileBuffer.append("image[]", file);
	FileBuffer.append("token", '');
	return axios.post('url', FileBuffer, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})

}

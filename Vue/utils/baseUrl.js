export const ip = process.env.NODE_ENV === 'development' ? location.protocol + '//' + location.hostname + ':9999/' : location.protocol + '//api.webest.store/';
export const baseUrl = ip + 'back';


const web = process.env.NODE_ENV === 'development' ? location.protocol + '//' + location.hostname + ':8081/' : location.protocol + '//webest.store/';
export const fileUploadHtml = web + 'upload/index.html';
export const printShareHtml = web + 'printshare/index.html';


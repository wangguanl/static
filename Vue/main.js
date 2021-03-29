import components from "@/views/components/installs";
for (let k in components) {
  Vue.component(k, components[k]);
}



import ElementUI from 'element-ui'; 
//这里通过修改dialog的props里的默认值,弹出框设置点击蒙版不关闭
ElementUI.Dialog.props.closeOnClickModal.default = false;
ElementUI.Dialog.props.top.default = '0px';
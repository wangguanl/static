import Vue from 'vue';
Vue.directive('click', {
	bind(el, { modifiers, value }) {
		el.addEventListener('click', () => {
			el.setAttribute('disabled', true);
			el.classList.add('loading');
			value().then(_ => {
				el.classList.remove('loading');
				el.removeAttribute('disabled');
			}).catch(() => {
				el.classList.remove('loading');
				el.removeAttribute('disabled');
			})
		})
	}
});

Vue.directive('required', {
	bind(el, { modifiers, value }) {
		el.addEventListener('blur', () => {
			if (!(el.value.replace(/\s+/g, '').length)) {
				el.style['border-color'] = "#f56c6c";
			} else {
				el.style['border-color'] = "#dcdfe6";
			}
		})
	}
});
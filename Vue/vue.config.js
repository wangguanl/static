module.exports = {
	css: {
		loaderOptions: {
			sass: {
				prependData: `
					@import "@/assets/css/variables.scss";
					@import "@/assets/css/mixin.scss";
				`,
			}
		}
	},
	// 生产环境是否生成 sourceMap 文件
	productionSourceMap: false,
}

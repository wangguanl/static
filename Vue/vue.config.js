module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
					@import "@/assets/css/variables.scss";
					@import "@/assets/css/mixin.scss";
				`,
      },
      postcss: {
        plugins: [
          require("postcss-px2rem")({
            remUnit: 37.5,  // 设计图大小
          }),
        ],
      },
    },
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
};

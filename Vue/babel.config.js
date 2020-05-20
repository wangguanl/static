module.exports = {
	presets: [
		'@vue/cli-plugin-babel/preset'
	],
	// 使用elementUI按需加载
	plugins: [
		[
			"component",
			{
				"libraryName": "element-ui",
				"styleLibraryName": "theme-chalk"
			}
		]
	]
}

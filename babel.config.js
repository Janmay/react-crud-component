module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false,
				targets: {
					browsers: ['>0.25%, not dead'],
				},
			},
		],
	],
	plugins: [
		[
			'@babel/plugin-transform-runtime',
			{
				useESModules: true,
			},
		],
		'@babel/proposal-class-properties',
		'@babel/proposal-object-rest-spread',
	],
};

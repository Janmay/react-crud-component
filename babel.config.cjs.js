module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: 'cjs',
				targets: {
					browsers: ['>0.25%, not dead'],
				},
			},
		],
		'@babel/preset-react',
	],
	plugins: [
		'@babel/plugin-transform-runtime',
		'@babel/proposal-class-properties',
		'@babel/proposal-object-rest-spread',
	],
};

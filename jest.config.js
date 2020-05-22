module.exports = {
	clearMocks: true,
	cacheDirectory: '.jest-cache',
	testEnvironment: 'jsdom',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	moduleNameMapper: {
		'@react-crud/core': '@react-crud/core/dist/cjs',
	},
	collectCoverageFrom: [
		'packages/**/*.{ts,tsx}',
		'!**/node_modules/**',
		'!**/lib/**',
		'!**/__tests__/**',
	],
	setupFilesAfterEnv: [
		require.resolve('@testing-library/jest-dom/extend-expect'),
		'<rootDir>/jest/setupTests.ts',
	],
	testMatch: [
		'<rootDir>/packages/antd/src/**/__test__/**/?(*.)(spec|test).ts(x|)',
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	transformIgnorePatterns: ['<rootDir>/(node_modules)/'],
	preset: 'ts-jest',
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.jest.json',
			diagnostics: {
				pathRegex: '\\.(spec|test)\\.ts$',
			},
		},
	},
};

module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
	},
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
		".+\\.(css|scss|png|jpg|svg)$": "jest-transform-stub",
	},
};

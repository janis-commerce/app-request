module.exports = {
	"env": {
		"node": true,
		"es6": true,
		"jest": true
	},
	"parser": "@babel/eslint-parser",
	"extends": ["plugin:import/recommended", "eslint:recommended", "plugin:prettier/recommended"],
	"plugins": ["@babel", "prettier"],
	"overrides": [],
	"parserOptions": {
		"sourceType": "module",
		"requireConfigFile": false
	},
	"rules": {
		"prettier/prettier": "error",
		"import/extensions": [
			"error",
			"always",
			{
				"ignorePackages": true
			}
		]
	}
}
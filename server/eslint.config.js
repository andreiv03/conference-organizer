import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

/** @type {import("eslint").Linter.Config[]} */
export default [
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: globals.node,
		},
	},
	js.configs.recommended,
	prettier,
];

import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
  
    // Custom rules
    {
        rules: {
            "indent": ["error", 4], // Enforce 4-space indentation
            "quotes": ["error", "double"], // Enforce double quotes
            "semi": ["error", "always"], // Require semicolons
            "react/jsx-indent": ["error", 4], // Enforce JSX indentation
            "react/react-in-jsx-scope": "off", // ✅ Disable the requirement for React import
            "@typescript-eslint/no-require-imports": "off" // ✅ Allow require() imports


        },
    },
];
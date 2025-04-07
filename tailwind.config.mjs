import { heroui } from "@heroui/theme"
const themeConfig = require("./src/styles/tailwind.theme.js")

/** @type {import('tailwindcss').Config} */
module.exports = {

    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            ...themeConfig.theme.extend,       
        },
    },

    darkMode: "class",
    plugins: [heroui(), ...themeConfig.plugins],
}
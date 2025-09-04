import typography from "@tailwindcss/typography";
console.log("-------------------------------------------------------------");
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // 确保包含你的页面和组件
  ],
  theme: {
    extend: {},
  },
  plugins: [typography],
};

export default config;

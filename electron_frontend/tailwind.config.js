/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./preload.mjs",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/renderer/**/*.html",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // colors: {
      //   gray: {
      //     border: "#3C3C3C",
      //     subText: "#d4dce4",
      //     inputBox: "#ccd4dc",
      //     pointText: "#99bbff",
      //   },
      //   light: {
      //     header: "#FFFFFF",
      //     sidebar: "#FFFFFF",
      //     main: "#F3F4F6",
      //     border: "#D1D5DB",
      //     subText: "black",
      //   },
      // },
      // borderRadius: {
      //   inputBox: "rounded-md",
      // },
      fontFamily: {
        samsung: ["SamsungSharpSans"],
        helvetica: ["helvetica-neue-55"],
        Gmarket: ["GmarketSansMedium"],
      },
    },
  },
  plugins: [],
};

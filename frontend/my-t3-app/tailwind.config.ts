import { type Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        "144": "36rem",
        "160": "40rem",
      },
      backgroundImage: {
        panel: "linear-gradient(114.4deg, #EBEBEB 2.77%, #EED9E6 87.18%)",
        panelDark:
          "linear-gradient(129.27deg, #000748 11.01%, #001271 100.41%)",
        graph: "linear-gradient(141.41deg, #FFC2C2 11.27%, #BDA1C0 84.68%)",
        graphDark: "linear-gradient(141.41deg, #05041F 11.27%, #151E4D 84.68%)",
        title:
          "linear-gradient(98.16deg, #7F6AFF 12.08%, rgba(236, 119, 255, 0.93) 111.29%);",
      },
      boxShadow: {
        graph:
          "inset -20px -20px 60px rgba(225, 248, 255, 0.79), inset 20px 20px 60px rgba(255, 255, 255, 0.9)",
        graphDark:
          "20px 60px 100px rgba(27, 43, 57, 0.25), inset 20px 20px 60px rgba(69, 77, 150, 0.9)",
        navBar: "inset 0px 0px 100px #f5f3ff",
        navBarDark: "inset 0px 0px 100px #1e1b4b",
      },
      fontSize: {
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "dynamic-shrink": {
          "0%": { width: "66.666667%", height: "3.5rem" },
          "30%": { width: "3.8rem", height: "4rem" },
          "100%": { width: "4rem", height: "4rem" },
        },
        "dynamic-grow": {
          "0%": { width: "4rem", height: "4rem" },
          "30%": { width: "69.0%", height: "3.5rem" },
          "100%": { width: "66.666667%", height: "3.5rem" },
        },
        "dynamic-expand": {
          "0%": { height: "3.5rem", width: "66.666667%" },
          "30%": { height: "34rem", width: "66.666667%" },
          "100%": { height: "32rem", width: "66.666667%" },
        },
        "dynamic-contract": {
          "0%": { height: "32rem", width: "66.666667%" },
          "30%": { height: "30rem", width: "66.666667%" },
          "100%": { height: "3.5rem", width: "66.666667%" },
        },
        "pop-up": {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        "pop-out": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-2%)", opacity: "0", blur: "20px" },
          "100%": { transform: "translateX(0)", opacity: "1", blur: "0" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(2%)", opacity: "0", blur: "20px" },
          "100%": { transform: "translateX(0)", opacity: "1", blur: "0" },
        },
        "slide-out-left": {
          "0%": { transform: "translateX(0)", opacity: "1", blur: "0" },
          "100%": { transform: "translateX(-2%)", opacity: "0", blur: "20px" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)", opacity: "1", blur: "0" },
          "100%": { transform: "translateX(2%)", opacity: "0", blur: "20px" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out forwards",
        "fade-out": "fade-out 0.5s ease-in-out forwards",
        "dynamic-shrink":
          "dynamic-shrink 2s cubic-bezier(.05,.93,.52,.98) forwards",
        "dynamic-grow":
          "dynamic-grow 3s cubic-bezier(.05,.93,.52,.98) forwards",
        "dynamic-expand":
          "dynamic-expand 3s cubic-bezier(.05,.93,.52,.98) forwards",
        "dynamic-contract":
          "dynamic-contract 3s cubic-bezier(.05,.93,.52,.98) forwards",
        "pop-up": "pop-up 1s ease-in-out",
        "pop-out": "pop-out 1s ease-in-out",
        "slide-in-left": "slide-in-left 0.5s ease-in-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-in-out forwards",
        "slide-out-left": "slide-out-left 0.5s ease-in-out forwards",
        "slide-out-right": "slide-out-right 0.5s ease-in-out forwards",
      },
      transitionTimingFunction: {
        dynamicIsland: "cubic-bezier(.03,.99,.48,1)",
      },
    },
  },
  plugins: [],
} satisfies Config;

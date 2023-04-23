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
        panel:
          "linear-gradient(129.27deg, rgba(0, 26, 255, 0.14) 11.01%, rgba(255, 108, 196, 0.14) 100.41%)",
        graph: "linear-gradient(141.41deg, #504BD8 11.27%, #CFA1D6 84.68%);",
        title:
          "linear-gradient(98.16deg, #7F6AFF 12.08%, rgba(236, 119, 255, 0.93) 111.29%);",
      },
      boxShadow: {
        graph:
          "20px 60px 100px rgba(123, 92, 147, 0.25), inset 20px 20px 60px rgba(255, 255, 255, 0.9)",
      },
      fontSize: {
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
      },
    },
  },
  plugins: [],
} satisfies Config;

// tailwind.config.js
console.log("Tailwind config loaded");
import { blackA, violet } from "@radix-ui/colors";

export const content = [
  './src/app/**/*.{js,ts,jsx,tsx}',
  './src/components/**/*.{js,ts,jsx,tsx}',
];
export const theme = {
  extend: {
    colors: {
      ...blackA,
      ...violet,
    }
  },
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
    '2xl': '1536px',
  },
};
export const plugins = [];

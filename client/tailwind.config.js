/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5F5F5",
        // secondary: "#A6754C",
        // secondary: "#6E6E6E",
        // secondary: "#90A480",
        // secondary: "#D4A373",
        // secondary: "#dda15e",
        // secondary: "#d5bdaf",
        // secondary: "#d6ccc2",
        secondary: "#6c584c",
        // secondary: "#a98467",
        // secondary: "#9c6644",
        // secondary: "#7f5539",
        // secondary: "#b08968",
        // secondary: "#b08968",
        accent: "#452103",
        neutral: "#B1D4FF",
        "base-100": "#B1D4FF",
        background: "#8CC896",
        info: "#3399FF",
        success: "#F78DB1",
        warning: "#515d8c",
        error: "#E14E64",
        navhover: "#9C7B5F"
      },
    },
  },
  plugins: [
    require('tailwindcss-animated'),
  ],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5F5F5",
        secondary: "#A6754C",
        accent: "#C0C0C0",
        secondary2: "#F3F4F6",
        accent: "#452103",
        neutral: "#B1D4FF",
        "base-100": "#B1D4FF",
        background: "#8CC896",
        info: "#3399FF",
        success: "#F78DB1",
        warning: "#515d8c",
        error: "#E14E64",
        navhover: "#C0C0C0",
        destructive: "#E34242",
        admin: '#4682B4'
      },

      // Paleta "Serenidad Oceánica"
      // colors7: {
      //   primary: '#4682B4',
      //   secondary: '#C0C0C0',
      //   accent: '#F8F8FF',
      //   neutral: '#F5F5DC',
      //   background: '#AFEEEE',
      // }
    },
  },
  plugins: [
    require('tailwindcss-animated'),
  ],
};

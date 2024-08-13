/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5F5F5",
        secondary: "#6c584c",
        accent: "#452103",
        neutral: "#B1D4FF",
        "base-100": "#B1D4FF",
        background: "#8CC896",
        info: "#3399FF",
        success: "#F78DB1",
        warning: "#515d8c",
        error: "#E14E64",
        navhover: "#9C7B5F",
        destructive: "#E34242"
      },

      // Paleta "Naturaleza Cálida"
      // colors2: {
      //   primary: '#F5F5DC',
      //   secondary: '#D9BFA0',
      //   accent: '#9A9A5F',
      //   neutral: '#8B4513',
      //   background: '#FFFDD0'
      // }

      // Paleta "Oasis Tranquilo"
      // colors3:{
      //   primary: '#87CEEB',
      //   secondary: '#D3D3D3',
      //   accent: '#77DD77',
      //   neutral: '#F5F5DC',
      //   background: '#ffffff'
      // }

      // Paleta "Tonos de Café"
      // colors4: {
      //   primary: '#4B3F2F',
      //   secondary: '#BFA6A0',
      //   accent: '#F0E4D7',
      //   neutral: '#D9A26C',
      //   background: '#6F4F28'
      // }

      // Paleta "Tranquilidad Azul"
      // colors5: {
      //   primary: '#B0C4DE',
      //   secondary: '#C0C0C0',
      //   accent: '#ADD8E6',
      //   neutral: '#F8F8FF',
      //   background: '#D3D3D3'
      // }

      // Paleta "Serenidad Verde"
      // colors6: {
      //   primary: '#98FF98',
      //   secondary: '#8A9A5B',
      //   accent: '#77DD77',
      //   neutral: '#F5F5F5',
      //   background: '#E0E0E0'
      // }

      // Paleta "Calidez Tierra"
      // colors7: {
      //   primary: '#E27D60',
      //   secondary: '#F5F5DC',
      //   accent: '#D5BDAF',
      //   neutral: '#F9F3E5',
      //   background: '#C5A25A'
      // }

      // Paleta "Atardecer Suave"
      // colors8: {
      //   primary: '#FFDAB9',
      //   secondary: '#FF6F61',
      //   accent: '#F5E6E6',
      //   neutral: '#B2D8B2',
      //   background: '#EAEAEA'
      // }

      // Paleta "Elegancia Relajada"
      // colors9: {
      //   primary: '#A9A9A9',
      //   secondary: '#D8BFD8',
      //   accent: '#F5F5F5',
      //   neutral: '#E0FFFF',
      //   background: '#98FF98',
      // }

      // Paleta "Cálido Acogedor"
      // colors10: {
      //   primary: '#D7A9A4',
      //   secondary: '#F5F5DC',
      //   accent: '#BFA6A0',
      //   neutral: '#FFFFF0',
      //   background: '#A9A9A9',
      // }

      // Paleta "Refugio Urbano"
      // colors11: {
      //   primary: '#9E9E9E',
      //   secondary: '#F5F5F5',
      //   accent: '#003366',
      //   neutral: '#D1B493',
      //   background: '#C0D6C4',
      // }

      // Paleta "Rústico Acogedor"
      // colors12: {
      //   primary: '#9E9E9E',
      //   secondary: '#F5F5DC',
      //   accent: '#8B4513',
      //   neutral: '#9B9B7A',
      //   background: '#FFFFF0',
      // }

      // Paleta "Encanto Nórdico"
      // colors2: {
      //   primary: '#F0F8FF',
      //   secondary: '#6C7B8B',
      //   accent: '#D3D3D3',
      //   neutral: '#E6E2D3',
      //   background: '#F5F5DC',
      // }

      // Paleta "Amanecer Cálido"
      // colors3: {
      //   primary: '#F5B7B1',
      //   secondary: '#FAD6A5',
      //   accent: '#D3D3D3',
      //   neutral: '#FFF5E1',
      //   background: '#F4A460',
      // }

      // Paleta "Sueños Pastel"
      // colors4: {
      //   primary: '#E6E6FA',
      //   secondary: '#FFC0CB',
      //   accent: '#BFEFFF',
      //   neutral: '#98FF98',
      //   background: '#F8F8FF',
      // }

      // Paleta "Rincón Mediterráneo"
      // colors5: {
      //   primary: '#40E0D0',
      //   secondary: '#F5F5DC',
      //   accent: '#E27D60',
      //   neutral: '#C0C0C0',
      //   background: '#F5F5F5',
      // }

      // Paleta "Otoño Apacible"
      // colors6: {
      //   primary: '#F0E68C',
      //   secondary: '#4A3C31',
      //   accent: '#D9D3C8',
      //   neutral: '#F5E6E6',
      //   background: '#8A9A5B',
      // }

      // Paleta "Serenidad Oceánica"
      // colors7: {
      //   primary: '#4682B4',
      //   secondary: '#C0C0C0',
      //   accent: '#F8F8FF',
      //   neutral: '#F5F5DC',
      //   background: '#AFEEEE',
      // }

      // Paleta "Refugio Natural"
      // colors8: {
      //   primary: '#2E8B57',
      //   secondary: '#F5F5DC',
      //   accent: '#C8C8C8',
      //   neutral: '#D2B48C',
      //   background: '#FFFAFA',
      // }

      // Paleta "Tranquilidad Terrosa"
      // colors9: {
      //   primary: '#D2B48C',
      //   secondary: '#9C9B7A',
      //   accent: '#D3D3D3',
      //   neutral: '#F5F5DC',
      //   background: '#FFFFF0',
      // }

      // Paleta "Minimalismo Acogedor"
      // colors10: {
      //   primary: '#FFFAFA',
      //   secondary: '#DCDCDC',
      //   accent: '#F5F5F5',
      //   neutral: '#BEBEBE',
      //   background: '#E3DAC9',
      // }

      // colors21: {
      //   primary: '#EDEDE9',
      //   secondary: '#D6CCC2',
      //   accent: '#F5EBE0',
      //   neutral: '#E3D5CA',
      //   background: '#D5BDAF',
      // }

      // colors22: {
      //   primary: '#D8E2DC',
      //   secondary: '#FFE5D9',
      //   accent: '#FFCAD4',
      //   neutral: '#F4ACB7',
      //   background: '#9D8189',
      // }

      // colors23: {
      //   primary: '#EDAFB8',
      //   secondary: '#F7E1D7',
      //   accent: '#DEDBD2',
      //   neutral: '#B0C4B1',
      //   background: '#4A5759',
      // }

      // colors24: {
      //   primary: '#0D1B2A',
      //   secondary: '#1B263B',
      //   accent: '#415A77',
      //   neutral: '#778DA9',
      //   background: '#E0E1DD',
      // }

      // colors25: {
      //   primary: '#463F3A',
      //   secondary: '#8A817C',
      //   accent: '#BCB8B1',
      //   neutral: '#F4F3EE',
      //   background: '#E0AFA0',
      // }

      // colors26: {
      //   primary: '#FFFFFF',
      //   secondary: '#00171F',
      //   accent: '#003459',
      //   neutral: '#007EA7',
      //   background: '#00A8E8',
      // }

      // colors27: {
      //   primary: '#0D1321',
      //   secondary: '#1D2D44',
      //   accent: '#3E5C76',
      //   neutral: '#748CAB',
      //   background: '#F0EBD8',
      // }

       // colors28: {
      //   primary: '#22223B',
      //   secondary: '#4A4E69',
      //   accent: '#9A8C98',
      //   neutral: '#C9ADA7',
      //   background: '#F2E9E4',
      // }

      // colors29: {
      //   primary: '#353535',
      //   secondary: '#3C6E71',
      //   accent: '#FFFFFF',
      //   neutral: '#D9D9D9',
      //   background: '#284B63',
      // }

      // colors30: {
      //   primary: '#022B3A',
      //   secondary: '#1F7A8C',
      //   accent: '#BFDBF7',
      //   neutral: '#E1E5F2',
      //   background: '#FFFFFF',
      // }
    },
  },
  plugins: [
    require('tailwindcss-animated'),
  ],
};

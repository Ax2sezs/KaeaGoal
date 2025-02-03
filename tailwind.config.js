/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'layer-background':'#FAEBD7',
        'layer-item':'#D0A384',
        'button-text':'#1f2937',
        'light-color':'#D9D9D9',
        'heavy-color':'#a27557',
        'bg':'#FFFFFF'
      },
      colors_Orange: {
        'layer-background': '#F4E3B5',
        'layer-item': '#F4B63E',
        'button-text': '#FCFBF7',
        'light-color': '#D9D9D9',
        'heavy-color': '#E3812C',
        'hover-color': '#7AB6E0',
      },
      colors_pink: {
        'layer-background': '#9ED9FF',
        'layer-item': '#FF96A6',
        'button-text': '#FCFBF7',
        'light-color': '#ffd3d9',
        'heavy-color': '#ff6c83',
      },
      color_main:{
        'layer-background': '#f0f0f0',
        'layer-item': '#88d9dd',
        'button-text': '#1f2937',
        'light-color': '#cbcbcc',
        'heavy-color': '#5fc0be',
        'bg':'#FFFFFF'
      },
      earth_colors: {
        'layer-background':'#FAEBD7',
        'layer-item':'#D0A384',
        'button-text':'#1f2937',
        'light-color':'#D9D9D9',
        'heavy-color':'#a27557',
        'bg':'#FFFFFF'
      },

      fontFamily: {
        sans: ['"Baloo 2"', 'sans-serif'], // Set Baloo as default
      },


    },
  },
  plugins: [
    require('daisyui'),
  ],
}
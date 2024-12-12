/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        "borderRed" : "#884449",
        "bgblue" : "#201F34",
        "bgdarkblue" : "#0C0B13",
        "bgdarkerblue" : "#070910",
        "bgdarkerdarkerblue" : "#191919",
        "txtwh" : "#ECECFF",
        "txtsecondary" : "#B1B0CD",
        "txtthidary" : "#5E5D77",
        "Error" : {
          "grey" : "#282828",
          "red" : "#3E191C",
          "text" : "#E3A7A9"
        },
        "Design" : {
          'red' : '#2B1219',
          'Button' : {
            'blue' : "#191623",
            'white' : '#F6F6F6',
            'red' : '#6A363B'
          }
        }
        
      },
      fontFamily: {
        "Montserrat" : ['Montserrat','sans-serif'],
        'Bungee' : ['Bungee', 'sans-serif'],
        'AlfaSlabOne' : ['Alfa Slab One','Bungee'],
        'Orbitron' : ['Orbitron','sans-serif']
      }
    },
  },
  plugins: [],
}


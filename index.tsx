<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Gunungan_wayang_vector.svg/1200px-Gunungan_wayang_vector.svg.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WetonKu - Kalkulator Primbon Jawa</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              serif: ['"Playfair Display"', 'serif'],
              sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
              java: {
                gold: '#7DA0CA',       // Light Blue (#7DA0CA)
                'gold-light': '#C1E8FF', // Very Light Blue (#C1E8FF)
                dark: '#021024',       // Very Dark Blue (#021024)
                brown: '#052659',      // Dark Blue (#052659) - Primary
                'brown-light': '#5483B3', // Medium Blue (#5483B3)
                cream: '#F0F8FF',      // Alice Blue (Text on dark)
                accent: '#5483B3',     // Medium Blue (#5483B3)
                bg: '#F8FBFF'          // Ghost White / Cool Background
              }
            },
            animation: {
              'fade-in': 'fadeIn 0.8s ease-out forwards',
              'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
              'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
              fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
              },
              fadeInUp: {
                '0%': { opacity: '0', transform: 'translateY(20px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
              }
            }
          }
        }
      }
    </script>
    <style>
      body {
        background-color: #C1E8FF;
        color: #021024;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        min-height: 100vh;
      }

      /* Elegant Ukiran Background - Linear Gradient Update */
      .ukiran-bg {
        /* Linear gradient from Top #C1E8FF to Bottom #021024 */
        background: linear-gradient(to bottom, #C1E8FF 0%, #021024 100%);
        background-attachment: fixed; /* Keeps gradient fixed during scroll */
        position: relative;
        min-height: 100vh;
      }

      /* The Ukiran Ornaments via Pseudo-element to keep HTML clean */
      .ukiran-bg::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.05; /* Very subtle watermark effect */
        
        background-image: 
          url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 C 20 0, 40 10, 50 30 C 60 50, 50 80, 80 90 C 90 93, 95 95, 100 95 L 0 0' fill='%23052659' /%3E%3Cpath d='M10 0 C 30 5, 45 20, 45 40 C 45 60, 30 70, 20 90' stroke='%23052659' stroke-width='2' fill='none'/%3E%3Cpath d='M0 20 C 15 20, 25 35, 25 55' stroke='%23052659' stroke-width='1' fill='none'/%3E%3Ccircle cx='48' cy='32' r='2' fill='%237DA0CA'/%3E%3Ccircle cx='20' cy='60' r='1.5' fill='%237DA0CA'/%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100 100 C 80 100, 60 90, 50 70 C 40 50, 50 20, 20 10 C 10 7, 5 5, 0 5 L 100 100' fill='%23052659' /%3E%3Cpath d='M90 100 C 70 95, 55 80, 55 60 C 55 40, 70 30, 80 10' stroke='%23052659' stroke-width='2' fill='none'/%3E%3Cpath d='M100 80 C 85 80, 75 65, 75 45' stroke='%23052659' stroke-width='1' fill='none'/%3E%3Ccircle cx='52' cy='68' r='2' fill='%237DA0CA'/%3E%3Ccircle cx='80' cy='40' r='1.5' fill='%237DA0CA'/%3E%3C/svg%3E");
        
        background-position: top -50px left -50px, bottom -50px right -50px;
        background-repeat: no-repeat;
        background-size: 50vmin 50vmin, 50vmin 50vmin;
      }

      .glass {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
    </style>
<script type="importmap">
{
  "imports": {
    "react/": "https://esm.sh/react@^19.2.4/",
    "react": "https://esm.sh/react@^19.2.4",
    "react-dom/": "https://esm.sh/react-dom@^19.2.4/",
    "@google/genai": "https://esm.sh/@google/genai@^1.39.0",
    "lucide-react": "https://esm.sh/lucide-react@^0.563.0",
    "jspdf": "https://esm.sh/jspdf@^4.1.0",
    "jspdf-autotable": "https://esm.sh/jspdf-autotable@^5.0.7",
    "vite": "https://esm.sh/vite@^7.3.1",
    "@vitejs/plugin-react": "https://esm.sh/@vitejs/plugin-react@^5.1.3"
  }
}
</script>
</head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
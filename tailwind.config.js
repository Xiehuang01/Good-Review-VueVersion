/** @type {import('tailwindcss').Config} */
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
const scale = (name) =>
  Object.fromEntries(SHADES.map((s) => [s, `rgb(var(--${name}-${s}) / <alpha-value>)`]))

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Theme colours are CSS variables ("R G B" triplets) so they can be switched live
        // (presets / custom colours in Settings → 主题配色, see src/utils/theme.ts).
        // brand = primary, ember/accent = accent (same variables), sage = correct-answer feedback.
        brand: scale('brand'),
        ember: scale('accent'),
        accent: scale('accent'),
        sage: scale('sage'),
        // Warm paper neutrals for the page base
        paper: {
          50: '#FAF8F5',
          100: '#F4F1EC',
          200: '#EAE4DA',
          300: '#DCD3C5',
        },
        glass: {
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          300: 'rgba(255, 255, 255, 0.3)',
          400: 'rgba(255, 255, 255, 0.4)',
          500: 'rgba(255, 255, 255, 0.5)',
          600: 'rgba(255, 255, 255, 0.6)',
          700: 'rgba(255, 255, 255, 0.7)',
          800: 'rgba(255, 255, 255, 0.8)',
          900: 'rgba(255, 255, 255, 0.9)',
        }
      },
      fontFamily: {
        // Latin glyphs from Inter, Chinese glyphs from a Simplified-Chinese font.
        // Without explicit SC fonts the browser falls back per glyph and may pick a
        // Japanese CJK font (e.g. Noto Sans CJK JP), whose 复/门/骨… shapes differ from zh-CN.
        sans: [
          'Inter',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Noto Sans SC',
          'Noto Sans CJK SC',
          'Source Han Sans SC',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'PingFang SC',
          'Microsoft YaHei',
          'Noto Sans Mono CJK SC',
          'Noto Sans CJK SC',
          'monospace',
        ],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 10s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'confetti': 'confetti-drop 2.5s ease-in-out forwards',
        'chew': 'chew 0.4s ease-in-out infinite',
        'swallow': 'swallow 0.6s ease-in-out forwards',
        'wobble-slow': 'wobble 3s ease-in-out infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'confetti-drop': {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        chew: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.9)' },
        },
        swallow: {
          '0%': { transform: 'scale(1) translateY(0)', opacity: '1' },
          '50%': { transform: 'scale(1.1) translateY(-10px)', opacity: '1' },
          '100%': { transform: 'scale(0.1) translateY(50px)', opacity: '0' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        }
      }
    }
  },
  plugins: [],
}
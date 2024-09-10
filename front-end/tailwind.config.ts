import { nextui } from '@nextui-org/react'
import tailwindScrollbar from 'tailwind-scrollbar'
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {},
  plugins: [
    tailwindScrollbar({ nocompatible: true }),
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              50: '#D3DFEF',
              100: '#B6C8E1',
              200: '#98AFD2',
              300: '#7996C2',
              400: '#5B7CB3',
              500: '#032F6B',
              600: '#022859',
              700: '#022146',
              800: '#011933',
              900: '#011220',
              DEFAULT: '#032F6B'
            },
            secondary: {
              50: '#FFF8E5',
              100: '#FFEFBF',
              200: '#FFDD80',
              300: '#FFCB40',
              400: '#FFC020',
              500: '#FFD455',
              600: '#E5BD4C',
              700: '#BF9D3F',
              800: '#997C32',
              900: '#735B25',
              DEFAULT: '#FFD455',
              foreground: '#000000'
            }
          }
        },
        dark: {
          colors: {
            primary: {
              50: '#011220',
              100: '#011933',
              200: '#022146',
              300: '#022859',
              400: '#032F6B',
              500: '#5B7CB3',
              600: '#7996C2',
              700: '#98AFD2',
              800: '#B6C8E1',
              900: '#D3DFEF',
              DEFAULT: '#5B7CB3',
              foreground: '#000000'
            },
            secondary: {
              50: '#735B25',
              100: '#997C32',
              200: '#BF9D3F',
              300: '#E5BD4C',
              400: '#FFD455',
              500: '#FFC020',
              600: '#FFCB40',
              700: '#FFDD80',
              800: '#FFEFBF',
              900: '#FFF8E5',
              DEFAULT: '#FFC020',
              foreground: '#000000'
            }
          }
        }
      }
    })
  ]
}
export default config

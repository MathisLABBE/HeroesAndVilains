/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'heroTheme',
    themes: {
      heroTheme: {
        dark: false,
        colors: {
          primary: '#0056b3',
          secondary: '#ffc107',
          accent: '#e3f2fd',
          error: '#f44336',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#fb8c00',
        },
      },
      villainTheme: {
        dark: true,
        colors: {
          primary: '#6a1b9a',
          secondary: '#76ff03',
          accent: '#f3e5f5',
          error: '#ff5252',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#fb8c00',
        },
      },
    },
  },
})

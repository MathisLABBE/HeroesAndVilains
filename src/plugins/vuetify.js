import { createVuetify } from 'vuetify'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  theme: {
    defaultTheme: 'heroTheme',
    themes: {
      heroTheme: {
        dark: false,
        colors: {
          primary: '#0056b3',
          secondary: '#ffcc00',
          accent: '#e3f2fd',
          background: '#e3f2fd',
          surface: '#ffffff',
          error: '#f44336',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#fb8c00',
        },
      },
      villainTheme: {
        dark: true,
        colors: {
          primary: '#4a148c',
          secondary: '#b2ff59',
          accent: '#121212',
          background: '#1a1a1a',
          surface: '#2c2c2c',
          error: '#ff5252',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#fb8c00',
        },
      },
      oppositionTheme: {
        dark: false,
        colors: {
          primary: '#ff5722',
          secondary: '#000000',
          accent: '#ffd54f',
          background: '#f5f5f5',
          surface: '#ffffff',
          error: '#f44336',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#fb8c00',
        },
      },
    },
  },
})

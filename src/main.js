import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import App from './App.vue'

import 'unfonts.css'
import '@/styles/comics.scss'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

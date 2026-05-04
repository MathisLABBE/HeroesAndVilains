<template>
  <v-app :class="`mode-${themeStore.currentMode}`">
    <v-app-bar color="primary" class="comic-app-bar" flat border>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title class="comic-title">
        Heroes & Vilains
      </v-app-bar-title>

      <v-spacer />

      <!-- Theme Switcher -->
      <v-btn-toggle
        v-model="themeStore.currentMode"
        mandatory
        class="theme-switcher mr-4"
        density="compact"
      >
        <v-btn value="hero" icon="mdi-shield-check" color="blue" title="Mode Héros" />
        <v-btn value="opposition" icon="mdi-sword-cross" color="orange" title="Mode Opposition" />
        <v-btn value="villain" icon="mdi-skull" color="purple" title="Mode Vilains" />
      </v-btn-toggle>

      <v-btn to="/hero-login" class="comic-btn" color="secondary">
        Connexion
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" class="comic-drawer" width="300">
      <v-list nav>
        <v-list-item title="Accueil" to="/" prepend-icon="mdi-home" />
        <v-list-item title="Phrase secrète" to="/secret" prepend-icon="mdi-key" />
        <v-list-item title="Organisations" to="/organizations" prepend-icon="mdi-domain" />
        <v-list-item title="Équipes" to="/teams" prepend-icon="mdi-account-group" />
        <v-list-item title="Profil héros" to="/hero-profile" prepend-icon="mdi-account" />
      </v-list>
    </v-navigation-drawer>

    <v-main class="position-relative overflow-hidden">
      <!-- Opposition Layout Elements -->
      <div class="opposition-divider-container">
        <div class="lightning-bolt"></div>
        <div class="vs-badge">VS</div>
      </div>
      
      <v-container fluid class="fill-height align-start position-relative" style="z-index: 10;">
        <router-view v-slot="{ Component }">
          <transition name="bam" mode="out-in">
            <div :key="route.path" class="w-100">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <ErrorDialog />
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useThemeStore } from '@/stores/theme.store'
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'
import ErrorDialog from '@/components/ErrorDialog.vue'

const themeStore = useThemeStore()
const theme = useTheme()
const route = useRoute()
const drawer = ref(false)

watch(() => themeStore.currentMode, (newMode) => {
  if (newMode === 'hero') {
    theme.global.name.value = 'heroTheme'
  } else if (newMode === 'villain') {
    theme.global.name.value = 'villainTheme'
  } else {
    theme.global.name.value = 'oppositionTheme'
  }
}, { immediate: true })
</script>

<style lang="scss">
.comic-app-bar {
  border-bottom: 5px solid black !important;
  z-index: 1000 !important;
}

.theme-switcher {
  background: white !important;
  border: 3px solid black !important;
  border-radius: 4px !important;
  
  .v-btn--active {
    background: #eee !important;
    border: 2px solid black !important;
  }
}

.w-100 {
  width: 100%;
}

.position-relative {
  position: relative !important;
}

.overflow-hidden {
  overflow: hidden !important;
}
</style>
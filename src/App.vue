<template>
  <v-app :class="`mode-${themeStore.currentMode}`">
    <v-app-bar border class="comic-app-bar" color="primary" flat>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title class="comic-title">
        Heroes & Vilains
      </v-app-bar-title>

      <v-spacer />

      <!-- Theme Switcher -->
      <v-btn-toggle
        v-model="themeStore.currentMode"
        class="theme-switcher mr-4"
        density="compact"
        mandatory
      >
        <v-btn color="blue" icon="mdi-shield-check" title="Mode Héros" value="hero" />
        <v-btn color="orange" icon="mdi-sword-cross" title="Mode Opposition" value="opposition" />
        <v-btn color="purple" icon="mdi-skull" title="Mode Vilains" value="villain" />
      </v-btn-toggle>

      <v-btn class="comic-btn" color="secondary" to="/hero-login">
        Connexion
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" class="comic-drawer" width="300">
      <v-list nav>
        <v-list-item prepend-icon="mdi-home" title="Accueil" to="/" />
        <v-list-item prepend-icon="mdi-key" title="Phrase secrète" to="/secret" />
        <v-list-item prepend-icon="mdi-domain" title="Organisations" to="/organizations" />
        <v-list-item prepend-icon="mdi-account-group" title="Équipes" to="/teams" />
        <v-list-item prepend-icon="mdi-account" title="Profil héros" to="/hero-profile" />
      </v-list>
    </v-navigation-drawer>

    <v-main class="position-relative overflow-hidden">
      <!-- Opposition Layout Elements -->
      <div class="opposition-divider-container">
        <div class="lightning-bolt" />
        <div class="vs-badge">VS</div>
      </div>

      <v-container class="fill-height align-start position-relative" fluid style="z-index: 10;">
        <router-view v-slot="{ Component }">
          <transition mode="out-in" name="bam">
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

<script setup>
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useTheme } from 'vuetify'
  import ErrorDialog from '@/components/ErrorDialog.vue'
  import { useThemeStore } from '@/stores/theme.store'

  const themeStore = useThemeStore()
  const theme = useTheme()
  const route = useRoute()
  const drawer = ref(false)

  watch(() => themeStore.currentMode, newMode => {
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

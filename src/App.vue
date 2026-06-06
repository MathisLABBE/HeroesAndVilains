<template>
  <v-app :class="`mode-${themeStore.currentMode}`">

    <v-navigation-drawer
      v-model="showLeftMenu"
      class="comic-drawer"
      width="300"
    >
      <v-list nav>
        <v-list-item prepend-icon="mdi-home" title="Accueil" :to="{name:'Home'}" />
        <v-list-item prepend-icon="mdi-key" title="Phrase secrète" :to="{name:'Secret'}" />
        <v-list-item prepend-icon="mdi-domain" title="Organisations" :to="{name:'Organizations'}" />
        <v-list-item prepend-icon="mdi-account-group" title="Équipes" :to="{name:'Teams'}" />
        <v-list-item prepend-icon="mdi-account" title="Profil héros" :to="{name:'HeroProfile'}" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      border
      class="comic-app-bar"
      color="primary"
      flat
    >
      <v-app-bar-nav-icon @click="showLeftMenu = !showLeftMenu" />

      <v-app-bar-title class="comic-title">
        Heroes & Vilains
      </v-app-bar-title>

      <v-spacer />

      <v-btn-toggle
        v-model="themeStore.currentMode"
        class="theme-switcher mr-4"
        mandatory
      >
        <v-btn color="blue" icon="mdi-shield-check" title="Mode Héros" value="hero" />
        <v-btn color="orange" icon="mdi-sword-cross" title="Mode Opposition" value="opposition" />
        <v-btn color="purple" icon="mdi-skull" title="Mode Vilains" value="villain" />
      </v-btn-toggle>

      <v-btn class="comic-btn" color="secondary" :to="{name:'HeroLogin'}">
        Connexion
      </v-btn>
    </v-app-bar>

    <v-main class="position-relative overflow-hidden">
      <div class="opposition-divider-container">
        <div class="lightning-bolt" />
        <div class="vs-badge">VS</div>
      </div>

      <v-container class="fill-height align-start position-relative main-container" fluid>
        <router-view name="root" />
      </v-container>
    </v-main>

    <ErrorDialog />
  </v-app>
</template>

<script setup>
/* ***************************
  IMPORTS
 *************************** */
  import { ref, watch } from 'vue'
  import { useTheme } from 'vuetify'
  import ErrorDialog from '@/components/ErrorDialog.vue'
  import { useThemeStore } from '@/stores/theme'

  /* ***************************
  STATE
 *************************** */
  const showLeftMenu = ref(false)
  const themeStore = useThemeStore()
  const theme = useTheme()

  const vuetifyThemes = {
    hero: 'heroTheme',
    opposition: 'oppositionTheme',
    villain: 'villainTheme',
  }

  /* ***************************
  WATCH
 *************************** */
  watch(() => themeStore.currentMode, newMode => {
    theme.global.name.value = vuetifyThemes[newMode] || vuetifyThemes.opposition
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

.main-container {
  z-index: 10;
}
</style>

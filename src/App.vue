<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title>
        Heroes & Vilains
      </v-app-bar-title>

      <v-spacer />

      <v-btn to="/hero-login" variant="text">
        Connexion héros
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list nav>
        <v-list-item title="Accueil" to="/" />
        <v-list-item title="Phrase secrète" to="/secret" />
        <v-list-item title="Organisations" to="/organizations" />
        <v-list-item title="Équipes" to="/teams" />
        <v-list-item title="Profil héros" to="/hero-profile" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <ErrorDialog />
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ErrorDialog from '@/components/ErrorDialog.vue'

const drawer = ref(false)
</script>
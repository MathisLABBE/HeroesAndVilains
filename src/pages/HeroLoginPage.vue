<template>
  <v-card max-width="500" class="mx-auto comic-card">
    <v-card-title class="comic-title">
      Connexion héros
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="login"
        label="Identifiant"
        variant="outlined"
        class="mt-4"
      />

      <v-text-field
        v-model="password"
        label="Mot de passe"
        type="password"
        variant="outlined"
        class="mt-2"
      />

      <v-alert
        type="info"
        variant="tonal"
        class="mt-4 border-lg border-opacity-100"
        style="border-color: black !important"
      >
        <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0; font-size: 1.2rem">
          Comptes de test : superdupond, chatounette, maddog, supertutu (mdp: azer)
        </span>
      </v-alert>
    </v-card-text>

    <v-card-actions class="pa-4">
      <v-spacer />

      <v-btn
        color="primary"
        class="comic-btn"
        :disabled="login.trim() === '' || password.trim() === ''"
        @click="connect"
      >
        Se connecter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store'

const router = useRouter()
const userStore = useUserStore()

const login = ref('')
const password = ref('')

async function connect() {
  const success = await userStore.loginUser(login.value, password.value)

  if (success) {
    router.push('/hero-profile')
  }
}
</script>
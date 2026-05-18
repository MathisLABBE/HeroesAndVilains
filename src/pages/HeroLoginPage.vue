<template>
  <v-card class="mx-auto comic-card" max-width="500">
    <v-card-title class="comic-title">
      Connexion héros
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="login"
        class="mt-4"
        label="Identifiant"
        variant="outlined"
      />

      <v-text-field
        v-model="password"
        class="mt-2"
        label="Mot de passe"
        type="password"
        variant="outlined"
      />

      <v-alert
        class="mt-4 border-lg border-opacity-100"
        style="border-color: black !important"
        type="info"
        variant="tonal"
      >
        <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0; font-size: 1.2rem">
          Comptes de test : superdupond, chatounette, maddog, supertutu (mdp: azer)
        </span>
      </v-alert>
    </v-card-text>

    <v-card-actions class="pa-4">
      <v-spacer />

      <v-btn
        class="comic-btn"
        color="primary"
        :disabled="login.trim() === '' || password.trim() === ''"
        @click="connect"
      >
        Se connecter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user.store'

  const router = useRouter()
  const userStore = useUserStore()

  const login = ref('')
  const password = ref('')

  async function connect () {
    const success = await userStore.loginUser(login.value, password.value)

    if (success) {
      router.push('/hero-profile')
    }
  }
</script>

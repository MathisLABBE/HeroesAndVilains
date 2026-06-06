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
      />

      <v-text-field
        v-model="password"
        class="mt-2"
        label="Mot de passe"
        type="password"
      />

      <v-alert class="mt-4" type="info">
        Comptes de test : superdupond, chatounette, maddog, supertutu (mdp: azer)
      </v-alert>
    </v-card-text>

    <v-card-actions class="pa-4">
      <v-spacer />

      <v-btn
        class="comic-btn"
        color="primary"
        :disabled="login === '' || password === ''"
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
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const login = ref('')
  const password = ref('')

  async function connect () {
    const success = await authStore.loginUser(login.value, password.value)

    if (success) {
      router.push('/hero-profile')
    }
  }
</script>

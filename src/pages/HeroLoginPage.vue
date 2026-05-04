<template>
  <v-card max-width="500" class="mx-auto">
    <v-card-title>
      Connexion héros
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="login"
        label="Login"
        variant="outlined"
      />

      <v-text-field
        v-model="password"
        label="Mot de passe"
        type="password"
        variant="outlined"
      />

      <v-alert
        type="info"
        class="mt-4"
      >
        Comptes de test : superdupond / azer, chatounette / azer, maddog / azer, supertutu / azer
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-btn
        color="primary"
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
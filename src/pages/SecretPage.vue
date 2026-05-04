<template>
  <v-card class="comic-card">
    <v-card-title class="comic-title">
      Phrase secrète
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="secretInput"
        label="Saisissez la phrase secrète"
        variant="outlined"
        class="mt-4"
      />

      <v-alert
        v-if="secretStore.hasSecret"
        type="success"
        variant="tonal"
        class="mt-4 border-lg border-opacity-100"
        style="border-color: black !important"
      >
        <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Phrase secrète enregistrée.</span>
      </v-alert>

      <v-alert
        v-else
        type="warning"
        variant="tonal"
        class="mt-4 border-lg border-opacity-100"
        style="border-color: black !important"
      >
        <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Aucune phrase secrète enregistrée.</span>
      </v-alert>
    </v-card-text>

    <v-card-actions class="pa-4">
      <v-btn color="primary" class="comic-btn" @click="saveSecret">
        Enregistrer
      </v-btn>

      <v-btn color="error" class="comic-btn" @click="clearSecret">
        Supprimer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSecretStore } from '@/stores/secret.store'

const secretStore = useSecretStore()
const secretInput = ref(secretStore.secret)

function saveSecret() {
  secretStore.setSecret(secretInput.value)
}

function clearSecret() {
  secretInput.value = ''
  secretStore.clearSecret()
}
</script>
<template>
  <v-card class="comic-card">
    <v-card-title class="comic-title">
      Phrase secrète
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="secretInput"
        class="mt-4"
        label="Saisissez la phrase secrète"
        variant="outlined"
      />

      <v-alert
        v-if="secretStore.hasSecret"
        class="mt-4 border-lg border-opacity-100"
        style="border-color: black !important"
        type="success"
        variant="tonal"
      >
        <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Phrase secrète enregistrée.</span>
      </v-alert>

      <v-alert
        v-else
        class="mt-4 border-lg border-opacity-100"
        style="border-color: black !important"
        type="warning"
        variant="tonal"
      >
        <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Aucune phrase secrète enregistrée.</span>
      </v-alert>
    </v-card-text>

    <v-card-actions class="pa-4">
      <v-btn class="comic-btn" color="primary" @click="saveSecret">
        Enregistrer
      </v-btn>

      <v-btn class="comic-btn" color="error" @click="clearSecret">
        Supprimer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue'
  import { useSecretStore } from '@/stores/secret.store'

  const secretStore = useSecretStore()
  const secretInput = ref(secretStore.secret)

  function saveSecret () {
    secretStore.setSecret(secretInput.value)
  }

  function clearSecret () {
    secretInput.value = ''
    secretStore.clearSecret()
  }
</script>

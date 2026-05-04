<template>
  <v-card>
    <v-card-title>
      Phrase secrète d’organisation
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="secretInput"
        label="Phrase secrète"
        variant="outlined"
      />

      <v-alert
        v-if="secretStore.hasSecret"
        type="success"
        class="mt-4"
      >
        Phrase secrète enregistrée.
      </v-alert>

      <v-alert
        v-else
        type="warning"
        class="mt-4"
      >
        Aucune phrase secrète enregistrée.
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" @click="saveSecret">
        Enregistrer
      </v-btn>

      <v-btn color="error" @click="clearSecret">
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

function saveSecret() {
  secretStore.setSecret(secretInput.value)
}

function clearSecret() {
  secretInput.value = ''
  secretStore.clearSecret()
}
</script>
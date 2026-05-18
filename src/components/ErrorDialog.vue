<template>
  <v-dialog
    v-model="errorStore.isError"
    attach=".v-main"
    max-width="500"
    persistent
  >
    <v-card class="comic-card">
      <v-card-title class="comic-title">
        Erreur
      </v-card-title>

      <v-card-text>
        {{ errorStore.errorMsg }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn class="comic-btn" color="primary" @click="errorStore.popError()">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { useErrorStore } from '@/stores/error.store'

  const errorStore = useErrorStore()
</script>

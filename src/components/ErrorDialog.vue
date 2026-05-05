<template>
  <v-dialog
    v-model="errorStore.isError"
    persistent
    max-width="500"
  >
    <v-card class="comic-card">
      <v-card-title class="comic-title text-error">
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

<script setup lang="ts">
import { useErrorStore } from '@/stores/error.store'

const errorStore = useErrorStore()
</script>
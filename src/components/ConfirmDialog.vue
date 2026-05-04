<template>
  <v-dialog v-model="show" persistent max-width="500">
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn @click="cancel">
          Annuler
        </v-btn>

        <v-btn color="primary" @click="accept">
          Confirmer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
const title = ref('')
const message = ref('')

let resolver: ((value: boolean) => void) | null = null

function open(newTitle: string, newMessage: string) {
  title.value = newTitle
  message.value = newMessage
  show.value = true

  return new Promise<boolean>((resolve) => {
    resolver = resolve
  })
}

function accept() {
  show.value = false

  if (resolver) {
    resolver(true)
    resolver = null
  }
}

function cancel() {
  show.value = false

  if (resolver) {
    resolver(false)
    resolver = null
  }
}

defineExpose({
  open,
})
</script>
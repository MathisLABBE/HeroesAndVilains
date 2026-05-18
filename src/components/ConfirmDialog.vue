<template>
  <v-dialog v-model="show" attach=".v-main" max-width="500" persistent>
    <v-card class="comic-card">
      <v-card-title class="comic-title">
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn class="comic-btn" @click="cancel">
          Annuler
        </v-btn>

        <v-btn class="comic-btn" color="primary" @click="accept">
          Confirmer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref } from 'vue'

  const show = ref(false)
  const title = ref('')
  const message = ref('')

  let resolver = null

  function open (newTitle, newMessage) {
    title.value = newTitle
    message.value = newMessage
    show.value = true

    return new Promise(resolve => {
      resolver = resolve
    })
  }

  function accept () {
    show.value = false

    if (resolver) {
      resolver(true)
      resolver = null
    }
  }

  function cancel () {
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

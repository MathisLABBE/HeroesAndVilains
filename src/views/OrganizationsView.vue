<template>
  <v-card class="comic-card">
    <v-card-title class="d-flex align-center comic-title">
      Organisations

      <v-spacer />

      <v-btn class="comic-btn" color="primary" @click="showCreateDialog = true">
        Créer une organisation
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-btn class="mb-4 comic-btn" color="primary" @click="load">
        Recharger
      </v-btn>

      <v-table class="comic-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Identifiant</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="org in dataStore.orgs" :key="org._id">
            <td>{{ org.name }}</td>
            <td>{{ org._id }}</td>

            <td>
              <v-btn class="comic-btn" color="primary" @click="selectOrg(org._id)">
                Ouvrir
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>

  <v-dialog v-model="showCreateDialog" max-width="500">
    <v-card class="comic-card">
      <v-card-title class="comic-title">
        Créer une organisation
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="newOrgName"
          class="mt-2"
          label="Nom de l’organisation"
        />

        <v-text-field
          v-model="newOrgSecret"
          class="mt-2"
          label="Phrase secrète"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn class="comic-btn" @click="cancelCreateOrg">
          Annuler
        </v-btn>

        <v-btn
          class="comic-btn"
          color="primary"
          :disabled="newOrgName === '' || newOrgSecret === ''"
          @click="confirmCreateOrg"
        >
          Créer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDataStore } from '@/stores/data'
  import { useSecretStore } from '@/stores/secret'

  const router = useRouter()
  const dataStore = useDataStore()
  const secretStore = useSecretStore()

  const showCreateDialog = ref(false)
  const newOrgName = ref('')
  const newOrgSecret = ref('')

  onMounted(() => {
    load()
  })

  async function load () {
    await dataStore.loadOrgs()
  }

  async function selectOrg (id) {
    await dataStore.loadOrgById(id)
    router.push('/organization')
  }

  function cancelCreateOrg () {
    newOrgName.value = ''
    newOrgSecret.value = ''
    showCreateDialog.value = false
  }

  async function confirmCreateOrg () {
    await dataStore.createOrg(newOrgName.value, newOrgSecret.value)
    secretStore.setSecret(newOrgSecret.value)

    newOrgName.value = ''
    newOrgSecret.value = ''
    showCreateDialog.value = false
  }
</script>

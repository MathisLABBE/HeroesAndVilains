<template>
  <v-card class="comic-card">
    <v-card-title class="d-flex align-center">
      <span class="comic-title">Organisations</span>

      <v-spacer />

      <v-btn class="comic-btn" color="primary" @click="showCreateDialog = true">
        Créer une organisation
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-btn class="mb-4 comic-btn" color="primary" variant="outlined" @click="load">
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

        <transition-group name="list-item" tag="tbody">
          <tr v-for="org in dataStore.orgs" :key="org._id">
            <td>{{ org.name }}</td>
            <td>{{ org._id }}</td>

            <td>
              <v-btn class="comic-btn" color="primary" @click="selectOrg(org._id)">
                Ouvrir
              </v-btn>
            </td>
          </tr>
        </transition-group>
      </v-table>
    </v-card-text>
  </v-card>

  <v-dialog v-model="showCreateDialog" max-width="500" transition="dialog-bottom-transition">
    <v-card class="comic-card">
      <v-card-title class="comic-title">
        Créer une organisation
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="newOrgName"
          class="mt-2"
          label="Nom de l’organisation"
          variant="outlined"
        />

        <v-text-field
          v-model="newOrgSecret"
          class="mt-2"
          label="Phrase secrète"
          variant="outlined"
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
          :disabled="!canCreateOrg"
          @click="confirmCreateOrg"
        >
          Créer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDataStore } from '@/stores/data.store'
  import { useSecretStore } from '@/stores/secret.store'

  const router = useRouter()
  const dataStore = useDataStore()
  const secretStore = useSecretStore()

  const showCreateDialog = ref(false)
  const newOrgName = ref('')
  const newOrgSecret = ref('')

  onMounted(() => {
    load()
  })

  const canCreateOrg = computed(() => {
    return newOrgName.value.trim() !== '' && newOrgSecret.value.trim() !== ''
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

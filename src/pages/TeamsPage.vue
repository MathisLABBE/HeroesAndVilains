<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      Équipes

      <v-spacer />

      <v-btn color="primary" @click="showCreateDialog = true">
        Créer une équipe
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-btn color="primary" variant="outlined" class="mb-4" @click="load">
        Recharger
      </v-btn>

      <v-table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Identifiant</th>
            <th>Nombre d’affiliations</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="team in dataStore.teams" :key="team._id">
            <td>{{ team.name }}</td>
            <td>{{ team._id }}</td>
            <td>{{ team.nbAffiliations }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>

  <v-dialog v-model="showCreateDialog" max-width="500">
    <v-card>
      <v-card-title>Créer une équipe</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="newTeamName"
          label="Nom de l’équipe"
          variant="outlined"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn @click="cancelCreate">
          Annuler
        </v-btn>

        <v-btn
          color="primary"
          :disabled="newTeamName.trim() === ''"
          @click="confirmCreate"
        >
          Créer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDataStore } from '@/stores/data.store'

const dataStore = useDataStore()

const showCreateDialog = ref(false)
const newTeamName = ref('')

onMounted(() => {
  load()
})

async function load() {
  await dataStore.loadTeams()
}

function cancelCreate() {
  newTeamName.value = ''
  showCreateDialog.value = false
}

async function confirmCreate() {
  await dataStore.createTeam(newTeamName.value)

  newTeamName.value = ''
  showCreateDialog.value = false
}
</script>
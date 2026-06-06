<template>
  <v-card v-if="dataStore.currentOrg" class="comic-card">
    <v-card-title class="d-flex align-center comic-title">
      Organisation : {{ dataStore.currentOrg.name }}

      <v-spacer />

      <v-btn class="comic-btn" color="primary" @click="showAddTeam = !showAddTeam">
        Ajouter une équipe
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-card v-if="showAddTeam" class="mb-6 comic-card">
        <v-card-title class="comic-title">
          Ajouter une équipe existante
        </v-card-title>

        <v-card-text>
          <v-select
            v-model="selectedTeamId"
            class="mt-2"
            item-title="name"
            item-value="_id"
            :items="getAvailableTeams()"
            label="Équipe à ajouter"
          />
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn
            class="comic-btn"
            color="primary"
            :disabled="!selectedTeamId"
            @click="confirmAddTeam"
          >
            Valider
          </v-btn>

          <v-btn class="comic-btn" @click="cancelAddTeam">
            Annuler
          </v-btn>
        </v-card-actions>
      </v-card>

      <h2 class="comic-title text-black mb-4">Équipes de l’organisation</h2>

      <v-alert v-if="dataStore.currentOrg.teams.length === 0" class="mb-4" type="info">
        Cette organisation n’a aucune équipe.
      </v-alert>

      <v-table v-else class="comic-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Membres</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="team in dataStore.currentOrg.teams" :key="team._id">
            <td>{{ team.name }}</td>
            <td>{{ team.members.length }}</td>

            <td>
              <v-btn class="mr-2 comic-btn" color="primary" @click="openTeam(team._id)">
                Ouvrir
              </v-btn>

              <v-btn class="comic-btn" color="error" @click="removeTeam(team._id)">
                Retirer
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>

  <v-alert v-else type="warning">
    Aucune organisation sélectionnée ou phrase secrète incorrecte.
  </v-alert>

  <ConfirmDialog ref="confirmDialog" />
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import { useDataStore } from '@/stores/data'

  const router = useRouter()
  const dataStore = useDataStore()

  const showAddTeam = ref(false)
  const selectedTeamId = ref(null)
  const confirmDialog = ref(null)

  onMounted(async () => {
    await dataStore.loadTeams()
  })

  function getAvailableTeams () {
    const teams = []

    for (const team of dataStore.teams) {
      let found = false

      for (const orgTeam of dataStore.currentOrg.teams) {
        if (orgTeam._id === team._id) {
          found = true
        }
      }

      if (!found) {
        teams.push(team)
      }
    }

    return teams
  }

  async function confirmAddTeam () {
    if (!selectedTeamId.value) {
      return
    }

    await dataStore.addTeamInCurrentOrg(selectedTeamId.value)
    selectedTeamId.value = null
  }

  function cancelAddTeam () {
    selectedTeamId.value = null
    showAddTeam.value = false
  }

  async function removeTeam (idTeam) {
    let confirmed = true

    if (confirmDialog.value) {
      confirmed = await confirmDialog.value.open(
        'Retirer une équipe',
        'Voulez-vous vraiment retirer cette équipe de l’organisation ?',
      )
    }

    if (confirmed) {
      await dataStore.removeTeamFromCurrentOrg(idTeam)
    }
  }

  function openTeam (idTeam) {
    dataStore.setCurrentTeamFromOrg(idTeam)
    router.push('/team')
  }
</script>

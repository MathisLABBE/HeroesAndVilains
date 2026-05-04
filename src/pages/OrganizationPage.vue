<template>
  <v-card v-if="dataStore.currentOrg">
    <v-card-title class="d-flex align-center">
      Organisation : {{ dataStore.currentOrg.name }}

      <v-spacer />

      <v-btn color="primary" @click="showAddTeam = !showAddTeam">
        Ajouter une équipe
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-card
        v-if="showAddTeam"
        variant="outlined"
        class="mb-6"
      >
        <v-card-title>Ajouter une équipe existante</v-card-title>

        <v-card-text>
          <v-select
            v-model="selectedTeamId"
            :items="availableTeams"
            item-title="name"
            item-value="_id"
            label="Équipe à ajouter"
            variant="outlined"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="!selectedTeamId"
            @click="confirmAddTeam"
          >
            Valider
          </v-btn>

          <v-btn @click="cancelAddTeam">
            Annuler
          </v-btn>
        </v-card-actions>
      </v-card>

      <h2 class="mb-4">Équipes de l’organisation</h2>

      <v-alert
        v-if="dataStore.currentOrg.teams.length === 0"
        type="info"
        class="mb-4"
      >
        Cette organisation n’a aucune équipe.
      </v-alert>

      <v-table v-else>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Nombre de membres</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="team in dataStore.currentOrg.teams"
            :key="team._id"
          >
            <td>{{ team.name }}</td>
            <td>{{ team.members.length }}</td>
            <td>
              <v-btn
                color="primary"
                size="small"
                class="mr-2"
                @click="openTeam(team._id)"
              >
                Ouvrir
              </v-btn>

              <v-btn
                color="error"
                size="small"
                @click="removeTeam(team._id)"
              >
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

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/data.store'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const router = useRouter()
const dataStore = useDataStore()

const showAddTeam = ref(false)
const selectedTeamId = ref<string | null>(null)

onMounted(async () => {
  await dataStore.loadTeams()
})

const availableTeams = computed(() => {
  if (!dataStore.currentOrg) {
    return dataStore.teams
  }

  const teamIdsInOrg = dataStore.currentOrg.teams.map((team) => team._id)

  return dataStore.teams.filter((team) => {
    return !teamIdsInOrg.includes(team._id)
  })
})

const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null)

async function confirmAddTeam() {
  if (!selectedTeamId.value) {
    return
  }

  await dataStore.addTeamInCurrentOrg(selectedTeamId.value)

  selectedTeamId.value = null
}

function cancelAddTeam() {
  selectedTeamId.value = null
  showAddTeam.value = false
}

async function removeTeam(idTeam: string) {
  const confirmed = await confirmDialog.value?.open(
    'Retirer une équipe',
    'Voulez-vous vraiment retirer cette équipe de l’organisation ?'
  )

  if (!confirmed) {
    return
  }

  await dataStore.removeTeamFromCurrentOrg(idTeam)
}

function openTeam(idTeam: string) {
  dataStore.setCurrentTeamFromOrg(idTeam)
  router.push('/team')
}
</script>
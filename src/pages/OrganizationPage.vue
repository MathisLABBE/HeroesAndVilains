<template>
  <v-card v-if="dataStore.currentOrg" class="comic-card">
    <v-card-title class="d-flex align-center">
      <span class="comic-title">Organisation : {{ dataStore.currentOrg.name }}</span>

      <v-spacer />

      <v-btn color="primary" class="comic-btn" @click="showAddTeam = !showAddTeam">
        {{ showAddTeam ? 'Masquer' : 'Ajouter une équipe' }}
      </v-btn>
    </v-card-title>

    <v-card-text>
      <transition name="bam">
        <v-card
          v-if="showAddTeam"
          class="mb-6 comic-card"
          style="box-shadow: 6px 6px 0 black !important"
        >
          <v-card-title class="comic-title" style="font-size: 1.2rem">Ajouter une équipe existante</v-card-title>

          <v-card-text>
            <v-select
              v-model="selectedTeamId"
              :items="availableTeams"
              item-title="name"
              item-value="_id"
              label="Équipe à ajouter"
              variant="outlined"
              class="mt-2"
            />
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-btn
              color="primary"
              class="comic-btn"
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
      </transition>

      <h2 class="comic-title text-black mb-4" style="text-shadow: none; -webkit-text-stroke: 0.5px black; font-size: 1.5rem">Équipes de l’organisation</h2>

      <v-alert
        v-if="dataStore.currentOrg.teams.length === 0"
        type="info"
        variant="tonal"
        class="mb-4 border-lg border-opacity-100"
        style="border-color: black !important"
      >
        <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Cette organisation n’a aucune équipe.</span>
      </v-alert>

      <v-table v-else class="comic-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Membres</th>
            <th>Actions</th>
          </tr>
        </thead>

        <transition-group name="list-item" tag="tbody">
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
                class="mr-2 comic-btn"
                @click="openTeam(team._id)"
              >
                Ouvrir
              </v-btn>

              <v-btn
                color="error"
                size="small"
                class="comic-btn"
                @click="removeTeam(team._id)"
              >
                Retirer
              </v-btn>
            </td>
          </tr>
        </transition-group>
      </v-table>
    </v-card-text>
  </v-card>

  <v-alert
    v-else
    type="warning"
    variant="tonal"
    class="border-lg border-opacity-100"
    style="border-color: black !important"
  >
    <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Aucune organisation sélectionnée ou phrase secrète incorrecte.</span>
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
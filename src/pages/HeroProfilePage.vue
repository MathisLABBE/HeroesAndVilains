<template>
  <v-card v-if="userStore.currentUser" class="comic-card">
    <v-card-title class="d-flex align-center">
      <span class="comic-title">Profil héros</span>

      <v-spacer />

      <v-btn
        color="warning"
        class="mr-2 comic-btn"
        @click="openEditDialog"
      >
        Modifier mon héros
      </v-btn>

      <v-btn color="error" class="comic-btn" @click="logout">
        Déconnexion
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-alert
        type="success"
        variant="tonal"
        class="mb-4 border-lg border-opacity-100"
        style="border-color: black !important"
      >
        <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Connecté en tant que : {{ userStore.currentUser.login }}</span>
      </v-alert>

      <v-card class="comic-card">
        <v-card-title class="comic-title">
          {{ userStore.currentUser.hero.publicName }}
        </v-card-title>

        <v-card-subtitle class="mt-2 font-weight-bold">
          Nom réel : {{ userStore.currentUser.hero.realName || 'Inconnu' }}
        </v-card-subtitle>

        <v-card-text>
          <h3 class="comic-title text-black mb-2" style="text-shadow: none; -webkit-text-stroke: 0.5px black; font-size: 1.5rem">Pouvoirs</h3>

          <v-alert
            v-if="userStore.currentUser.hero.powers.length === 0"
            type="info"
            variant="tonal"
            density="compact"
            class="border-lg border-opacity-100"
            style="border-color: black !important"
          >
            <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Aucun pouvoir.</span>
          </v-alert>

          <v-table v-else density="compact" class="comic-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Niveau</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="power in userStore.currentUser.hero.powers"
                :key="power._id || power.name"
              >
                <td>{{ power.name }}</td>
                <td>{{ getPowerTypeName(power.type) }}</td>
                <td>{{ power.level }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>

  <v-card v-else class="comic-card">
    <v-card-title class="comic-title">
      Profil héros
    </v-card-title>

    <v-card-text>
      <v-alert
        type="warning"
        variant="tonal"
        class="border-lg border-opacity-100"
        style="border-color: black !important"
      >
        <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Aucun profil chargé.</span>
      </v-alert>

      <v-btn color="primary" class="mt-4 comic-btn" @click="reloadProfile">
        Recharger le profil
      </v-btn>
    </v-card-text>
  </v-card>

  <v-dialog v-model="showEditDialog" max-width="800" transition="dialog-bottom-transition">
    <v-card class="comic-card">
      <v-card-title class="comic-title">
        Modifier mon héros
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="editedHero.publicName"
          label="Nom public"
          variant="outlined"
          class="mt-2"
        />

        <v-text-field
          v-model="editedHero.realName"
          label="Nom réel"
          variant="outlined"
          class="mt-2"
        />

        <div class="d-flex align-center mb-2 mt-4">
          <h3 class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0.5px black; font-size: 1.5rem">Pouvoirs</h3>

          <v-spacer />

          <v-btn color="primary" class="comic-btn" @click="addPower">
            Ajouter un pouvoir
          </v-btn>
        </div>

        <v-alert
          v-if="editedHero.powers.length === 0"
          type="info"
          variant="tonal"
          class="mb-4 border-lg border-opacity-100"
          style="border-color: black !important"
        >
          <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Aucun pouvoir.</span>
        </v-alert>

        <transition-group name="list-item" tag="div">
          <v-card
            v-for="(power, index) in editedHero.powers"
            :key="index"
            class="mb-4 comic-card"
            style="box-shadow: 5px 5px 0 black !important"
          >
            <v-card-title class="d-flex align-center comic-title" style="font-size: 1.2rem">
              Pouvoir {{ index + 1 }}

              <v-spacer />

              <v-btn color="error" class="comic-btn" size="small" @click="removePower(index)">
                Supprimer
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-text-field
                v-model="power.name"
                label="Nom du pouvoir"
                variant="outlined"
                class="mt-2"
              />

              <v-select
                v-model="power.type"
                :items="powerTypes"
                item-title="label"
                item-value="value"
                label="Type"
                variant="outlined"
                class="mt-2"
              />

              <v-text-field
                v-model.number="power.level"
                label="Niveau"
                type="number"
                min="0"
                max="100"
                variant="outlined"
                class="mt-2"
              />
            </v-card-text>
          </v-card>
        </transition-group>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn class="comic-btn" @click="cancelEdit">
          Annuler
        </v-btn>

        <v-btn
          color="primary"
          class="comic-btn"
          :disabled="!canEditHero"
          @click="confirmEdit"
        >
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <ConfirmDialog ref="confirmDialog" />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const router = useRouter()
const userStore = useUserStore()

const showEditDialog = ref(false)

const powerTypes = [
  { value: 1, label: 'Force' },
  { value: 2, label: 'Vitesse' },
  { value: 3, label: 'Endurance' },
  { value: 4, label: 'Magie' },
  { value: 5, label: 'Effrayant' },
  { value: 6, label: 'Furtivité' },
  { value: 7, label: 'Stupidité' },
]

const editedHero = reactive({
  _id: '',
  publicName: '',
  realName: '',
  powers: [] as {
    name: string
    type: number
    level: number
  }[],
})

onMounted(async () => {
  if (userStore.isLogged && !userStore.currentUser) {
    await userStore.loadCurrentUser()
  }
})

const canEditHero = computed(() => {
  if (editedHero.publicName.trim() === '') {
    return false
  }

  for (const power of editedHero.powers) {
    if (power.name.trim() === '') {
      return false
    }

    if (power.type < 1 || power.type > 7) {
      return false
    }

    if (power.level < 0 || power.level > 100) {
      return false
    }
  }

  return true
})

const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null)

async function reloadProfile() {
  await userStore.loadCurrentUser()
}

function openEditDialog() {
  if (!userStore.currentUser) {
    return
  }

  const hero = userStore.currentUser.hero

  editedHero._id = hero._id
  editedHero.publicName = hero.publicName
  editedHero.realName = hero.realName || ''

  editedHero.powers.splice(0, editedHero.powers.length)

  for (const power of hero.powers) {
    editedHero.powers.push({
      name: power.name,
      type: power.type,
      level: power.level,
    })
  }

  showEditDialog.value = true
}

function addPower() {
  editedHero.powers.push({
    name: '',
    type: 1,
    level: 0,
  })
}

function removePower(index: number) {
  editedHero.powers.splice(index, 1)
}

function resetEditedHero() {
  editedHero._id = ''
  editedHero.publicName = ''
  editedHero.realName = ''
  editedHero.powers.splice(0, editedHero.powers.length)
}

function cancelEdit() {
  resetEditedHero()
  showEditDialog.value = false
}

async function confirmEdit() {
  const confirmed = await confirmDialog.value?.open(
    'Modifier mon héros',
    'Voulez-vous vraiment modifier votre héros ?'
  )

  if (!confirmed) {
    return
  }

  const success = await userStore.updateCurrentHero({
    _id: editedHero._id,
    publicName: editedHero.publicName,
    realName: editedHero.realName,
    powers: editedHero.powers.map((power) => ({
      name: power.name,
      type: power.type,
      level: power.level,
    })),
  })

  if (success) {
    resetEditedHero()
    showEditDialog.value = false
  }
}

function logout() {
  userStore.logout()
  router.push('/hero-login')
}

function getPowerTypeName(type: number) {
  switch (type) {
    case 1:
      return 'Force'
    case 2:
      return 'Vitesse'
    case 3:
      return 'Endurance'
    case 4:
      return 'Magie'
    case 5:
      return 'Effrayant'
    case 6:
      return 'Furtivité'
    case 7:
      return 'Stupidité'
    default:
      return 'Inconnu'
  }
}
</script>
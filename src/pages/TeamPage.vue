<template>
  <v-card v-if="dataStore.currentTeam" class="comic-card">
    <v-card-title class="d-flex align-center">
      <span class="comic-title">Équipe : {{ dataStore.currentTeam.name }}</span>

      <v-spacer />

      <v-btn class="mr-2 comic-btn" color="primary" @click="showCreateHeroDialog = true">
        Créer un héros
      </v-btn>

      <v-btn class="comic-btn" color="primary" @click="loadMembers">
        Recharger
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-card class="mb-6 comic-card" style="box-shadow: 6px 6px 0 black !important">
        <v-card-title class="comic-title" style="font-size: 1.2rem">Ajouter un héros existant</v-card-title>

        <v-card-text>
          <v-select
            v-model="selectedHeroId"
            class="mt-2"
            item-title="publicName"
            item-value="_id"
            :items="availableHeroAliases"
            label="Héros à ajouter"
            variant="outlined"
          />
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn
            class="comic-btn"
            color="primary"
            :disabled="!selectedHeroId"
            @click="addExistingHero"
          >
            Ajouter
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-alert
        v-if="dataStore.currentTeam.members.length === 0"
        class="mb-4 border-lg border-opacity-100"
        style="border-color: black !important"
        type="info"
        variant="tonal"
      >
        <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Cette équipe n’a aucun membre.</span>
      </v-alert>

      <v-alert
        v-else-if="dataStore.currentTeamHeroes.length === 0"
        class="mb-4 border-lg border-opacity-100"
        style="border-color: black !important"
        type="warning"
        variant="tonal"
      >
        <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Aucun héros chargé. Vérifie la phrase secrète ou recharge.</span>
      </v-alert>

      <v-row>
        <v-col
          v-for="hero in dataStore.currentTeamHeroes"
          :key="hero._id"
          cols="12"
          md="6"
        >
          <v-card class="comic-card">
            <v-card-title class="d-flex align-center">
              {{ hero.publicName }}

              <v-spacer />

              <v-btn
                class="mr-2 comic-btn"
                color="warning"
                @click="openEditHeroDialog(hero)"
              >
                Modifier
              </v-btn>

              <v-btn
                class="comic-btn"
                color="error"
                @click="removeHero(hero._id)"
              >
                Retirer
              </v-btn>
            </v-card-title>

            <v-card-subtitle class="mt-2 font-weight-bold">
              Nom réel : {{ hero.realName || 'Inconnu' }}
            </v-card-subtitle>

            <v-card-text>
              <h3 class="comic-title text-black mb-2" style="text-shadow: none; -webkit-text-stroke: 0.5px black; font-size: 1.2rem">Pouvoirs</h3>

              <v-alert
                v-if="hero.powers.length === 0"
                class="border-lg border-opacity-100"
                density="compact"
                style="border-color: black !important"
                type="info"
                variant="tonal"
              >
                <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Aucun pouvoir.</span>
              </v-alert>

              <v-table v-else class="comic-table" density="compact">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Type</th>
                    <th>Niveau</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="power in hero.powers"
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
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-alert
    v-else
    class="border-lg border-opacity-100"
    style="border-color: black !important"
    type="warning"
    variant="tonal"
  >
    <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Aucune équipe sélectionnée. Retourne dans une organisation.</span>
  </v-alert>

  <v-dialog v-model="showCreateHeroDialog" max-width="800" scrollable transition="dialog-bottom-transition">
    <v-card class="comic-card">
      <v-card-title class="comic-title">
        Créer un nouveau héros
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="newHero.publicName"
          class="mt-2"
          label="Nom public"
          variant="outlined"
        />

        <v-text-field
          v-model="newHero.realName"
          class="mt-2"
          label="Nom réel"
          variant="outlined"
        />

        <div class="d-flex align-center mb-2 mt-4">
          <h3 class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0.5px black; font-size: 1.5rem">Pouvoirs</h3>

          <v-spacer />

          <v-btn class="comic-btn" color="primary" @click="addPower">
            Ajouter un pouvoir
          </v-btn>
        </div>

        <v-alert
          v-if="newHero.powers.length === 0"
          class="mb-4 border-lg border-opacity-100"
          style="border-color: black !important"
          type="info"
          variant="tonal"
        >
          <span class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0">Aucun pouvoir ajouté.</span>
        </v-alert>

        <transition-group name="list-item" tag="div">
          <v-card
            v-for="(power, index) in newHero.powers"
            :key="index"
            class="mb-4 comic-card"
            style="box-shadow: 5px 5px 0 black !important"
          >
            <v-card-title class="d-flex align-center comic-title" style="font-size: 1.2rem">
              Pouvoir {{ index + 1 }}

              <v-spacer />

              <v-btn class="comic-btn" color="error" size="small" @click="removePower(index)">
                Supprimer
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-text-field
                v-model="power.name"
                class="mt-2"
                label="Nom du pouvoir"
                variant="outlined"
              />

              <v-select
                v-model="power.type"
                class="mt-2"
                item-title="label"
                item-value="value"
                :items="powerTypes"
                label="Type"
                variant="outlined"
              />

              <v-text-field
                v-model.number="power.level"
                class="mt-2"
                label="Niveau"
                max="100"
                min="0"
                type="number"
                variant="outlined"
              />
            </v-card-text>
          </v-card>
        </transition-group>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn class="comic-btn" @click="cancelCreateHero">
          Annuler
        </v-btn>

        <v-btn
          class="comic-btn"
          color="primary"
          :disabled="!canCreateHero"
          @click="confirmCreateHero"
        >
          Créer et ajouter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showEditHeroDialog" max-width="800" scrollable transition="dialog-bottom-transition">
    <v-card class="comic-card">
      <v-card-title class="comic-title">
        Modifier un héros
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="editedHero.publicName"
          class="mt-2"
          label="Nom public"
          variant="outlined"
        />

        <v-text-field
          v-model="editedHero.realName"
          class="mt-2"
          label="Nom réel"
          variant="outlined"
        />

        <div class="d-flex align-center mb-2 mt-4">
          <h3 class="comic-title text-black" style="text-shadow: none; -webkit-text-stroke: 0.5px black; font-size: 1.5rem">Pouvoirs</h3>

          <v-spacer />

          <v-btn class="comic-btn" color="primary" @click="addEditedPower">
            Ajouter un pouvoir
          </v-btn>
        </div>

        <v-alert
          v-if="editedHero.powers.length === 0"
          class="mb-4 border-lg border-opacity-100"
          style="border-color: black !important"
          type="info"
          variant="tonal"
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

              <v-btn class="comic-btn" color="error" size="small" @click="removeEditedPower(index)">
                Supprimer
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-text-field
                v-model="power.name"
                class="mt-2"
                label="Nom du pouvoir"
                variant="outlined"
              />

              <v-select
                v-model="power.type"
                class="mt-2"
                item-title="label"
                item-value="value"
                :items="powerTypes"
                label="Type"
                variant="outlined"
              />

              <v-text-field
                v-model.number="power.level"
                class="mt-2"
                label="Niveau"
                max="100"
                min="0"
                type="number"
                variant="outlined"
              />
            </v-card-text>
          </v-card>
        </transition-group>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn class="comic-btn" @click="cancelEditHero">
          Annuler
        </v-btn>

        <v-btn
          class="comic-btn"
          color="primary"
          :disabled="!canEditHero"
          @click="confirmEditHero"
        >
          Modifier
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <ConfirmDialog ref="confirmDialog" />
</template>

<script setup>
  import { computed, onMounted, reactive, ref } from 'vue'
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import { useDataStore } from '@/stores/data.store'

  const dataStore = useDataStore()

  const selectedHeroId = ref(null)
  const showCreateHeroDialog = ref(false)

  const powerTypes = [
    { value: 1, label: 'Force' },
    { value: 2, label: 'Vitesse' },
    { value: 3, label: 'Endurance' },
    { value: 4, label: 'Magie' },
    { value: 5, label: 'Effrayant' },
    { value: 6, label: 'Furtivité' },
    { value: 7, label: 'Stupidité' },
  ]

  const newHero = reactive({
    publicName: '',
    realName: '',
    powers: [],
  })

  onMounted(async () => {
    await dataStore.loadHeroAliases()
    await loadMembers()
  })

  const availableHeroAliases = computed(() => {
    if (!dataStore.currentTeam) {
      return dataStore.heroAliases
    }

    return dataStore.heroAliases.filter(hero => {
      return !dataStore.currentTeam?.members.includes(hero._id)
    })
  })

  const canCreateHero = computed(() => {
    if (newHero.publicName.trim() === '') {
      return false
    }

    for (const power of newHero.powers) {
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

  const showEditHeroDialog = ref(false)

  const editedHero = reactive({
    _id: '',
    publicName: '',
    realName: '',
    powers: [],
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

  const confirmDialog = ref(null)

  async function loadMembers () {
    await dataStore.loadHeroesForCurrentTeam()
  }

  async function addExistingHero () {
    if (!selectedHeroId.value) {
      return
    }

    await dataStore.addExistingHeroToCurrentTeam(selectedHeroId.value)

    selectedHeroId.value = null
  }

  async function removeHero (idHero) {
    const confirmed = await confirmDialog.value?.open(
      'Retirer un héros',
      'Voulez-vous vraiment retirer ce héros de l’équipe ?',
    )

    if (!confirmed) {
      return
    }

    await dataStore.removeHeroFromCurrentTeam(idHero)
  }

  function addPower () {
    newHero.powers.push({
      name: '',
      type: 1,
      level: 0,
    })
  }

  function removePower (index) {
    newHero.powers.splice(index, 1)
  }

  function resetNewHero () {
    newHero.publicName = ''
    newHero.realName = ''
    newHero.powers.splice(0)
  }

  function cancelCreateHero () {
    resetNewHero()
    showCreateHeroDialog.value = false
  }

  async function confirmCreateHero () {
    await dataStore.createHeroAndAddToCurrentTeam({
      publicName: newHero.publicName,
      realName: newHero.realName,
      powers: newHero.powers.map(power => ({
        name: power.name,
        type: power.type,
        level: power.level,
      })),
    })

    resetNewHero()
    showCreateHeroDialog.value = false
  }

  function getPowerTypeName (type) {
    switch (type) {
      case 1: {
        return 'Force'
      }
      case 2: {
        return 'Vitesse'
      }
      case 3: {
        return 'Endurance'
      }
      case 4: {
        return 'Magie'
      }
      case 5: {
        return 'Effrayant'
      }
      case 6: {
        return 'Furtivité'
      }
      case 7: {
        return 'Stupidité'
      }
      default: {
        return 'Inconnu'
      }
    }
  }

  function openEditHeroDialog (hero) {
    editedHero._id = hero._id
    editedHero.publicName = hero.publicName
    editedHero.realName = hero.realName || ''

    editedHero.powers.splice(0)

    for (const power of hero.powers) {
      editedHero.powers.push({
        name: power.name,
        type: power.type,
        level: power.level,
      })
    }

    showEditHeroDialog.value = true
  }

  function addEditedPower () {
    editedHero.powers.push({
      name: '',
      type: 1,
      level: 0,
    })
  }

  function removeEditedPower (index) {
    editedHero.powers.splice(index, 1)
  }

  function resetEditedHero () {
    editedHero._id = ''
    editedHero.publicName = ''
    editedHero.realName = ''
    editedHero.powers.splice(0)
  }

  function cancelEditHero () {
    resetEditedHero()
    showEditHeroDialog.value = false
  }

  async function confirmEditHero () {
    const confirmed = await confirmDialog.value?.open(
      'Modifier un héros',
      'Voulez-vous vraiment modifier ce héros ?',
    )

    if (!confirmed) {
      return
    }

    await dataStore.updateHeroInCurrentTeam({
      _id: editedHero._id,
      publicName: editedHero.publicName,
      realName: editedHero.realName,
      powers: editedHero.powers.map(power => ({
        name: power.name,
        type: power.type,
        level: power.level,
      })),
    })

    resetEditedHero()
    showEditHeroDialog.value = false
  }
</script>

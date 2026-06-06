<template>
  <v-card v-if="dataStore.currentTeam" class="comic-card">
    <v-card-title class="d-flex align-center comic-title">
      Équipe : {{ dataStore.currentTeam.name }}

      <v-spacer />

      <v-btn class="mr-2 comic-btn" color="primary" @click="showCreateHeroDialog = true">
        Créer un héros
      </v-btn>

      <v-btn class="comic-btn" color="primary" @click="loadMembers">
        Recharger
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-card class="mb-6 comic-card">
        <v-card-title class="comic-title">
          Ajouter un héros existant
        </v-card-title>

        <v-card-text>
          <v-select
            v-model="selectedHeroId"
            class="mt-2"
            item-title="publicName"
            item-value="_id"
            :items="getAvailableHeroAliases()"
            label="Héros à ajouter"
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

      <v-alert v-if="dataStore.currentTeam.members.length === 0" class="mb-4" type="info">
        Cette équipe n’a aucun membre.
      </v-alert>

      <v-alert v-else-if="dataStore.currentTeamHeroes.length === 0" class="mb-4" type="warning">
        Aucun héros chargé. Vérifie la phrase secrète ou recharge.
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

              <v-btn class="mr-2 comic-btn" color="warning" @click="openEditHeroDialog(hero)">
                Modifier
              </v-btn>

              <v-btn class="comic-btn" color="error" @click="removeHero(hero._id)">
                Retirer
              </v-btn>
            </v-card-title>

            <v-card-subtitle class="mt-2 font-weight-bold">
              Nom réel : {{ hero.realName || 'Inconnu' }}
            </v-card-subtitle>

            <v-card-text>
              <h3 class="comic-title text-black mb-2">Pouvoirs</h3>

              <v-alert v-if="hero.powers.length === 0" type="info">
                Aucun pouvoir.
              </v-alert>

              <v-table v-else class="comic-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Type</th>
                    <th>Niveau</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="power in hero.powers" :key="power.name">
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

  <v-alert v-else type="warning">
    Aucune équipe sélectionnée. Retourne dans une organisation.
  </v-alert>

  <v-dialog v-model="showCreateHeroDialog" max-width="800">
    <v-card class="comic-card">
      <v-card-title class="comic-title">
        Créer un nouveau héros
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="newHero.publicName"
          class="mt-2"
          label="Nom public"
        />

        <v-text-field
          v-model="newHero.realName"
          class="mt-2"
          label="Nom réel"
        />

        <div class="d-flex align-center mb-2 mt-4">
          <h3 class="comic-title text-black">Pouvoirs</h3>

          <v-spacer />

          <v-btn class="comic-btn" color="primary" @click="addPower">
            Ajouter un pouvoir
          </v-btn>
        </div>

        <v-alert v-if="newHero.powers.length === 0" class="mb-4" type="info">
          Aucun pouvoir ajouté.
        </v-alert>

        <v-card
          v-for="(power, index) in newHero.powers"
          :key="index"
          class="mb-4 comic-card"
        >
          <v-card-title class="d-flex align-center comic-title">
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
            />

            <v-select
              v-model="power.type"
              class="mt-2"
              item-title="label"
              item-value="value"
              :items="POWER_TYPES"
              label="Type"
            />

            <v-text-field
              v-model="power.level"
              class="mt-2"
              label="Niveau"
              max="100"
              min="0"
              type="number"
            />
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn class="comic-btn" @click="cancelCreateHero">
          Annuler
        </v-btn>

        <v-btn class="comic-btn" color="primary" :disabled="!isHeroValid(newHero)" @click="confirmCreateHero">
          Créer et ajouter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showEditHeroDialog" max-width="800">
    <v-card class="comic-card">
      <v-card-title class="comic-title">
        Modifier un héros
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="editedHero.publicName"
          class="mt-2"
          label="Nom public"
        />

        <v-text-field
          v-model="editedHero.realName"
          class="mt-2"
          label="Nom réel"
        />

        <div class="d-flex align-center mb-2 mt-4">
          <h3 class="comic-title text-black">Pouvoirs</h3>

          <v-spacer />

          <v-btn class="comic-btn" color="primary" @click="addEditedPower">
            Ajouter un pouvoir
          </v-btn>
        </div>

        <v-alert v-if="editedHero.powers.length === 0" class="mb-4" type="info">
          Aucun pouvoir.
        </v-alert>

        <v-card
          v-for="(power, index) in editedHero.powers"
          :key="index"
          class="mb-4 comic-card"
        >
          <v-card-title class="d-flex align-center comic-title">
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
            />

            <v-select
              v-model="power.type"
              class="mt-2"
              item-title="label"
              item-value="value"
              :items="POWER_TYPES"
              label="Type"
            />

            <v-text-field
              v-model="power.level"
              class="mt-2"
              label="Niveau"
              max="100"
              min="0"
              type="number"
            />
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn class="comic-btn" @click="cancelEditHero">
          Annuler
        </v-btn>

        <v-btn class="comic-btn" color="primary" :disabled="!isHeroValid(editedHero)" @click="confirmEditHero">
          Modifier
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <ConfirmDialog ref="confirmDialog" />
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import { useDataStore } from '@/stores/data'

  const dataStore = useDataStore()

  const selectedHeroId = ref(null)
  const showCreateHeroDialog = ref(false)
  const showEditHeroDialog = ref(false)
  const confirmDialog = ref(null)

  const POWER_TYPES = [
    { value: 1, label: 'Force' },
    { value: 2, label: 'Vitesse' },
    { value: 3, label: 'Endurance' },
    { value: 4, label: 'Magie' },
    { value: 5, label: 'Effrayant' },
    { value: 6, label: 'Furtivité' },
    { value: 7, label: 'Stupidité' },
  ]

  const newHero = ref(createEmptyHero())
  const editedHero = ref(createEmptyHero())

  onMounted(async () => {
    await dataStore.loadHeroAliases()
    await loadMembers()
  })

  function getAvailableHeroAliases () {
    const heroes = []

    for (const hero of dataStore.heroAliases) {
      let found = false

      if (dataStore.currentTeam) {
        for (const idHero of dataStore.currentTeam.members) {
          if (idHero === hero._id) {
            found = true
          }
        }
      }

      if (!found) {
        heroes.push(hero)
      }
    }

    return heroes
  }

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
    let confirmed = true

    if (confirmDialog.value) {
      confirmed = await confirmDialog.value.open(
        'Retirer un héros',
        'Voulez-vous vraiment retirer ce héros de l’équipe ?',
      )
    }

    if (confirmed) {
      await dataStore.removeHeroFromCurrentTeam(idHero)
    }
  }

  function createEmptyHero () {
    return {
      _id: '',
      publicName: '',
      realName: '',
      powers: [],
    }
  }

  function createEmptyPower () {
    return {
      name: '',
      type: 1,
      level: 0,
    }
  }

  function isPowerValid (power) {
    return power.name !== ''
      && power.level >= 0
      && power.level <= 100
  }

  function isHeroValid (hero) {
    if (hero.publicName === '') {
      return false
    }

    for (const power of hero.powers) {
      if (!isPowerValid(power)) {
        return false
      }
    }

    return true
  }

  function copyHeroForRequest (hero) {
    const powers = []

    for (const power of hero.powers) {
      powers.push({
        name: power.name,
        type: power.type,
        level: Number(power.level),
      })
    }

    return {
      _id: hero._id,
      publicName: hero.publicName,
      realName: hero.realName,
      powers,
    }
  }

  function addPower () {
    newHero.value.powers.push(createEmptyPower())
  }

  function removePower (index) {
    newHero.value.powers.splice(index, 1)
  }

  function cancelCreateHero () {
    newHero.value = createEmptyHero()
    showCreateHeroDialog.value = false
  }

  async function confirmCreateHero () {
    await dataStore.createHeroAndAddToCurrentTeam(copyHeroForRequest(newHero.value))

    newHero.value = createEmptyHero()
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
    editedHero.value = {
      _id: hero._id,
      publicName: hero.publicName,
      realName: hero.realName || '',
      powers: [],
    }

    for (const power of hero.powers) {
      editedHero.value.powers.push({
        name: power.name,
        type: power.type,
        level: power.level,
      })
    }

    showEditHeroDialog.value = true
  }

  function addEditedPower () {
    editedHero.value.powers.push(createEmptyPower())
  }

  function removeEditedPower (index) {
    editedHero.value.powers.splice(index, 1)
  }

  function cancelEditHero () {
    editedHero.value = createEmptyHero()
    showEditHeroDialog.value = false
  }

  async function confirmEditHero () {
    let confirmed = true

    if (confirmDialog.value) {
      confirmed = await confirmDialog.value.open(
        'Modifier un héros',
        'Voulez-vous vraiment modifier ce héros ?',
      )
    }

    if (confirmed) {
      await dataStore.updateHeroInCurrentTeam(copyHeroForRequest(editedHero.value))
      editedHero.value = createEmptyHero()
      showEditHeroDialog.value = false
    }
  }
</script>

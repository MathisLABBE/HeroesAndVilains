<template>
  <v-card v-if="authStore.currentUser" class="comic-card">
    <v-card-title class="d-flex align-center comic-title">
      Profil héros

      <v-spacer />

      <v-btn class="mr-2 comic-btn" color="warning" @click="openEditDialog">
        Modifier mon héros
      </v-btn>

      <v-btn class="comic-btn" color="error" @click="logout">
        Déconnexion
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-alert class="mb-4" type="success">
        Connecté en tant que : {{ authStore.currentUser.login }}
      </v-alert>

      <v-card class="comic-card">
        <v-card-title class="comic-title">
          {{ authStore.currentUser.hero.publicName }}
        </v-card-title>

        <v-card-subtitle class="mt-2 font-weight-bold">
          Nom réel : {{ authStore.currentUser.hero.realName || 'Inconnu' }}
        </v-card-subtitle>

        <v-card-text>
          <h3 class="comic-title text-black mb-2">Pouvoirs</h3>

          <v-alert v-if="authStore.currentUser.hero.powers.length === 0" type="info">
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
              <tr v-for="power in authStore.currentUser.hero.powers" :key="power.name">
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
      <v-alert type="warning">
        Aucun profil chargé.
      </v-alert>

      <v-btn class="mt-4 comic-btn" color="primary" @click="reloadProfile">
        Recharger le profil
      </v-btn>
    </v-card-text>
  </v-card>

  <v-dialog v-model="showEditDialog" max-width="800">
    <v-card class="comic-card">
      <v-card-title class="comic-title">
        Modifier mon héros
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

          <v-btn class="comic-btn" color="primary" @click="addPower">
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
              :items="powerTypes"
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

        <v-btn class="comic-btn" @click="cancelEdit">
          Annuler
        </v-btn>

        <v-btn class="comic-btn" color="primary" :disabled="!isHeroValid()" @click="confirmEdit">
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <ConfirmDialog ref="confirmDialog" />
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const showEditDialog = ref(false)
  const confirmDialog = ref(null)

  const powerTypes = [
    { value: 1, label: 'Force' },
    { value: 2, label: 'Vitesse' },
    { value: 3, label: 'Endurance' },
    { value: 4, label: 'Magie' },
    { value: 5, label: 'Effrayant' },
    { value: 6, label: 'Furtivité' },
    { value: 7, label: 'Stupidité' },
  ]

  const editedHero = ref(createEmptyHero())

  onMounted(async () => {
    if (authStore.isLogged && !authStore.currentUser) {
      await authStore.loadCurrentUser()
    }
  })

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

  function isHeroValid () {
    if (editedHero.value.publicName === '') {
      return false
    }

    for (const power of editedHero.value.powers) {
      if (power.name === '') {
        return false
      }

      if (power.level < 0 || power.level > 100) {
        return false
      }
    }

    return true
  }

  async function reloadProfile () {
    await authStore.loadCurrentUser()
  }

  function openEditDialog () {
    if (!authStore.currentUser) {
      return
    }

    const hero = authStore.currentUser.hero

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

    showEditDialog.value = true
  }

  function addPower () {
    editedHero.value.powers.push(createEmptyPower())
  }

  function removePower (index) {
    editedHero.value.powers.splice(index, 1)
  }

  function cancelEdit () {
    editedHero.value = createEmptyHero()
    showEditDialog.value = false
  }

  function copyHeroForRequest () {
    const powers = []

    for (const power of editedHero.value.powers) {
      powers.push({
        name: power.name,
        type: power.type,
        level: Number(power.level),
      })
    }

    return {
      _id: editedHero.value._id,
      publicName: editedHero.value.publicName,
      realName: editedHero.value.realName,
      powers,
    }
  }

  async function confirmEdit () {
    let confirmed = true

    if (confirmDialog.value) {
      confirmed = await confirmDialog.value.open(
        'Modifier mon héros',
        'Voulez-vous vraiment modifier votre héros ?',
      )
    }

    if (confirmed) {
      const success = await authStore.updateCurrentHero(copyHeroForRequest())

      if (success) {
        editedHero.value = createEmptyHero()
        showEditDialog.value = false
      }
    }
  }

  function logout () {
    authStore.logout()
    router.push('/hero-login')
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
</script>

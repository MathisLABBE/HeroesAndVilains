<template>
  <v-row justify="center" align="center" class="text-center fill-height">
    <v-col cols="12" md="8">
      <div class="comic-hero-section">
        <h1 class="text-h1 mb-4">Heroes & Vilains</h1>
        <p class="text-h4 mb-8 comic-subtitle">Choisissez votre camp. Forgez votre légende.</p>
        
        <v-row>
          <v-col cols="12" sm="6">
            <v-card class="comic-card pa-6 hero-highlight" @click="themeStore.setMode('hero')">
              <v-icon size="64" color="blue">mdi-shield-sun</v-icon>
              <h2 class="mt-4">Justice</h2>
              <p>Rejoignez les rangs des protecteurs de l'humanité.</p>
              <v-btn color="blue" class="comic-btn mt-4">Devenir un Héros</v-btn>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6">
            <v-card class="comic-card pa-6 villain-highlight" @click="themeStore.setMode('villain')">
              <v-icon size="64" color="purple">mdi-skull-crossbones</v-icon>
              <h2 class="mt-4">Chaos</h2>
              <p>Prenez ce qui vous revient et régnez sur les ombres.</p>
              <v-btn color="purple" class="comic-btn mt-4">Devenir un Vilain</v-btn>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme.store'

const themeStore = useThemeStore()
</script>

<style lang="scss" scoped>
.comic-hero-section {
  padding: 40px;
  background: white;
  border: 4px solid black;
  box-shadow: 12px 12px 0px rgba(0,0,0,0.2);
  transform: rotate(-1deg);
}

.comic-subtitle {
  font-family: 'Bangers', cursive;
  color: black;
  -webkit-text-stroke: 0;
  text-shadow: none;
}

.hero-highlight:hover {
  background-color: #e3f2fd;
}

.villain-highlight:hover {
  background-color: #f3e5f5;
}
</style>
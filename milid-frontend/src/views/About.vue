<template>
  <div class="about">
    <!-- TOOLBAR -->
    <nav class="toolbar">
      <div class="toolbar-row">
        <div class="toolbar-section-start">
          <button class="start icon" @click="onBack()">
            <MILIDIcons name="back" color="white"/>
          </button>
        </div>

        <div class="toolbar-title">
          <MILIDIcons name="logo" width="80" color="white"/>
        </div>

        <div class="toolbar-section-end">
          <button class="icon end">
            <MILIDIcons name="parametres" color="white" @wasClicked="showParameters = true"/>
          </button>
        </div>
      </div>
    </nav>

    <ParametersPage :open="showParameters" v-on:closerequest="showParameters = false" />

    <div class="about-content">

      <h1>À propos</h1>
      <p>DEMIMO a vu le jour dans le cadre de l’appel à projet du bureau de la stratégie numérique, entre la HEG et la HEAD.</p>

      <p>HEG (Haute Ecole de gestion de Genève) : La HEG est la seule de Suisse à regrouper les quatre filières d'études reliées au domaine de l'économie et des services : économie d'entreprise, informatique de gestion, information documentaire et International Business Management.</p>

      <p>HEAD (Haute Ecole d’Art et de Design) : La HEAD est née en 2006 de la fusion de deux écoles bicentenaires (l’Ecole supérieure des Beaux-Arts et de la Haute école d’Arts appliqués) et s’est imposée comme l’une des meilleures écoles d’art et de design en Europe.</p>

      <p>HEAD (Haute Ecole d’Art et de Design) : La HEAD est née en 2006 de la fusion de deux écoles bicentenaires (l’Ecole supérieure des Beaux-Arts et de la Haute école d’Arts appliqués) et s’est imposée comme l’une des meilleures écoles d’art et de design en Europe.</p>

      <p>Le projet a été réalisé sous la supervision de René Schneider (HEG) et Anthony Masure (HEAD), le contenu a été créé par Nicolas Tregan, le design et les médias ont été créés par Vincent de Vevey. Amir Alwash a adapté la partie informatique. Éloïse Morisod et Joseph Baud-Grasset ont assistés le projet.</p>
    </div>
  </div>
</template>


<style lang="scss" scoped>

  .about{
    background: white;
    color: #333;
    position: absolute;
    width: 100vw;
    height: auto;
    padding-top: 80px;
    .toolbar{
      transform: translateY(0);
      transition: all 200ms;
      top:0px;
      background-color: var(--md-theme-default-primary);
      height: 69px;
      -box-shadow: 0 2px 3px -1px rgba(0,0,0,.1);
      &.exited {
        transform: translateY(69px);
      }

      .toolbar-title{
        img.logo{
          width: 60px;
          transform: translateY(-25px);
          margin-top: 25px;
        }
      }
    }
  }

  .about-content
  {
    margin: 20px;
    text-align: left;
  }
</style>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import MILIDIcons from '../components/MILIDIcons.vue';
import ParametersPage from '../components/ParametersPage.vue';
import  cfg from '../../package.json';

@Component({
  components: {
    MILIDIcons,
    ParametersPage,
  },
})
export default class About extends Vue {

  version = cfg.version;

  showParameters = false;

  onBack() {
    this.$router.go(-1);
    //this.$router.push({ path: `/module`});
  }

}
</script>

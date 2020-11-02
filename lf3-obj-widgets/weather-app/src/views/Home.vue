<template lang="pug">
    .weather-app--widget-container
      TemperatureDisplayComponent
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TemperatureDisplayComponent from "../components/TemperatureDisplay.vue";

@Component({
  components: {
    TemperatureDisplayComponent,
  },
})
export default class Home extends Vue {}
</script>

<style lang="scss">
.weather-app--widget-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
</style>

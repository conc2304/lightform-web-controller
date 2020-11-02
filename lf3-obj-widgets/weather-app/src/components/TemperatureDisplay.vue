<template lang="pug">
  .temperature-display--container
    .temperature-display--hero
      .temperature-display--current-temp {{ tempFormatted }}&deg;&nbsp;{{ unit }}
      .temperature-display--condition-icon
        v-img( v-if="todaysCondition.icon.length" v-bind:src="todaysCondition.icon")
    .temperature-display--forecasted-condition {{ todaysCondition.text }}
    .temperature-display--location {{ locationFormatted }}
    .temperature-display--sub-info-container
      p Feels Like: {{ feelslikeFormatted }}&deg; {{ unit }}
      p Humidity: {{ humidity || "--" }}%

    .temperature-display--ui-container( v-show="displayUiController")
      v-text-field.temperature-display--location-input(
        @keyup.enter="onWeatherLocationInput($event)"
        placeholder="Enter City or Zipcode"
        label="Location"
        outlined
        color="#2c65ff"
      )
      v-btn.temperature-display--unit-toggle(
        @click="toggleTemperatureScale"
        outlined
        fab
        color="#15c595"
      ) C/F

      .temerature-display--ui-container-break
      
      v-btn.temperature-diaplay--refresh-btn( 
        small
        @click="refreshWeatherData()"
        color="#5885ff"
      ) refresh


</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import WeatherFetcher from "../services/WeatherFetcher.service";
import {
  LfWeatherInfo,
  Condition,
  Location,
} from "../shared/models/lf-weather-info";

export interface TemperatureInfo {
  scaleName: TemperatureScaleName;
  scaleSymbol: TemperatureScaleSymbol;
}

export enum TemperatureScaleName {
  Fahrenheit = "Fahrenheit",
  Celcius = "Celcius",
}

export enum TemperatureScaleSymbol {
  Fahrenheit = "F",
  Celcius = "C",
}

declare global {
  interface Window {
    __LF_TOGGLE_UI_CONTROLLER: Function;
    __LF_WEATHER_APP_COMPONENT: TemperatureDisplayComponent;
  }
}

@Component({
  components: {},
})
export default class TemperatureDisplayComponent extends Vue {
  /** PROPERTIES ------------------------- */

  /** PUBLIC PROPERTIES------------------- */
  public errorMsg!: string;
  public error = false;
  public temperatureScale: TemperatureScaleName =
    TemperatureScaleName.Fahrenheit;

  public locationModel!: string;
  public displayUiController = false;

  public unit: TemperatureScaleSymbol = TemperatureScaleSymbol.Fahrenheit;
  public location: Location = {
    name: "",
    region: "",
    country: "",
  };

  public tempF: number | null = null;
  public tempC: number | null = null;
  public condition: Condition = {
    icon: "",
    text: "",
    code: 0,
  };

  public feelsLikeF: number | null = 0;
  public feelsLikeC: number | null = 0;
  public humidity: number | null = 0;
  public todaysMinTempF: number | null = 0;
  public todaysMaxTempF: number | null = 0;
  public todaysMinTempC: number | null = 0;
  public todaysMaxTempC: number | null = 0;
  public todaysChanceOfRain: number | null = 0;
  public todaysCondition: Condition = {
    icon: "",
    text: "",
    code: 0,
  };

  public get tempFormatted(): string {
    const tempByUnit =
      this.temperatureScale !== TemperatureScaleName.Celcius
        ? this.tempF
        : this.tempC;

    return this.formatTemperature(tempByUnit);
  }

  public get feelslikeFormatted(): string {
    const tempByUnit =
      this.temperatureScale !== TemperatureScaleName.Celcius
        ? this.feelsLikeF
        : this.feelsLikeC;

    return this.formatTemperature(tempByUnit);
  }

  public get switchToUnitName(): TemperatureScaleName {
    return this.temperatureScale === TemperatureScaleName.Fahrenheit
      ? TemperatureScaleName.Celcius
      : TemperatureScaleName.Fahrenheit;
  }

  public get locationFormatted(): string {
    let locationFormatted = "";

    if (!this.location) return locationFormatted;

    if (this.location.name) {
      locationFormatted += this.location.name;
    }

    if (this.location.region) {
      if (this.location.name) {
        locationFormatted += ", ";
      }
      locationFormatted += this.location.region;
    }

    if (this.location.country) {
      if (locationFormatted.length) {
        locationFormatted += " - ";
      }
      locationFormatted += this.location.country;
    }
    return locationFormatted;
  }

  /** PUBLIC METHODS --------------------- */

  public toggleTemperatureScale(): void {
    this.temperatureScale =
      this.temperatureScale === TemperatureScaleName.Fahrenheit
        ? TemperatureScaleName.Celcius
        : TemperatureScaleName.Fahrenheit;

    this.unit =
      this.unit === TemperatureScaleSymbol.Fahrenheit
        ? TemperatureScaleSymbol.Celcius
        : TemperatureScaleSymbol.Fahrenheit;
  }

  public formatTemperature(temp: number | null) {
    let formattedTemp = "";
    if (temp) {
      const roundedTemp = Math.round(temp);
      formattedTemp = roundedTemp.toString();
    } else {
      formattedTemp = "--";
    }

    return formattedTemp;
  }

  public onWeatherLocationInput(event: KeyboardEvent) {
    const target = event.target as HTMLTextAreaElement;
    this.locationModel = target.value;

    if (location) {
      this.getWeatherData(this.locationModel);
    }

    target.value = "";
  }

  public refreshWeatherData() {
    this.getWeatherData(this.locationModel);
  }

  /** LIFECYCLE HOOKS  ------------------- */

  created(): void {
    window.__LF_WEATHER_APP_COMPONENT = this;
  }

  mounted(): void {
    this.getWeatherData();
  }

  /** PRIVATE PROPERTIES ----------------- */
  // Getter/Setter backing variables and defaults

  /** PRIVATE METHODS -------------------- */
  private async getWeatherData(location = "San Francisco") {
    await WeatherFetcher.getCurrentWeather(location)
      .then(response => {
        const model = new LfWeatherInfo();
        model.applyResponse(response);

        this.location = model.location;
        this.tempF = model.tempF;
        this.tempC = model.tempC;
        this.condition = model.condition;
        this.feelsLikeC = model.feelsLikeC;
        this.feelsLikeF = model.feelsLikeF;
        this.humidity = model.humidity;

        this.todaysMinTempF = model.todaysMinTempF;
        this.todaysMaxTempF = model.todaysMaxTempF;
        this.todaysMinTempC = model.todaysMinTempC;
        this.todaysMaxTempC = model.todaysMaxTempC;
        this.todaysChanceOfRain = model.todaysChanceOfRain;
        this.todaysCondition = model.todaysCondition;
      })
      .catch(error => {
        const errorMsg = "Unable to get local weather.";
        this.displayError(errorMsg);
        throw error;
      });
  }

  private displayError(errorMessage: string): void {
    this.errorMsg = errorMessage;
    this.error = true;
    setTimeout(() => {
      this.errorMsg = "";
      this.error = false;
    }, 3000);
  }

  private toggleUiDisplay(): void {
    this.displayUiController = !this.displayUiController;
  }
}

window.__LF_TOGGLE_UI_CONTROLLER = function(vuecompenent: any) {
  vuecompenent.toggleUiDisplay();
};
</script>

<style lang="scss" scoped>
.temperature-display--wrapper {
  display: flex;
  justify-content: space-around;
  align-content: center;
}

.temperature-display--container {
  $padding: 2rem;
  max-width: 60%;
  border: 1px solid $color-brand-white-base;
  border-radius: $padding;
  padding: $padding;

  h3 {
    text-align: center;
  }
}

.temperature-display--hero {
  display: flex;
  justify-content: center;
}

.temperature-display--current-temp {
  font-size: 9rem;
  line-height: 9rem;
}

.temperature-display--forecasted-condition {
  font-size: 2.2rem;
  line-height: 2.4rem;
  text-align: center;
  margin-bottom: 3rem;
}

.temperature-display--sub-info-container {
  font-size: 2rem;
  display: flex;
  justify-content: space-between;
  align-content: center;

  & > * {
    padding: 0.8rem;
  }
}

.temperature-display--location {
  font-size: 1rem;
  text-align: center;
}

.temperature-display--condition-icon {
  max-width: 50%;
}

.temperature-display--ui-container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-between;
}

.temperature-display--unit-toggle {
  margin-left: 2rem;
}

.temerature-display--ui-container-break {
  height: 0;
  flex-basis: 100%;
}

.temperature-diaplay--refresh-btn {
  display: block;
  margin: 0 auto;
}
</style>

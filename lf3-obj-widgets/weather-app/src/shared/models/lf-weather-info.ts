// ==== Library Imports =======================================================
// None

// ==== App Imports ===========================================================
import { LfRestResponse } from "./lf-rest-response";

export class LfWeatherInfo implements LfRestResponse {
  // ---- Properties --------------------------------------------------------

  public get location(): Location { return this._location; }
  public get tempF(): number { return this._tempF; }
  public get tempC(): number { return this._tempC; }
  public get condition(): Condition { return this._condition; }
  public get feelsLikeF(): number { return this._feelsLikeF; }
  public get feelsLikeC(): number { return this._feelsLikeC; }
  public get humidity(): number { return this._humidity; }
  public get todaysMinTempF(): number { return this._todaysMinTempF; }
  public get todaysMaxTempF(): number { return this._todaysMaxTempF; }
  public get todaysMinTempC(): number { return this._todaysMinTempC; }
  public get todaysMaxTempC(): number { return this._todaysMaxTempC; }
  public get todaysChanceOfRain(): number { return this._todaysChanceOfRain; }
  public get todaysCondition(): Condition { return this._todaysCondition; }

  // ---- Methods -----------------------------------------------------------

  public applyResponse(restData: any): void {
    try {

      const Location = restData.location;
      const TodaysForecast = restData.forecast.forecastday[0].day;
      const CurrentWeather = restData.current;

      this._location.name = Location.name;
      this._location.region = Location.region;
      this._location.country = Location.country;

      this._tempF = CurrentWeather.temp_f;
      this._tempC = CurrentWeather.temp_c;
      this._condition = CurrentWeather.condition;
      this._feelsLikeF = CurrentWeather.feelslike_f;
      this._feelsLikeC = CurrentWeather.feelslike_c;
      this._humidity = CurrentWeather.humidity;

      this._todaysMinTempF = TodaysForecast.mintemp_f;
      this._todaysMaxTempF = TodaysForecast.maxtemp_f;
      this._todaysMinTempC = TodaysForecast.mintemp_c;
      this._todaysMaxTempC = TodaysForecast.maxtemp_c;
      this._todaysChanceOfRain = TodaysForecast.daily_chance_of_rain;
      this._todaysCondition = TodaysForecast.condition;
    } catch (e) {
      console.error(e);
    }
  }

  // ==== PROTECTED =========================================================
  // ---- Properties --------------------------------------------------------
  // ---- Methods -----------------------------------------------------------

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------

  // Getter/Setter backing variables and defaults
  private _location: Location = {
    name: "",
    region: "",
    country: "",
  };
  private _tempF!: number;
  private _tempC!: number;
  private _condition!: Condition;
  private _feelsLikeF!: number;
  private _feelsLikeC!: number;
  private _humidity!: number;
  private _todaysMinTempF!: number;
  private _todaysMaxTempF!: number;
  private _todaysMinTempC!: number;
  private _todaysMaxTempC!: number;
  private _todaysChanceOfRain!: number;
  private _todaysCondition!: Condition;

  // ---- Methods -----------------------------------------------------------
  // private privFn() {
  // }
}

export interface Location {
  name: string;
  region: string;
  country: string;
}

export interface Condition {
  text: string;
  icon: string;
  code: number;
}

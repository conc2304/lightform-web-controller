import axios, { AxiosResponse } from "axios";

export enum tempUnits {
  Fahrenheit = "imperial",
  Celsius = "metric",
}

class WeatherFetcher {
  /** PUBLIC PROPERTIES------------------- */

  /** PUBLIC METHODS --------------------- */
  public async getCurrentWeather(location: any): Promise<AxiosResponse> {

    console.log(navigator.geolocation)
    const path = this.WEATHER_API_URL;
    const params = {
      params: {
        q: location,
        key: this.WEATHER_API_KEY,
      },
    };
      
    return axios
      .get(path, params)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }




  /** PRIVATE PROPERTIES ----------------- */
  protected WEATHER_API_URL = "http://api.weatherapi.com/v1/forecast.json";
  protected WEATHER_API_KEY = process.env.VUE_APP_WEATHER_API_KEY;
  protected OWM_API_URL = "http://api.openweathermap.org/data/2.5/weather";
  protected OWM_API_KEY = process.env.VUE_APP_OWM_API_KEY;

  /** PRIVATE METHODS -------------------- */
}

export default new WeatherFetcher();

import axios from "axios";
import { SearchType, Weather } from "../types";


//Type Guard o assertions
const isWeatherResponse = (weather : unknown) : weather is Weather => {
    return (
        Boolean(weather) &&
        typeof weather === 'object' &&
        typeof (weather as Weather).name === 'string' &&
        typeof(weather as Weather).main.temp === 'number' &&
        typeof(weather as Weather).main.temp_min === 'number' &&
        typeof(weather as Weather).main.temp_max === 'number'
    )
}

export const useWeather = () => {

    const fetchWeather = async(search: SearchType) => {
       try{
        const appId = import.meta.env.VITE_API_KEY;
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

        const {data} = await axios(geoUrl);

        const lat = data[0].lat
        const lon = data[0].lon

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

        //Castear type

        // const {data: weatherResponse} = await axios<Weather>(weatherUrl)
        // // console.log(weatherResponse.main.temp_max)

        //Type guard
        const {data: weatherResponse} = await axios(weatherUrl)
        const result = isWeatherResponse(weatherResponse)
        if(result) {
            console.log(weatherResponse.name);
        }
        
       }catch(error) {
        console.log(error);
       }
    }

    return {
        fetchWeather
    }
}
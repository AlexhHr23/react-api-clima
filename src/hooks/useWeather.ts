import axios from "axios";
import { z } from 'zod'
// import { object, string, number, InferOutput, parse} from 'valibot';
import { SearchType } from "../types";
import { useMemo, useState } from "react";


//Type Guard o assertions
// const isWeatherResponse = (weather : unknown) : weather is Weather => {
//     return (
//         Boolean(weather) &&
//         typeof weather === 'object' &&
//         typeof (weather as Weather).name === 'string' &&
//         typeof(weather as Weather).main.temp === 'number' &&
//         typeof(weather as Weather).main.temp_min === 'number' &&
//         typeof(weather as Weather).main.temp_max === 'number'
//     )
// }

//Zod
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
})

export type Weather = z.infer<typeof Weather>

//Valibot
// const WeatherSchema = object({
//     name: string(),
//     main: object({
//         temp: number(),
//         temp_max: number(),
//         temp_min: number()
//     })
// })

// type Weather = InferOutput<typeof WeatherSchema>

const initialState = {
    name: '',
        main: {
            temp: 0,
            temp_max: 0,
            temp_min: 0,
        }
}

export const useWeather = () => {

    const [weather, setWeather] = useState<Weather>(initialState)

    const [loading, setLoading] = useState(false)

    const [notFound, setNotFound] = useState(false)

    const fetchWeather = async (search: SearchType) => {

        const appId = import.meta.env.VITE_API_KEY;
        setLoading(true)
        setWeather(initialState)
        try {
            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

            const { data } = await axios(geoUrl);

            //Comprobar si existe
            if(!data[0]) {
                setNotFound(true)
                return
            }

            const lat = data[0].lat
            const lon = data[0].lon

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            //Zod
            const { data: weatherResponse } = await axios(weatherUrl)
            const result = Weather.safeParse(weatherResponse)
            if (result.success) {
                setWeather(result.data)
            }


            //Castear type

            // const {data: weatherResponse} = await axios<Weather>(weatherUrl)
            // // console.log(weatherResponse.main.temp_max)

            //Type guard
            // const {data: weatherResponse} = await axios(weatherUrl)
            // const result = isWeatherResponse(weatherResponse)
            // if(result) {
            //     console.log(weatherResponse.name);
            // }


            //Valibot
            // const {data: weatherResponse} = await axios(weatherUrl)
            // const result = parse(WeatherSchema, weatherResponse)

            // if(result) {
            //     console.log(result.name);
            // }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const hasWeatherData = useMemo(() => weather.name, [weather])

    return {
        weather,
        loading,
        notFound,
        fetchWeather,
        hasWeatherData
    }
}
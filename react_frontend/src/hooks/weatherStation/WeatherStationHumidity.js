import { useState, useEffect } from 'react';
import { fetchWeatherStationData } from '../../chartsConfig/apiCalls';

export const useWeatherStationHumidity = () => {
    const [weatherStationHumidityData, setWeatherStationHumidityData] = useState([]);

    const [lastValueWeatherStationHumidity, setLastValueWeatherStationHumidity] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchWeatherStationData('humidity');
                setWeatherStationHumidityData(data);

                if (data.length > 0) {
                    const lastEntry = data[data.length - 1];
                    setLastValueWeatherStationHumidity(lastEntry.value);
                }
            } catch (error) {
                console.error('Failed to fetch humidity data:', error);
            }
        };

        fetchData();
    }, []);

    return { lastValueWeatherStationHumidity, weatherStationHumidityData };
};

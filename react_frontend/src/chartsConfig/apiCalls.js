import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // This will switch based on the environment - dev env will point to local Django, prod env to the proper domain

export const fetchSoilMoistureData = async (queryType) => {
    try {
        const response = await axios.get(`${API_URL}/soil-data/?query_type=${queryType}`);
        const parsedData = JSON.parse(response.data);
        return parsedData;
    } catch (error) {
        console.error("Error fetching soil moisture data:", error);
        return null;
    }
};

export const fetchWeatherStationData = async (queryType) => {
    try {
        const response = await axios.get(`${API_URL}/weather-station-data/?query_type=${queryType}`);
        const parsedData = JSON.parse(response.data);
        return parsedData;
    } catch (error) {
        console.error("Error fetching weather station data:", error);
        return null;
    }
};

export const fetchResistanceData = async (queryType) => {
    try {
        const response = await axios.get(`${API_URL}/electrical-resistance-data/?query_type=${queryType}`);
        // axios automatically parses the JSON response
        return response.data;
    } catch (error) {
        console.error("Error fetching tree moisture content data from Django:", error);
        return null;
    }
};

export const fetchTreeMoistureContentData = async (queryType) => {
    try {
        const response = await axios.get(`${API_URL}/tree-moisture-content-data/?query_type=${queryType}`);
        // axios automatically parses the JSON response
        return response.data;
    } catch (error) {
        console.error("Error fetching tree moisture content data from Django:", error);
        return null;
    }
};

export const fetchTreeHealthData = async (deviceId) => {
    try {
        const response = await axios.get(`${API_URL}/tree-health-data/?device_id=${deviceId}`);

        // axios automatically parses the JSON response
        return response.data;
    } catch (error) {
        console.error("Error fetching tree health data from Django:", error);
        return null;
    }
};
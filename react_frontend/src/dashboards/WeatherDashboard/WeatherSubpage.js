import React, { useState, useEffect } from "react";
import axios from "axios";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import { format } from 'date-fns';

import {
  temperatureConfigBurgLichtenbergWeatherDashboard,
  temperatureConfigGymnasiumWeatherDashboard,

  airPressureConfig,
  humidityConfig,
  precipitationConfigBurgLichtenberg,
  precipitationConfigGymnasium
} from "../../chartsConfig/chartsConfig";

import WeatherMap from "./WeatherMap";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  CardMedia,
  CardActions,
  Button,
} from "@mui/material";

import { useWeatherStationHumidity } from "../../hooks/weatherStation/WeatherStationHumidity";
import { useWeatherStationAirPressure } from "../../hooks/weatherStation/WeatherStationAirPressure";
import { useWeatherStationWindSpeed } from "../../hooks/weatherStation/WeatherStationWindSpeed";
import { useWeatherStationWindDirection } from "../../hooks/weatherStation/WeatherStationWindDirection";
import { useWeatherStationPrecipitation } from "../../hooks/weatherStation/WeatherStationPrecipitation ";
import { useWeatherStationTemperature } from "../../hooks/weatherStation/WeatherStationTemperatureData";
import { useWeatherStationUVIndex } from "../../hooks/weatherStation/WeatherStationUVIndex";


import normalizeAndInterpolate from "../../tools/normalizeAndInterpolate";
import normalizeAndInterpolateBarChart from "../../tools/normalizeAndInterpolateBarChart";


const API_URL = process.env.REACT_APP_API_URL; // This will switch based on the environment - dev env will point to local Django, prod env to the proper domain

const WeatherDashboard = () => {

  
  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);

  //////////////////////////////              State for the sliders     ////////////////////////////////////////////////////////////

  const [stateSliderBurgLichtenberg, setStateSliderBurgLichtenberg] =
    useState(true);

  const [
    stateSliderSiebenpfeifferGymnasium,
    setStateSliderSiebenpfeifferGymnasium,
  ] = useState(false);

  // Handler functions for the sliders
  const handleSliderBurgLichtenbergChange = (event) => {
    const newState = event.target.checked;
    setStateSliderBurgLichtenberg(newState);
  };

  const handleSliderSiebenpfeifferGymnasiumChange = (event) => {
    const newState = event.target.checked;
    setStateSliderSiebenpfeifferGymnasium(newState);
  };

  ///////////////////////////////////             temperature data from the weather station Burg Lichtenberg        /////////////////////////////////////////

  const { weatherStationTemperatureData, lastValueWeatherStationTemperature } =
    useWeatherStationTemperature();


  //precipitation data from the weather station Burg Lichtenberg
  const {
    weatherStationPrecipitationData,
    lastTimestampFormatted,
    lastPrecipitationValue,
  } = useWeatherStationPrecipitation();

  //UV-Index data from the weather station Burg Lichtenberg
  const uVIndex = useWeatherStationUVIndex();

  //humidity data from the weather station Burg Lichtenberg
  const { lastValueWeatherStationHumidity, weatherStationHumidityData } =
    useWeatherStationHumidity();

  //air pressure data from the weather station Burg Lichtenberg
  const { weatherStationAirPressureData, lastValueWeatherStationAirPressure } =
    useWeatherStationAirPressure();

  //wind speed data from the weather station Burg Lichtenberg
  const windSpeed = useWeatherStationWindSpeed();

  //wind direction data from the weather station Burg Lichtenberg
  const windDirection = useWeatherStationWindDirection();


  //////////////////////////////////////      fetching and preparing weather data from Siebenpfeiffer Gymnasium     //////////////////////////////////

  const [weatherDataGymnasium, setWeatherDataGymnasium] = useState([]);

  const [
    weatherStationGymnasiumAirPressureData,
    setWeatherStationGymnasiumAirPressureData,
  ] = useState([]);

  const [
    weatherStationGymnasiumTemperatureData,
    setWeatherStationGymnasiumTemperatureData,
  ] = useState([]);

  const [
    weatherStationGymnasiumPrecipitationData,
    setWeatherStationGymnasiumPrecipitationData,
  ] = useState([]);

  const [
    weatherStationGymnasiumHumidityData,
    setWeatherStationGymnasiumHumidityData,
  ] = useState([]);

  const [
    weatherStationGymnasiumWindSpeedData,
    setWeatherStationGymnasiumWindSpeedData,
  ] = useState([]);

  const [
    weatherStationGymnasiumWindDirectionData,
    setWeatherStationGymnasiumWindDirectionData,
  ] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/weather-data-gymnasium/`);
        const data = response.data;

        setWeatherDataGymnasium(data.weather_data);

        // Extract air pressure data
        const airPressureData = data.weather_data.map((entry) => ({
          time: entry.timestamp,
          value: entry.air_pressure,
        }));

        
        // Extract wind speed data
        const windSpeedData = data.weather_data.map((entry) => ({
          time: entry.timestamp,
          value: entry.wind_speed,
        }));

                // Extract wind direction data

                // Your getCardinalDirection function
const getCardinalDirection = (degree) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degree / 45) % 8;
  return directions[index];
};

                const windDirectionData = data.weather_data.map((entry) => ({
                  time: entry.timestamp,
                  value: getCardinalDirection(entry.wind_direction),
                }));


        // Extract temperature data
        const temperatureData = data.weather_data.map((entry) => ({
          time: entry.timestamp,
          value: entry.temperature,
        }));

    // Coalesce precipitation data by hour
    const coalescePrecipitationData = (weatherData) => {
      const coalescedPrecipitation = {};

      weatherData.forEach((entry) => {
        const date = new Date(entry.timestamp);
        const roundedHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 30, 0); // Round to the nearest :30 of the hour

        const roundedTimeString = roundedHour.toISOString();

        // Coalesce precipitation by hour
        if (coalescedPrecipitation[roundedTimeString]) {
          coalescedPrecipitation[roundedTimeString] += entry.precipitation;
        } else {
          coalescedPrecipitation[roundedTimeString] = entry.precipitation;
        }
      });

      return Object.keys(coalescedPrecipitation).map((time) => ({
        time: time,
        value: coalescedPrecipitation[time],
      }));
    };

    // Extract coalesced precipitation data
    const precipitationData = coalescePrecipitationData(data.weather_data);


                // Extract humidity data
                const humidityData = data.weather_data.map((entry) => ({
                  time: entry.timestamp,
                  value: entry.humidity,
                }));

        setWeatherStationGymnasiumAirPressureData(airPressureData);
        setWeatherStationGymnasiumTemperatureData(temperatureData);
        setWeatherStationGymnasiumPrecipitationData(precipitationData);
        setWeatherStationGymnasiumHumidityData(humidityData);
        setWeatherStationGymnasiumWindSpeedData(windSpeedData);
        setWeatherStationGymnasiumWindDirectionData(windDirectionData)        


      } catch (error) {
        console.error("Error fetching the weather data:", error);
      }
    };

    fetchData();
  }, []);


  //////////////////////////////////////////////          normalize data from weather stations Burg Lichtenberg and Siebenpfeiffer-Gymnasium    //////////////

  // air pressure

  const { normalizedDatasetA, normalizedDatasetB, xValues } =
    normalizeAndInterpolate(
      weatherStationAirPressureData,
      weatherStationGymnasiumAirPressureData
    );

  // Create a list of datasets, each dataset is a collection of arrays with keys "time" and "value"
  const normalizedDataAirPressure = [
    xValues.map((x, index) => ({
      time: x.toString(), // Convert x values to string if necessary
      value: normalizedDatasetA[index].y,
    })),
    xValues.map((x, index) => ({
      time: x.toString(), // Convert x values to string if necessary
      value: normalizedDatasetB[index].y,
    })),
  ];

  // temperature

  const [normalizedTemperatureBurg, setNormalizedTemperatureBurg] = useState(
    []
  );
  const [normalizedTemperatureGymnasium, setNormalizedTemperatureGymnasium] =
    useState([]);
  const [xValuesTemperature, setXValuesTemperature] = useState([]);

  useEffect(() => {
    if (
      weatherStationTemperatureData.length > 0 &&
      weatherStationGymnasiumTemperatureData.length > 0
    ) {
      const { normalizedDatasetA, normalizedDatasetB, xValues } =
        normalizeAndInterpolate(
          weatherStationTemperatureData,
          weatherStationGymnasiumTemperatureData
        );
      setNormalizedTemperatureBurg(normalizedDatasetA);
      setNormalizedTemperatureGymnasium(normalizedDatasetB);
      setXValuesTemperature(xValues);
    }
  }, [weatherStationTemperatureData, weatherStationGymnasiumTemperatureData]);

  // Create a list of datasets, each dataset is a collection of arrays with keys "time" and "value"
  const normalizedDataTemperature = [
    xValuesTemperature.map((x, index) => ({
      time: x.toString(), // Convert x values to string if necessary
      value: normalizedTemperatureBurg[index]?.y,
    })),
    xValuesTemperature.map((x, index) => ({
      time: x.toString(), // Convert x values to string if necessary
      value: normalizedTemperatureGymnasium[index]?.y,
    })),
  ];





    // humidity

  const [normalizedHumidityBurg, setNormalizedHumidityBurg] = useState(
    []
  );
  const [normalizedHumidityGymnasium, setNormalizedHumidityGymnasium] =
    useState([]);
  const [xValuesHumidity, setXValuesHumidity] = useState([]);

  useEffect(() => {
    if (
      weatherStationHumidityData.length > 0 &&
      weatherStationGymnasiumHumidityData.length > 0
    ) {
      const { normalizedDatasetA, normalizedDatasetB, xValues } =
        normalizeAndInterpolate(
          weatherStationHumidityData,
          weatherStationGymnasiumHumidityData
        );
      setNormalizedHumidityBurg(normalizedDatasetA);
      setNormalizedHumidityGymnasium(normalizedDatasetB);
      setXValuesHumidity(xValues);
    }
  }, [weatherStationHumidityData, weatherStationGymnasiumHumidityData]);

  // Create a list of datasets, each dataset is a collection of arrays with keys "time" and "value"
  const normalizedDataHumidity = [
    xValuesHumidity.map((x, index) => ({
      time: x.toString(), // Convert x values to string if necessary
      value: normalizedHumidityBurg[index]?.y,
    })),
    xValuesHumidity.map((x, index) => ({
      time: x.toString(), // Convert x values to string if necessary
      value: normalizedHumidityGymnasium[index]?.y,
    })),
  ];



    // precipitation

  const [normalizedPrecipitationBurg, setNormalizedPrecipitationBurg] = useState(
    []
  );
  const [normalizedPrecipitationGymnasium, setNormalizedPrecipitationGymnasium] =
    useState([]);
  const [xValuesPrecipitation, setXValuesPrecipitation] = useState([]);

  useEffect(() => {
    if (
      weatherStationPrecipitationData.length > 0 &&
      weatherStationGymnasiumPrecipitationData.length > 0
    ) {
      const { normalizedDatasetA, normalizedDatasetB, xValues } =
      normalizeAndInterpolateBarChart(
          weatherStationPrecipitationData,
          weatherStationGymnasiumPrecipitationData
        );
      setNormalizedPrecipitationBurg(normalizedDatasetA);
      setNormalizedPrecipitationGymnasium(normalizedDatasetB);
      setXValuesPrecipitation(xValues);
    }
  }, [weatherStationPrecipitationData, weatherStationGymnasiumPrecipitationData]);

  // Create a list of datasets, each dataset is a collection of arrays with keys "time" and "value"
  const normalizedDataPrecipitation = [
    xValuesPrecipitation.map((x, index) => ({
      time: x, // x is already a string in ISO format
      value: normalizedPrecipitationBurg[index]?.value,
    })),
    xValuesPrecipitation.map((x, index) => ({
      time: x, // x is already a string in ISO format
      value: normalizedPrecipitationGymnasium[index]?.value,
    })),
  ];



  /////////////////////////////////////////////////            prepare temperature data                ////////////////////////////////////////////

  let lineDataTemperature = [];
  let datasetsTemperature = [];

  if (stateSliderBurgLichtenberg) {
    lineDataTemperature.push(weatherStationTemperatureData);
  }

  if (stateSliderSiebenpfeifferGymnasium) {
    lineDataTemperature.push(weatherStationGymnasiumTemperatureData);
  }

  const temperatureConfigTwoDatasets = {
    datasets: [
      {
        label: "Weather Station Burg Lichtenberg Air Pressure",
        borderColor: "#88AF33",
        fill: false,
        backgroundColor: "#83C968",
      },
      {
        label: "Weather Station Siebenpfeiffer-Gymnasium Air Pressure",
        borderColor: "#e7794e",
        fill: false,
        backgroundColor: "#E7844E",
      },
    ],
    plugins: {
      title: {
        text: "Temperatur [°C]",
      },
    },
  };


   /////////////////////////////////////////////////            prepare precipitation data                ////////////////////////////////////////////

   let lineDataPrecipitation = [];
   let datasetsPrecipitation = [];
 
   if (stateSliderBurgLichtenberg) {
     lineDataPrecipitation.push(normalizedDataPrecipitation[0]);
   }

   
 
   if (stateSliderSiebenpfeifferGymnasium) {
     lineDataPrecipitation.push(weatherStationGymnasiumPrecipitationData);
   }

 
   const precipitationConfigTwoDatasets = {
     datasets: [
       {
         label: "Wetterstation Burg Lichtenberg, Niederschlag",
         borderColor: "#88AF33",
         fill: false,
         backgroundColor: "#83C968",
       },
       {
         label: "Wetterstation Siebenpfeiffer-Gymnasium, Niederschlag",
         borderColor: "#e7794e",
         fill: false,
         backgroundColor: "#E7844E",
       },
     ],
     plugins: {
       title: {
         text: "Niederschlag [mm/h]",
       },
     },
   };


  /////////////////////////////////////////////////            prepare air pressure data                ////////////////////////////////////////////

  let lineDataAirPressure = [];
  let datasetsAirPressure = [];

  if (stateSliderBurgLichtenberg) {
    lineDataAirPressure.push(weatherStationAirPressureData);
  }

  if (stateSliderSiebenpfeifferGymnasium) {
    lineDataAirPressure.push(weatherStationGymnasiumAirPressureData);
  }

  const airPressureConfigTwoDatasets = {
    datasets: [
      {
        label: "Weather Station Air Pressure",
        borderColor: "#88AF33",
        fill: false,
        backgroundColor: "#83C968",
      },
      {
        label: "Gymnasium Air Pressure",
        borderColor: "#e7794e",
        fill: false,
        backgroundColor: "#E7844E",
      },
    ],
    plugins: {
      title: {
        text: "Luftdruck [hPa]",
      },
    },
  };


  
  /////////////////////////////////////////////////            prepare humidity data                ////////////////////////////////////////////


  const humidityConfigTwoDatasets = {
    datasets: [
      {
        label: "Weather Station Burg Lichtenberg Humidity",
        borderColor: "#88AF33",
        fill: false,
        backgroundColor: "#83C968",
      },
      {
        label: "Weather Station Siebenpfeiffer-Gymnasium Humidity",
        borderColor: "#e7794e",
        fill: false,
        backgroundColor: "#E7844E",
      },
    ],
    plugins: {
      title: {
        text: "Luftfeuchte [%]",
      },
    },
  };






  /////////////////////////////////////////////////////      DOM creation         ///////////////////////////////////// //////////////////////////////////


    //only create the DOM when data is ready
    useEffect(() => {
      if (
        weatherStationTemperatureData !== null &&
        weatherStationPrecipitationData !== null &&
        weatherDataGymnasium.length > 0 &&
        weatherStationGymnasiumTemperatureData.length > 0 && 
        weatherStationGymnasiumPrecipitationData.length > 0 &&
        weatherStationHumidityData !== null &&
        weatherStationGymnasiumHumidityData.length > 0 &&
        weatherStationAirPressureData.length > 0 &&
        weatherStationGymnasiumAirPressureData.length > 0 &&
        lastValueWeatherStationAirPressure !== null &&
        lastPrecipitationValue !== null &&
        lastValueWeatherStationHumidity !== null && 
        weatherStationGymnasiumWindSpeedData.length > 0 &&
        weatherStationGymnasiumWindDirectionData.length > 0 &&
        normalizedDataPrecipitation[0].length > 0 &&
        normalizedDataTemperature[0].length > 0  &&
        normalizedDataPrecipitation[1].length > 0 &&
        normalizedDataTemperature[1].length > 0  &&
        lastValueWeatherStationTemperature  !== null &&
        lastTimestampFormatted !== null
      ) {
   
            setIsLoading(false); // Set loading to false once data is fetched
          } 
    }, [
      lastTimestampFormatted, lastValueWeatherStationTemperature, normalizedDataTemperature, normalizedDataPrecipitation, weatherStationPrecipitationData,weatherStationAirPressureData,  weatherStationHumidityData, weatherStationGymnasiumAirPressureData, lastPrecipitationValue, weatherStationTemperatureData, weatherStationGymnasiumTemperatureData, weatherDataGymnasium, weatherStationGymnasiumPrecipitationData, weatherStationGymnasiumHumidityData, weatherStationGymnasiumWindSpeedData, lastValueWeatherStationAirPressure, lastValueWeatherStationHumidity, weatherStationGymnasiumWindDirectionData
    ]);

    

  return (
    <div style={{ minHeight: "80vh" }} className="first-step">
    {/* Display loading indicator while data is being fetched */}
    {isLoading && (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          color: "#18204F",
        }}
      >
        <p className="fs-1">Sensordaten werden geladen...</p>
      </div>
    )}
    {!isLoading && (
        <React.Fragment>
      <div className="row mt-4 " style={{ flex: "1 1 auto" }}>
        <div
          className="col-12 p-2 mb-3 mx-2 rounded-3"
          style={{
            flex: "1 1 auto",
boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
            backgroundColor: "#FFFFFF",
            borderRadius: "0px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#FFFFFF",
            zIndex: "0", //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)
          }}
        >
          <WeatherMap />
        </div>
      </div>

      <div className="row mb-3 " style={{ flex: "1 1 auto",  }}>
        <div className="col-12 d-flex flex-wrap px-2">
          <div
            className="col-12 col-md-6 col-lg-4 col-xl-5 d-flex align-items-center p-2 rounded-top-small"
            style={{


              boxShadow: "-4px 4px 24px rgba(40, 53, 131, 0.10), 0px -4px 24px rgba(40, 53, 131, 0.10)",

              backgroundColor: "#FFFFFF",
              color: "#18204F",
            }}
          >
            <div className="px-4">Wetterstation Burg Lichtenberg</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={stateSliderBurgLichtenberg}
                  onChange={handleSliderBurgLichtenbergChange}
                />
                <span className="slider slider-burg round "></span>
              </label>
            </div>
          </div>

          <div
            className="col-12 col-md-6 col-lg-8 col-xl-7 d-flex align-items-center px-2 py-4 rounded-bottom-small"
            style={{
    

              backgroundColor: "#FFFFFF",
              color: "#18204F",
            }}
          >
            <div className="px-4">Wetterstation Siebenpfeiffer-Gymnasium</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={stateSliderSiebenpfeifferGymnasium}
                  onChange={handleSliderSiebenpfeifferGymnasiumChange}
                />
                <span className="slider slider-gymnasium round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex flex-wrap px-2">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="rounded-3"style={{ backgroundColor: "#FFFFFF", color: "#18204F", boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)"}}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <strong>Temperatur</strong>
                  </Typography>
                  {stateSliderBurgLichtenberg && !stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{lastValueWeatherStationTemperature} °C</span>
      </Typography>
    )}

{!stateSliderBurgLichtenberg && stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{normalizedDataTemperature[1][normalizedDataTemperature[1].length - 1].value
        } °C</span>
      </Typography>
    )}

{stateSliderBurgLichtenberg && stateSliderSiebenpfeifferGymnasium &&  (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{lastValueWeatherStationTemperature} °C  </span><span> | </span><span style={{ color: "#18204F" }}>{normalizedDataTemperature[1][normalizedDataTemperature[1].length - 1].value} °C</span>
      </Typography>
    )}

{!stateSliderBurgLichtenberg && !stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert:
 
      </Typography>
    )}
                  <Typography variant="body2" color="#18204F">
                  Am: {format(new Date(normalizedDataTemperature[1][normalizedDataTemperature[1].length - 1].time), "dd/MM/yyyy 'um' HH:mm")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="rounded-3"style={{ backgroundColor: "#FFFFFF", color: "#18204F" , boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)"}}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <strong>Niederschlag</strong>
                  </Typography>
                 {stateSliderBurgLichtenberg && !stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{lastPrecipitationValue} mm/h</span>
      </Typography>
    )}

{!stateSliderBurgLichtenberg && stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{normalizedDataPrecipitation[1][normalizedDataPrecipitation[1].length - 1].value
        } mm/h</span>
      </Typography>
    )}

{stateSliderBurgLichtenberg && stateSliderSiebenpfeifferGymnasium &&   (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{lastPrecipitationValue} mm/h  </span><span> | </span><span style={{ color: "#18204F" }}>{normalizedDataPrecipitation[1][normalizedDataPrecipitation[1].length - 1].value} mm/h</span>
      </Typography>
    )}

{!stateSliderBurgLichtenberg && !stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert:
 
      </Typography>
    )}
                  <Typography variant="body2" color="#18204F">
                  Am: {format(new Date(normalizedDataTemperature[1][normalizedDataTemperature[1].length - 1].time), "dd/MM/yyyy 'um' HH:mm")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="rounded-3"style={{ backgroundColor: "#FFFFFF", color: "#18204F", boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <strong>Luftfeuchte</strong>
                  </Typography>
                  {stateSliderBurgLichtenberg && !stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{lastValueWeatherStationHumidity} %</span>
      </Typography>
    )}

{!stateSliderBurgLichtenberg && stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{normalizedDataHumidity[1][normalizedDataHumidity[1].length - 1].value
        } %</span>
      </Typography>
    )}

{stateSliderBurgLichtenberg && stateSliderSiebenpfeifferGymnasium &&   (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{lastValueWeatherStationHumidity} %  </span><span> | </span><span style={{ color: "#18204F" }}>{normalizedDataHumidity[1][normalizedDataHumidity[1].length - 1].value} %</span>
      </Typography>
    )}

{!stateSliderBurgLichtenberg && !stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert:
 
      </Typography>
    )}
                  <Typography variant="body2" color="#18204F">
                  Am: {format(new Date(normalizedDataTemperature[1][normalizedDataTemperature[1].length - 1].time), "dd/MM/yyyy 'um' HH:mm")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="rounded-3"style={{ backgroundColor: "#FFFFFF", color: "#18204F" , boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)"}}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <strong>Luftdruck</strong>
                  </Typography>
                  {stateSliderBurgLichtenberg && !stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{lastValueWeatherStationAirPressure} hPa</span>
      </Typography>
    )}

{!stateSliderBurgLichtenberg && stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{normalizedDataAirPressure[1][normalizedDataAirPressure[1].length - 1].value
        } hPa</span>
      </Typography>
    )}

{stateSliderBurgLichtenberg && stateSliderSiebenpfeifferGymnasium &&   (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{lastValueWeatherStationAirPressure} hPa  </span><span> | </span><span style={{ color: "#18204F" }}>{normalizedDataAirPressure[1][normalizedDataAirPressure[1].length - 1].value} hPa</span>
      </Typography>
    )}

{!stateSliderBurgLichtenberg && !stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert:
 
      </Typography>
    )}
                  <Typography variant="body2" color="#18204F">
                  Am: {format(new Date(normalizedDataTemperature[1][normalizedDataTemperature[1].length - 1].time), "dd/MM/yyyy 'um' HH:mm")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="rounded-3"style={{ backgroundColor: "#FFFFFF", color: "#18204F", boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <strong>Windgeschw.</strong>
                  </Typography>
                  {stateSliderBurgLichtenberg && !stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{windSpeed} m/s</span>
      </Typography>
    )}

{!stateSliderBurgLichtenberg && stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{weatherStationGymnasiumWindSpeedData[weatherStationGymnasiumWindSpeedData.length - 1].value
        } m/s</span>
      </Typography>
    )}

{stateSliderBurgLichtenberg && stateSliderSiebenpfeifferGymnasium &&   (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{windSpeed} m/s  </span><span> | </span><span style={{ color: "#18204F" }}>{weatherStationGymnasiumWindSpeedData[weatherStationGymnasiumWindSpeedData.length - 1].value} m/s</span>
      </Typography>
    )}

{!stateSliderBurgLichtenberg && !stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert:
 
      </Typography>
    )}
                  <Typography variant="body2" color="#18204F">
                  Am: {format(new Date(normalizedDataTemperature[1][normalizedDataTemperature[1].length - 1].time), "dd/MM/yyyy 'um' HH:mm")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="rounded-3" style={{ backgroundColor: "#FFFFFF", color: "#18204F", boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <strong>Windrichtung</strong>
                  </Typography>
                  {stateSliderBurgLichtenberg && !stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{windDirection}</span>
      </Typography>
    )}

{!stateSliderBurgLichtenberg && stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{weatherStationGymnasiumWindDirectionData[weatherStationGymnasiumWindDirectionData.length - 1].value
        } </span>
      </Typography>
    )}

{stateSliderBurgLichtenberg && stateSliderSiebenpfeifferGymnasium &&   (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert: <span style={{ color: "#18204F" }}>{windDirection} </span><span> | </span><span style={{ color: "#18204F" }}>{weatherStationGymnasiumWindDirectionData[weatherStationGymnasiumWindDirectionData.length - 1].value} </span>
      </Typography>
    )}

{!stateSliderBurgLichtenberg && !stateSliderSiebenpfeifferGymnasium && (
      <Typography variant="body2" color="#18204F">
        Aktueller Wert:
 
      </Typography>
    )}
                  <Typography variant="body2" color="#18204F">
                  Am: {format(new Date(normalizedDataTemperature[1][normalizedDataTemperature[1].length - 1].time), "dd/MM/yyyy 'um' HH:mm")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>

      <div className="row " style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex px-2 ">
          <div
            className="chart-container d-flex rounded-3"
            style={{
              boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
              flex: "1 1 auto",
              maxHeight: "30vh",
              backgroundColor: "#FFFFFF",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "#FFFFFF",
            }}
          >

         {/* temperature line chart */}
         {stateSliderBurgLichtenberg &&
              !stateSliderSiebenpfeifferGymnasium &&
              weatherStationTemperatureData && (
                <LineChart
                  lineChartConfig={temperatureConfigBurgLichtenbergWeatherDashboard}
                  lineData={[normalizedDataTemperature[0]]}
                  id="temperatureChart"
                />
              )}

            {!stateSliderBurgLichtenberg &&
              stateSliderSiebenpfeifferGymnasium &&
              weatherStationGymnasiumTemperatureData && (
                <LineChart
                  lineChartConfig={temperatureConfigGymnasiumWeatherDashboard}
                  lineData={[normalizedDataTemperature[1]]}
                  id="temperatureChart"
                />
              )}

            {stateSliderBurgLichtenberg &&
              stateSliderSiebenpfeifferGymnasium &&
              weatherStationTemperatureData &&
              weatherStationGymnasiumTemperatureData && (
                <LineChart
                  lineChartConfig={temperatureConfigTwoDatasets}
                  lineData={normalizedDataTemperature}
                  id="temperatureChart"
                />
              )}
            {!stateSliderBurgLichtenberg &&
              !stateSliderSiebenpfeifferGymnasium &&
              weatherStationTemperatureData &&
              weatherStationGymnasiumTemperatureData &&  (
                <LineChart
                  lineChartConfig={temperatureConfigTwoDatasets}
                  lineData={[]}
                  id="temperatureChart"
                />
              )}


          </div>
        </div>
      </div>

      <div className="row mt-3 mb-3" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex px-2 ">
          <div
            className="chart-container d-flex rounded-3"
            style={{
              flex: "1 1 auto",
              maxHeight: "30vh",
boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
              backgroundColor: "#FFFFFF",
            }}
          >



       {/* precipitation bar chart */}
       {stateSliderBurgLichtenberg &&
              !stateSliderSiebenpfeifferGymnasium &&
              weatherStationPrecipitationData && (
                <BarChart
                  barChartConfig={precipitationConfigBurgLichtenberg}
                  barChartData={normalizedDataPrecipitation[0]}
                />
              )}

            {!stateSliderBurgLichtenberg &&
              stateSliderSiebenpfeifferGymnasium &&
              weatherStationGymnasiumPrecipitationData && (
                <BarChart
                barChartConfig={precipitationConfigGymnasium}
                barChartData={normalizedDataPrecipitation[1]}
                />
              )}

            {stateSliderBurgLichtenberg &&
              stateSliderSiebenpfeifferGymnasium &&
              weatherStationPrecipitationData &&
              weatherStationGymnasiumPrecipitationData && (
                <BarChart
                barChartConfig={precipitationConfigTwoDatasets}
                barChartData={normalizedDataPrecipitation}
                />
              )}
            {!stateSliderBurgLichtenberg &&
              !stateSliderSiebenpfeifferGymnasium &&
              weatherStationPrecipitationData &&
              weatherStationGymnasiumPrecipitationData &&  (
                <BarChart
                barChartConfig={precipitationConfigTwoDatasets}
                barChartData={[]}
                />
              )}



          </div>
        </div>
      </div>

      <div className="row mt-3 mb-3" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex px-2 ">
          <div
            className="chart-container d-flex rounded-3"
            style={{
              flex: "1 1 auto",
              maxHeight: "30vh",
boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
              backgroundColor: "#FFFFFF",
            }}
          >
            {/* air pressure line chart */}
            {stateSliderBurgLichtenberg &&
              !stateSliderSiebenpfeifferGymnasium &&
              weatherStationAirPressureData && (
                <LineChart
                  lineChartConfig={airPressureConfig}
                  lineData={[normalizedDataAirPressure[0]]}
                  id="temperatureChart"
                />
              )}

            {!stateSliderBurgLichtenberg &&
              stateSliderSiebenpfeifferGymnasium &&
              weatherStationGymnasiumAirPressureData && (
                <LineChart
                  lineChartConfig={airPressureConfig}
                  lineData={[normalizedDataAirPressure[1]]}
                  id="temperatureChart"
                />
              )}

            {stateSliderBurgLichtenberg &&
              stateSliderSiebenpfeifferGymnasium &&
              weatherStationAirPressureData &&
              weatherStationGymnasiumAirPressureData && (
                <LineChart
                  lineChartConfig={airPressureConfigTwoDatasets}
                  lineData={normalizedDataAirPressure}
                  id="temperatureChart"
                />
              )}
            {!stateSliderBurgLichtenberg &&
              !stateSliderSiebenpfeifferGymnasium &&
              weatherStationAirPressureData &&
              weatherStationGymnasiumAirPressureData && (
                <LineChart
                  lineChartConfig={airPressureConfigTwoDatasets}
                  lineData={[]}
                  id="temperatureChart"
                />
              )}
          </div>
        </div>
      </div>

      <div className="row mt-3 mb-3" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex px-2 ">
          <div
            className="chart-container d-flex rounded-3"
            style={{
              flex: "1 1 auto",
              maxHeight: "30vh",
boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
              backgroundColor: "#FFFFFF",
            }}
          >



       {/* humidity line chart */}
       {stateSliderBurgLichtenberg &&
              !stateSliderSiebenpfeifferGymnasium &&
              weatherStationHumidityData && (
                <LineChart
                  lineChartConfig={humidityConfig}
                  lineData={[normalizedDataHumidity[0]]}
                  id="temperatureChart"
                />
              )}

            {!stateSliderBurgLichtenberg &&
              stateSliderSiebenpfeifferGymnasium &&
              weatherStationGymnasiumHumidityData && (
                <LineChart
                  lineChartConfig={humidityConfig}
                  lineData={[normalizedDataHumidity[1]]}
                  id="temperatureChart"
                />
              )}

            {stateSliderBurgLichtenberg &&
              stateSliderSiebenpfeifferGymnasium &&
              weatherStationHumidityData &&
              weatherStationGymnasiumHumidityData && (
                <LineChart
                  lineChartConfig={humidityConfigTwoDatasets}
                  lineData={normalizedDataHumidity}
                  id="temperatureChart"
                />
              )}
            {!stateSliderBurgLichtenberg &&
              !stateSliderSiebenpfeifferGymnasium &&
              weatherStationHumidityData &&
              weatherStationGymnasiumHumidityData &&  (
                <LineChart
                  lineChartConfig={humidityConfigTwoDatasets}
                  lineData={[]}
                  id="temperatureChart"
                />
              )}



          </div>
        </div>
      </div>
      </React.Fragment>
      )}
      </div>
    );
  };

export default WeatherDashboard;

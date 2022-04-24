import React, { useRef, useEffect } from 'react'
import mapboxgl from "mapbox-gl"
import Search from'./Search'
import './MainMap.css';
import { Button } from '@material-ui/core';
const MAPBOX_TOKEN = 'pk.eyJ1IjoidGVldGxlIiwiYSI6ImNsMWY4M3hpazBlY2MzaW1pZW9mNTlyZ2kifQ.xWeJP_mQ6kV7AsLhXJz4BQ'; // Set your mapbox token here
mapboxgl.accessToken = MAPBOX_TOKEN;

const val = ["get", "peak_montly_precipitation_past_5_year"];


function MainMap() {


  
  const mapContainer = useRef();
  
  const [center,setCenter] = React.useState([-121.5038261, 37.6331827]);
  const [map,setMap] = React.useState(null);
  const [inf,setInf] = React.useState(null);
  const [layers,setLayers] = React.useState(null);

  // function pass to the search component
  function setMapCenter(center){
    setCenter(center);
  }

  function create_infolayer(name){
    const nameDisplay = document.getElementById('name');
    const typeDisplay = document.getElementById('type');
    const peakprecipDisplay = document.getElementById('precip');
    const peakuwindDisplay = document.getElementById('uwind');
    const peakvwindDisplay = document.getElementById('vwind');
    map && map.on('mousemove',name, (e) => {
      map.getCanvas().style.cursor = 'pointer';
      const name = e.features[0].properties.Name;
      const type = e.features[0].properties["facility type"];
      const risk = e.features[0].properties.peak_montly_precipitation_past_5_year;
      const uwind = e.features[0].properties.peak_monthly_uwind_past_5_year;
      const vwind = e.features[0].properties.peak_monthly_vwind_past_5_year;
      if (e.features.length === 0) return;
      nameDisplay.textContent = name;
      typeDisplay.textContent = type;
      peakprecipDisplay.textContent = risk;
      peakuwindDisplay.textContent = uwind;
      peakvwindDisplay.textContent = vwind;
    });
  }
  function setprecipLayer(){
    //remove all other layer
    map.removeLayer(layers);

    map.addLayer({
      id:'precip-layer',
      type:'circle',
      source: 'inf',
      paint:{
        'circle-radius': 2,
        "circle-color": [
          "case", // Begin case expression
          ["<=", val, 0.15], // If state.cases == null,
          "#74ccf4",
          ["all", [">=", val, 0.15], ["<=", val, 0.3]],
          "#5abcd8", // ...then color the polygon grey.
          ["all", [">=", val, 0.3], ["<=", val, 0.5]],
          "#1ca3ec",
          [">=", val, 0.5], // If state.cases == 0,
          "#2389da",
          "#0f5e9c",
        ],
      },
    }
    );
    //Add information displaying
    create_infolayer('precip-layer');
    setLayers('precip-layer');
  }
  // Set default layer
  function setdefaultLayer(){
    //remove all other layer
    map.removeLayer(layers);
    map.addLayer({
      id:'inf-layer',
      type:'circle',
      source: 'inf',
      paint:{
        'circle-radius': 2,
        "circle-color": [
          "case", // Begin case expression
          ["==", ["get","KMean_Clusters"], "2"], // If state.cases == null,
          "red",
          ["==", ["get","KMean_Clusters"], "1"],
          "blue", // ...then color the polygon grey.
          ["==", ["get","KMean_Clusters"], "0"],
          "#1ca3ec",
          "#0f5e9c",
        ],
      },
    }
    );
    //Add information displaying
    create_infolayer('inf-layer');
    setLayers('inf-layer');
  }
  // Set U wind layer
  function setuwindLayer(){
    //remove all other layer
    var uwind = ["get", "peak_monthly_uwind_past_5_year"]
    map.removeLayer(layers);
    map.addLayer({
      id:'uwind-layer',
      type:'circle',
      source: 'inf',
      paint:{
        'circle-radius': 2,
        "circle-color": [
          "case", // Begin case expression
          ["<=", uwind, 1.5], // If state.cases == null,
          "#74ccf4",
          ["all", [">", uwind, 1.5], ["<=", uwind, 2.5]],
          "#5abcd8", // ...then color the polygon grey.
          ["all", [">", uwind, 2.5], ["<=", uwind, 4]],
          "#1ca3ec",
          [">", uwind, 4], // If state.cases == 0,
          "#2389da",
          "#0f5e9c",
        ],
      },
    }
    );
    //Add information displaying
    create_infolayer('uwind-layer');
    setLayers('uwind-layer');
  }
  // Set V wind layer
  function setvwindLayer(){
    //remove all other layer
    var vwind = ["get", "peak_monthly_vwind_past_5_year"]
    map.removeLayer(layers);
    map.addLayer({
      id:'vwind-layer',
      type:'circle',
      source: 'inf',
      paint:{
        'circle-radius': 2,
        "circle-color": [
          "case", // Begin case expression
          ["<=", vwind, 1.5], // If state.cases == null,
          "#74ccf4",
          ["all", [">", vwind, 1.5], ["<=", vwind, 2.5]],
          "#5abcd8", // ...then color the polygon grey.
          ["all", [">", vwind, 2.5], ["<=", vwind, 4]],
          "#1ca3ec",
          [">", vwind, 4], // If state.cases == 0,
          "#2389da",
          "#0f5e9c",
        ],
      },
    }
    );
    //Add information displaying
    create_infolayer('vwind-layer');
    setLayers('vwind-layer');
  }

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchInfdata = async () => {
      try {
          let response = await fetch('../data/res.json');
          let responseJson = await response.json();
          setInf(responseJson);
          console.log("Reading Source complete");
          } catch(error) {
          console.error(error);
      }
    }
  fetchInfdata();
  },[])
  // Initialize map when component mounts
  useEffect(() => {
    const temp_map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-121.5038261, 37.6331827],
      zoom: 15
    })
    setMap(temp_map);
    console.log("Map loaded");
    }, [])
  useEffect(() => {
    console.log(inf);
  },[inf])

  //Add source and layers to the map when component mounts
  useEffect(() => {
    map && map.on('load', () => {
      //Infrastructure
     inf && map.addSource('inf', {
      type: 'geojson',
      data: inf,
     })
     inf && map.addLayer({
      id: "inf-layer",
      type: "circle",
      source: "inf",
      paint: {
        'circle-radius': 2,
        "circle-color": "#ff0000"
      }
    });
    //Append layer to layerlist
    setLayers("inf-layer");
    })
  },[inf])

  // Add mouseover effect to the map to show detail information
  useEffect(() => {
    const nameDisplay = document.getElementById('name');
    const typeDisplay = document.getElementById('type');
    const peakprecipDisplay = document.getElementById('precip');
    const peakuwindDisplay = document.getElementById('uwind');
    const peakvwindDisplay = document.getElementById('vwind');
    map && map.on('mousemove',"inf-layer", (e) => {
      map.getCanvas().style.cursor = 'pointer';
      const name = e.features[0].properties.Name;
      const type = e.features[0].properties["facility type"];
      const risk = e.features[0].properties.peak_montly_precipitation_past_5_year;
      const uwind = e.features[0].properties.peak_monthly_uwind_past_5_year;
      const vwind = e.features[0].properties.peak_monthly_vwind_past_5_year;
      if (e.features.length === 0) return;
      nameDisplay.textContent = name;
      typeDisplay.textContent = type;
      peakprecipDisplay.textContent = risk;
      peakuwindDisplay.textContent = uwind;
      peakvwindDisplay.textContent = vwind;
    });
  },[map])

  // Reset the center of the map when search result callbacks
  useEffect(() => {
    map && map.setCenter(center);
  },[center])

  return (
  <div>
    <div className='inf-info'>
        <div><strong>Name:</strong> <span id='name'></span></div>
        <div><strong>Type:</strong> <span id='type'></span></div>
        <div><strong>Peak Precipitation:</strong> <span id='precip'></span></div>
        <div><strong>Peak U-wind:</strong> <span id='uwind'></span></div>
        <div><strong>Peak V-wind:</strong> <span id='vwind'></span></div>
    </div>
    <div className ="layer-panel">
      <Button variant="contained" onClick = {()=>setprecipLayer()}>Precipitation map</Button>
      <Button variant="contained" onClick = {()=>setdefaultLayer()}>K-Mean map</Button>
      <Button variant="contained" onClick = {()=>setuwindLayer()}>U wind map</Button>
      <Button variant="contained" onClick = {()=>setvwindLayer()}>V wind map</Button>
    </div>
    <Search  setMapCenter = {setMapCenter}/>
    <div ref={mapContainer} className="mapContainer" style={{ width: "100%", height: "100vh" }}>
    </div>
  </div>

  )
}
export default MainMap;
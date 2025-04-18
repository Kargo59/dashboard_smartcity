import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import MarkerIcon from "./LeafletTreeIconSvg";

const MarkerComponent = ({ position, selectedTree, currentValueSoilMoisture, treeSenseHealth, popup, treeID }) => {


  // Check if the position matches the selected tree latitude and longitude - used to render the bigger sized and focused icon for the selected tree
  const isSelectedTreePosition = selectedTree && position[0] === selectedTree.latitude && position[1] === selectedTree.longitude;

    
    // Adjust the color of the left side of the leaflet icons based on the tree health data - so far its only for one of the trees (Schoner von Nordhausen?)
    let colorLeft; // Default color

      // frost
      if (treeSenseHealth === 4 && (treeID === 1 || treeID === 2 || treeID === 4 ) ) {
        colorLeft = "#79E0EE";
      }

    // status unknown / no data
    if (treeSenseHealth === 3 && (treeID === 1 || treeID === 2 || treeID === 4 ) ) {
      colorLeft = "#CDCDCD";
    }
  
    if (treeSenseHealth === 2 && (treeID === 1 || treeID === 2 || treeID === 4 ) ) {
      colorLeft = "#E7844E";
    }
    if (treeSenseHealth === 1 && (treeID === 1 || treeID === 2 || treeID === 4 ) ) {
      colorLeft = "#ECC85B";
    }

    if (treeSenseHealth === 0 && (treeID === 1 || treeID === 2 || treeID === 4 ) ) {
      colorLeft = "#83C968";
    }
     else if ((treeID === 3 )|| treeID === 5) {
      colorLeft = "white";
    }
  
    
  // Adjust the color of the right side of the leaflet icons based on the soil moisture data
  let colorRight; // Default color

  //Pleiner Mostbirne:
  if (treeID === 1 || treeID === 2 || treeID === 3 || treeID === 4 || treeID === 5) {
  if (currentValueSoilMoisture < 10 ) {
    colorRight = "#E7844E";
  } else if (currentValueSoilMoisture >= 10 && currentValueSoilMoisture < 20) {
    colorRight = "#ECC85B";
  } else if (currentValueSoilMoisture >= 20) {
    colorRight = "#83C968";

  } else if (!currentValueSoilMoisture) {
    colorRight = "white";
  } 
}
  
  const icon = new L.divIcon({
    html: ReactDOMServer.renderToString(
      <MarkerIcon colorLeft={colorLeft} colorRight={colorRight} />
    ),
    className: isSelectedTreePosition || (selectedTree && selectedTree.id === 7) || selectedTree === null ? "" : "blurred-icon", // makes the NOT chosen icons appear blurry
    iconSize: isSelectedTreePosition ? [53, 53] : [40, 40],
  });

  return (
    <Marker position={position} icon={icon}>
      <Popup>{popup}</Popup>
    </Marker>
  );
};

export default MarkerComponent;

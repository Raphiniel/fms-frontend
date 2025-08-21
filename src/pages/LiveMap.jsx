// // src/pages/dashboard/LiveMap.jsx

// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default marker icon issue with webpack
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
// });


// const LiveMap = () => {
//   const [deviceLocations, setDeviceLocations] = useState([]);
//   const zimbabweCenter = [-19.0154, 29.1549]; // Centered on Zimbabwe

//   useEffect(() => {
//     // This function will fetch the locations from your backend API
//     const fetchLocations = async () => {
//       try {
//         // IMPORTANT: Replace with your actual API endpoint to get all device locations
//         const response = await fetch('/api/devices/locations');
//         const data = await response.json();
//         // Assuming the API returns an array of objects like:
//         // [{ id: 1, user: 'John Doe', lat: -17.8252, lng: 31.0335 }, ...]
//         setDeviceLocations(data);
//       } catch (error) {
//         console.error("Failed to fetch device locations:", error);
//       }
//     };

//     fetchLocations();
//     // Optional: Set up an interval to refresh the locations every 30 seconds
//     const intervalId = setInterval(fetchLocations, 30000);

//     // Cleanup interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <div style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
//       <h2>Live Device Locations 🗺️</h2>
//       <MapContainer center={zimbabweCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {deviceLocations.map(device => (
//           <Marker key={device.id} position={[device.lat, device.lng]}>
//             <Popup>
//               <b>User:</b> {device.user} <br />
//               <b>Last seen:</b> {new Date(device.timestamp).toLocaleString()}
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// };

// export default LiveMap;


import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Import the new service
import { getAllLocations } from '.././services/locationService';

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LiveMap = () => {
  const [deviceLocations, setDeviceLocations] = useState([]);
  const zimbabweCenter = [-19.0154, 29.1549]; // Centered on Zimbabwe

  useEffect(() => {
    // This function will now read from localStorage
    const fetchLocations = () => {
      const data = getAllLocations();
      setDeviceLocations(data);
    };

    fetchLocations();
    // Check for updates every 5 seconds to keep the map fresh
    const intervalId = setInterval(fetchLocations, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
      <h2>Live Device Locations 🗺️</h2>
      <MapContainer center={zimbabweCenter} zoom={6.5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {deviceLocations.map(device => (
          <Marker key={device.id} position={[device.lat, device.lng]}>
            <Tooltip 
              direction="top"
              offset={[0, -10]}
              opacity={1}
              permanent
            >
              {device.username}
            </Tooltip>
            <Popup>
              <b>User:</b> {device.username} <br />
              <b>Last seen:</b> {new Date(device.timestamp).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
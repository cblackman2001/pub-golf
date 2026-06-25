"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon paths with Leaflet in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface PubPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
}

interface MapProps {
  pubs: PubPin[];
  center?: [number, number];
}

export default function Map({ pubs, center }: MapProps) {
  // Center roughly around first pub or default
  const defaultCenter = pubs.length > 0 ? [pubs[0].lat, pubs[0].lng] : [51.505, -0.09];
  const mapCenter: [number, number] = center || (defaultCenter as [number, number]);

  // Provide numbered markers logic? Yes, creating a custom DivIcon with the number.
  const createNumberedIcon = (number: number) => {
    return L.divIcon({
      className: "custom-numbered-pin",
      html: `<div style="background-color: var(--primary-color); color: #000; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">${number}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "12px", overflow: "hidden", zIndex: 0, position: "relative" }}>
      <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pubs.map((pub) => (
          <Marker 
            key={pub.id} 
            position={[pub.lat, pub.lng]} 
            icon={createNumberedIcon(pub.order)}
          >
            <Popup>
              <strong>{pub.order}. {pub.name}</strong>
              <br/>
              <a href={`/pubs/${pub.id}`} style={{ color: "var(--primary-color)", fontWeight: "bold" }}>View Details &rarr;</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

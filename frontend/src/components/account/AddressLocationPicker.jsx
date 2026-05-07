import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DEFAULT_CENTER = [33.5731, -7.5898];

const locationIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapCenterController({ center }) {
  const map = useMap();

  useEffect(() => {
    if (Array.isArray(center) && center.length === 2) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);

  return null;
}

function SelectableMarker({ position, onPositionChange }) {
  useMapEvents({
    click(event) {
      onPositionChange(event.latlng);
    },
  });

  return (
    <Marker
      position={position}
      icon={locationIcon}
      draggable
      eventHandlers={{
        dragend: (event) => {
          onPositionChange(event.target.getLatLng());
        },
      }}
    />
  );
}

export default function AddressLocationPicker({ latitude, longitude, onLocationChange }) {
  const markerPosition = useMemo(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return [lat, lng];
    }

    return DEFAULT_CENTER;
  }, [latitude, longitude]);

  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-stone-200 bg-white">
      <MapContainer
        center={markerPosition}
        zoom={13}
        scrollWheelZoom
        className="h-[340px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenterController center={markerPosition} />
        <SelectableMarker position={markerPosition} onPositionChange={onLocationChange} />
      </MapContainer>
      <div className="border-t border-stone-200 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Carte interactive</p>
        <p className="mt-2 text-sm leading-7 text-stone-500">
          Cliquez sur la carte ou deplacez le marqueur pour ajuster precisement le point de livraison.
        </p>
      </div>
    </div>
  );
}

import Places from "@/components/places";
import { LatLngLiteral, MapOptions } from "@/utils/functions";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";

export default function Home() {
  const [office, setOffice] = useState<LatLngLiteral>()

  const mapRef = useRef<GoogleMap>();

  const center = useMemo<LatLngLiteral>(
    () => ({
      lat: -22.9181601,
      lng: -47.1263665,
      altitude: 0,
    }),
    []
  );

  const options = useMemo<MapOptions>(
    () => ({
      mapId: "130dccf11925a2f7",
      clickableIcons: false,
      disableDefaultUI: true,
    }),
    []
  );

  const onLoad = useCallback((map: GoogleMap) => { return mapRef.current = map}, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      : "",
    libraries: ["places"],
  });

  if (!isLoaded) return <h1>Loading...</h1>;


  return (
    <div className="container">
      <div className="controls">
        <h1>Commute?</h1>
        <Places setOffice={(position) => {
          setOffice(position)
          mapRef.current?.panTo(position)
          }} />
      </div>
      <div className="map">
        <GoogleMap
          zoom={14}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          <Marker position={office} />
        </GoogleMap>
      </div>
    </div>
  );
}

import Distance from "@/components/distance";
import Places from "@/components/places";
import {
  DirectionsResult,
  LatLngLiteral,
  MapOptions,
  generateHouses,
} from "@/utils/functions";
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  CircleF,
  MarkerClustererF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import mainMark from "../assets/icons/marker.svg";

export default function Home() {
  const [office, setOffice] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const mapRef = useRef<GoogleMap>();

  const center = useMemo<LatLngLiteral>(
    () => ({
      lat: -22.9181601,
      lng: -47.1263665,
    }),
    []
  );

  function success(pos: GeolocationPosition) {
    var crd = pos.coords;
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    setOffice({lat: crd.latitude, lng: crd.longitude})
  }

  function errors(err: GeolocationPositionError) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  var userGeolocationOptions = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        console.log("result", result);
        if (result.state === "granted") {
          //  If granted then you can directly call your function here
          navigator.geolocation.getCurrentPosition(success, errors, userGeolocationOptions)
        } else if (result.state === "prompt") {
          // If prompt then the user will be asked to give permission
          navigator.geolocation.getCurrentPosition(success, errors, userGeolocationOptions)
        } else if (result.state === "denied") {
          // If denied then you have to show instructions to enable location } });
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
      });
    }
    console.log("navigator.geolocation >>>>", navigator.geolocation);
    console.log("navigator.geolocation >>>>", navigator.permissions);
  }, [userGeolocationOptions]);

  const options = useMemo<MapOptions>(
    () => ({
      mapId: "130dccf11925a2f7",
      // clickableIcons: false,
      // disableDefaultUI: true,
      styles: [
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }],
        },
      ],
    }),
    []
  );

  const onLoad = useCallback(async (map: any) => {
    mapRef.current = map;
  }, []);

  const houses = useMemo(() => generateHouses(center), [center]);
  const fetchDirections = (position: LatLngLiteral) => {
    if (!office) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: position,
        destination: office,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  const { isLoaded } = useLoadScript({
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
        <Places
          setOffice={(position) => {
            setOffice(position);
            mapRef.current?.panTo(position);
          }}
        />
        {!office && <p>Enter the address of your office</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>
      <div className="map">
        <GoogleMap
          zoom={14}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {office && (
            <>
              <MarkerF position={office} />

              <MarkerClustererF>
                {(clusterer) => (
                  <>
                    {houses.map((house) => (
                      <MarkerF
                        key={house.lat}
                        position={house}
                        clusterer={clusterer}
                        onClick={() => {
                          fetchDirections(house);
                        }}
                      />
                    ))}
                  </>
                )}
              </MarkerClustererF>

              {[15000, 25000].map((radius, idx) => {
                return (
                  <CircleF
                    key={idx}
                    center={office}
                    radius={radius}
                    onLoad={() => console.log("Circle Load...")}
                    options={{
                      fillColor: radius > 15000 ? "aqua" : "green",
                      fillOpacity: 0.1,
                      strokeColor: radius > 15000 ? "aqua" : "green",
                      strokeOpacity: 0.8,
                    }}
                  />
                );
              })}
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

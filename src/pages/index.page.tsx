import { useJsApiLoader, GoogleMap, Marker, Data } from "@react-google-maps/api"
import "../styles/Home.module.css"

export default function Home() {
  const containerStyle = {
    width: '100%',
    height: '100vh'
  };
  
  const center = {
    lat: -22.9181601,
    lng: -47.1263665
  };
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY : "",
  })

  if (!isLoaded) return <h1>Loading...</h1>

  return (
    <>
      <GoogleMap zoom={14} center={center} mapContainerStyle={containerStyle}> 
        <Marker position={center} />
      </GoogleMap>
    </>
  )
}

import Geolocation from '@react-native-community/geolocation';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}



export function getLocation(): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      },
      error => reject(new Error(error.message)),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    );
  });
}

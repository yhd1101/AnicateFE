import { debounce } from '@/types/type';
import _ from 'lodash';

export const debouncedUpdateLocate: debounce = _.debounce((map, locate, setLocate) => {
  const bounds = map.getBounds();
  const swLatLng = bounds.getSouthWest();
  const neLatLng = bounds.getNorthEast();

  const newLatitude = (swLatLng.getLat() + neLatLng.getLat()) / 2;
  const newLongitude = (swLatLng.getLng() + neLatLng.getLng()) / 2;
  if (
    locate.latitude.toFixed(3) !== newLatitude.toFixed(3) &&
    locate.longitude.toFixed(3) !== newLongitude.toFixed(3)
  ) {
    setLocate({
      latitude: newLatitude,
      longitude: newLongitude,
    });
    map.panTo(new kakao.maps.LatLng(newLatitude, newLongitude));
  }
}, 100);

/// <reference types="vite/client" />

declare module 'react-map-gl/mapbox' {
  import * as React from 'react';
  export const Map: React.FC<any>;
  export const Marker: React.FC<any>;
  export const NavigationControl: React.FC<any>;
  export default Map;
}

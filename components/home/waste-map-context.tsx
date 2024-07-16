import { createContext, memo, useContext } from "react";
import MapView, { LatLng } from "react-native-maps";

export type WasteMapContextProps = {
  mapRef: React.RefObject<MapView>;
  initialLocation: LatLng;
};
export const WasteMapContext = createContext<WasteMapContextProps | null>(null);

const _WasteMapProvider = ({
  mapRef,
  initialLocation,
  children,
}: WasteMapContextProps & {
  children: React.ReactNode;
}) => {
  if (!mapRef) {
    throw new Error("WasteMapProvider should have a Map reference");
  }
  return (
    <WasteMapContext.Provider value={{ mapRef, initialLocation }}>
      {children}
    </WasteMapContext.Provider>
  );
};

export const useWasteMapContext = (): WasteMapContextProps => {
  const val = useContext(WasteMapContext);
  if (!val) {
    throw new Error("useMapContext should be used within WasteMapProvider");
  }
  return val;
};

export const WasteMapProvider = memo(_WasteMapProvider);

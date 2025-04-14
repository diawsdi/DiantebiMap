declare module '@mapbox/mapbox-gl-draw' {
  import { Map } from 'mapbox-gl';

  interface DrawOptions {
    displayControlsDefault?: boolean;
    controls?: {
      point?: boolean;
      line_string?: boolean;
      polygon?: boolean;
      trash?: boolean;
      combine_features?: boolean;
      uncombine_features?: boolean;
    };
    styles?: any[];
    defaultMode?: string;
    modes?: any;
  }

  interface Feature {
    id: string;
    type: string;
    properties: Record<string, any>;
    geometry: {
      type: string;
      coordinates: number[][] | number[][][] | number[];
    };
  }

  interface FeatureCollection {
    type: string;
    features: Feature[];
  }

  interface ModeOptions {
    featureId?: string;
    featureIds?: string[];
  }

  class MapboxDraw {
    constructor(options?: DrawOptions);
    add(geojson: any): string[];
    get(featureId: string): Feature | undefined;
    getAll(): FeatureCollection;
    delete(featureId: string | string[]): boolean;
    deleteAll(): this;
    setFeatureProperty(featureId: string, property: string, value: any): this;
    changeMode(mode: string, options?: ModeOptions): this;
    getMode(): string;
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): this;
  }

  export = MapboxDraw;
} 
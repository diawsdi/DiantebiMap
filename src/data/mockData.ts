// Mock GeoJSON data for testing
export const mockGeoJSONData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Point 1',
        description: 'This is a sample point',
        category: 'Point of Interest'
      },
      geometry: {
        type: 'Point',
        coordinates: [-74.006, 40.7128]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Line 1',
        description: 'Sample line feature',
        category: 'Transportation'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.006, 40.7128],
          [-73.9, 40.73],
          [-73.95, 40.78]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Polygon 1',
        description: 'Sample polygon area',
        category: 'Region'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-74.01, 40.72],
          [-73.99, 40.72],
          [-73.99, 40.74],
          [-74.01, 40.74],
          [-74.01, 40.72]
        ]]
      }
    }
  ]
}; 
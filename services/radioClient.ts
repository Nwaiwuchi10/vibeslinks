import axios from 'axios';

// Radio Browser API endpoint
// We use de1.api.radio-browser.info as a reliable default.
const BASE_URL = 'https://de1.api.radio-browser.info/json';

export interface RadioStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  votes: number;
  lastchangetime: string;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  clickcount: number;
  clicktrend: number;
}

/**
 * Fetch top voted stations globally
 */
export const getTopStations = async (limit: number = 10): Promise<RadioStation[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/stations/topvote`, {
      params: { limit, hidebroken: 'true' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top stations:', error);
    return [];
  }
};

/**
 * Fetch stations by country
 */
export const getStationsByCountry = async (country: string, limit: number = 10): Promise<RadioStation[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/stations/bycountry/${country}`, {
      params: { limit, hidebroken: 'true', order: 'clickcount', reverse: 'true' },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching stations for ${country}:`, error);
    return [];
  }
};

/**
 * Search stations by name
 */
export const searchStations = async (query: string, limit: number = 20): Promise<RadioStation[]> => {
  if (!query) return [];
  try {
    const response = await axios.get(`${BASE_URL}/stations/search`, {
      params: { name: query, limit, hidebroken: 'true', order: 'clickcount', reverse: 'true' },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching stations:', error);
    return [];
  }
};

/**
 * Fetch popular stations globally
 */
export const getPopularStations = async (limit: number = 10): Promise<RadioStation[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/stations/topclick`, {
      params: { limit, hidebroken: 'true' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular stations:', error);
    return [];
  }
};

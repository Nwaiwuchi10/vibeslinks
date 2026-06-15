import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchingRadio from './SearchingRadio';
import RadioHomeScreen from './RadioHomeScreen';
import RadioSearchScreen from './RadioSearchScreen';
import RadioDetailsScreen from './RadioDetailsScreen';

type RadioState = 'searching' | 'home' | 'search' | 'details';

const RadioMain = () => {
  const [state, setState] = useState<RadioState>('searching');
  const [selectedStation, setSelectedStation] = useState<any>(null);

  const handleSearchingFinish = () => {
    setState('home');
  };

  const handleOpenSearch = () => {
    setState('search');
  };

  const handleBackFromSearch = () => {
    setState('home');
  };

  const handleStationClick = (station: any) => {
    setSelectedStation(station);
    setState('details');
  };

  const handleBackFromDetails = () => {
    setState('home');
  };

  return (
    <View style={styles.container}>
      {state === 'searching' && <SearchingRadio onFinish={handleSearchingFinish} />}
      {state === 'home' && <RadioHomeScreen 
        onSearchPress={handleOpenSearch} 
        onStationClick={handleStationClick} 
      />}
      {state === 'search' && <RadioSearchScreen 
        onBack={handleBackFromSearch} 
        onStationClick={handleStationClick} 
      />}
      {state === 'details' && <RadioDetailsScreen 
        station={selectedStation} 
        onBack={handleBackFromDetails} 
      />}
    </View>
  );
};

export default RadioMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchingRadio from './SearchingRadio';
import RadioHomeScreen from './RadioHomeScreen';
import RadioSearchScreen from './RadioSearchScreen';
import RadioDetailsScreen from './RadioDetailsScreen';
import { useRadioPlayer } from '../../hooks/useRadioPlayer';

type RadioState = 'searching' | 'home' | 'search' | 'details';

const RadioMain = () => {
  const [state, setState] = useState<RadioState>('searching');
  const radioPlayer = useRadioPlayer();

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
    radioPlayer.playStation(station);
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
        radioPlayer={radioPlayer}
      />}
      {state === 'search' && <RadioSearchScreen 
        onBack={handleBackFromSearch} 
        onStationClick={handleStationClick} 
        radioPlayer={radioPlayer}
      />}
      {state === 'details' && <RadioDetailsScreen 
        onBack={handleBackFromDetails} 
        radioPlayer={radioPlayer}
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

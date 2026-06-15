import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DiscoverHomeScreen from './DiscoverHomeScreen';
import DiscoverSearchScreen from './DiscoverSearchScreen';
import DiscoverFilterScreen from './DiscoverFilterScreen';
import VibezAIScreen from './VibezAIScreen';
import VibezAIInitialScreen from './VibezAIInitialScreen';
import DiscoverResultsScreen from './DiscoverResultsScreen';

type DiscoverState = 'home' | 'search' | 'filter' | 'ai_initial' | 'ai_results' | 'results';

const DiscoverMain = () => {
  const [state, setState] = useState<DiscoverState>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenSearch = () => setState('search');
  const handleOpenFilter = () => setState('filter');
  const handleOpenAi = () => setState('ai_initial');
  const handleBackToHome = () => setState('home');

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setState('results');
  };

  const handleAiSuggestion = (suggestion: string) => {
    // For now just transition to results view
    setState('ai_results');
  };

  return (
    <View style={styles.container}>
      {state === 'home' && (
        <DiscoverHomeScreen 
          onSearchPress={handleOpenSearch} 
          onFilterPress={handleOpenFilter} 
          onAiPress={handleOpenAi} 
        />
      )}
      {state === 'search' && (
        <DiscoverSearchScreen 
          onBack={handleBackToHome} 
          onSearchSubmit={handleSearchSubmit}
        />
      )}
      {state === 'filter' && <DiscoverFilterScreen onBack={handleBackToHome} />}
      {state === 'ai_initial' && (
        <VibezAIInitialScreen 
          onBack={handleBackToHome} 
          onSuggestionPress={handleAiSuggestion} 
        />
      )}
      {state === 'ai_results' && <VibezAIScreen onBack={() => setState('ai_initial')} />}
      {state === 'results' && (
        <DiscoverResultsScreen 
          query={searchQuery} 
          onBack={() => setState('search')} 
        />
      )}
    </View>
  );
};

export default DiscoverMain;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

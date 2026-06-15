import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CreateEventStep1 from './CreateEventStep1';
import CreateEventStep2 from './CreateEventStep2';
import CreateEventStep3 from './CreateEventStep3';
import CreateEventPreview from './CreateEventPreview';
import CreateEventStep4 from './CreateEventStep4';
import CreateEventDatePicker from './CreateEventDatePicker';

type CreateEventState = 'type_selection' | 'details' | 'tickets' | 'preview' | 'published' | 'date_picker';

const CreateEventMain = ({ onFinish }: { onFinish: () => void }) => {
  const [state, setState] = useState<CreateEventState>('type_selection');
  const [prevState, setPrevState] = useState<CreateEventState>('type_selection');

  const handleBack = () => {
    if (state === 'type_selection') {
      onFinish();
    } else if (state === 'details') {
      setState('type_selection');
    } else if (state === 'tickets') {
      setState('details');
    } else if (state === 'preview') {
      setState('tickets');
    } else if (state === 'date_picker') {
      setState(prevState);
    }
  };

  const handleContinueFromStep1 = (type: 'physical' | 'livestream') => {
    setState('details');
  };

  const handleContinueFromStep2 = () => {
    setState('tickets');
  };

  const handleOpenDatePicker = () => {
    setPrevState(state);
    setState('date_picker');
  };

  const handleConfirmDate = () => {
    setState(prevState);
  };

  const handleContinueFromStep3 = () => {
    setState('preview');
  };

  const handlePublish = () => {
    setState('published');
  };

  return (
    <View style={styles.container}>
      {state === 'type_selection' && (
        <CreateEventStep1 onBack={handleBack} onContinue={handleContinueFromStep1} />
      )}
      {state === 'details' && (
        <CreateEventStep2 onBack={handleBack} onContinue={handleContinueFromStep2} onOpenDatePicker={handleOpenDatePicker} />
      )}
      {state === 'tickets' && (
        <CreateEventStep3 onBack={handleBack} onContinue={handleContinueFromStep3} />
      )}
      {state === 'preview' && (
        <CreateEventPreview onBack={handleBack} onPublish={handlePublish} />
      )}
      {state === 'published' && (
        <CreateEventStep4 onHome={onFinish} />
      )}
      {state === 'date_picker' && (
        <CreateEventDatePicker onBack={handleBack} onConfirm={handleConfirmDate} />
      )}
    </View>
  );
};

export default CreateEventMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

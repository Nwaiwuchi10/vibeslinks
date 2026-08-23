import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { RadioStation } from '../services/radioClient';

export const useRadioPlayer = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  
  // Clean up sound on unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playStation = async (station: RadioStation) => {
    try {
      setIsLoading(true);
      
      // Stop current sound if playing
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      setCurrentStation(station);
      
      // Initialize audio mode (allows playback in background for iOS/Android if configured)
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        allowsRecordingIOS: false,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: station.url_resolved || station.url },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsPlaying(true);
      setIsLoading(false);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
          if (status.didJustFinish && !status.isLooping) {
            setIsPlaying(false);
          }
        } else {
          if (status.error) {
            console.log(`FATAL PLAYER ERROR: ${status.error}`);
            setIsPlaying(false);
            setIsLoading(false);
          }
        }
      });
    } catch (error) {
      console.error('Error playing station:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resume = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await pause();
    } else {
      if (currentStation && !sound) {
         await playStation(currentStation);
      } else {
         await resume();
      }
    }
  };

  const stop = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setCurrentStation(null);
    }
  };

  return {
    isPlaying,
    isLoading,
    currentStation,
    playStation,
    pause,
    resume,
    togglePlayPause,
    stop,
  };
};

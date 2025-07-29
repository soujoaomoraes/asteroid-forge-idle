import { useEffect, useState, useCallback } from 'react';
import { AudioService, AudioConfig, GAME_SOUNDS, GAME_MUSIC } from '../services/audioService';

export const useAudio = () => {
  const [audioService] = useState(() => AudioService.getInstance());
  const [config, setConfig] = useState<AudioConfig>(audioService.getConfig());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAudioSupported, setIsAudioSupported] = useState(false);

  // Verificar suporte a áudio
  useEffect(() => {
    const supported = audioService.isAudioSupported();
    setIsAudioSupported(supported);
    
    if (supported) {
      loadAllAudio();
    }
  }, [audioService]);

  // Carregar todos os sons e músicas
  const loadAllAudio = useCallback(async () => {
    try {
      console.log('🎵 Loading all audio assets...');
      
      // Carregar efeitos sonoros
      const soundPromises = GAME_SOUNDS.map(sound => 
        audioService.loadSoundEffect(sound)
      );
      
      // Carregar música de fundo
      const musicPromise = audioService.loadMusic(GAME_MUSIC.background);
      
      await Promise.all([...soundPromises, musicPromise]);
      
      setIsLoaded(true);
      console.log('✅ All audio assets loaded');
    } catch (error) {
      console.error('❌ Failed to load audio assets:', error);
    }
  }, [audioService]);

  // Tocar efeito sonoro
  const playSound = useCallback((soundId: string) => {
    if (isLoaded && isAudioSupported) {
      audioService.playSound(soundId);
    }
  }, [audioService, isLoaded, isAudioSupported]);

  // Tocar música
  const playMusic = useCallback(() => {
    if (isLoaded && isAudioSupported) {
      audioService.playMusic();
    }
  }, [audioService, isLoaded, isAudioSupported]);

  // Parar música
  const stopMusic = useCallback(() => {
    audioService.stopMusic();
  }, [audioService]);

  // Pausar música
  const pauseMusic = useCallback(() => {
    audioService.pauseMusic();
  }, [audioService]);

  // Configurar volume geral
  const setVolume = useCallback((volume: number) => {
    audioService.setVolume(volume);
    setConfig(audioService.getConfig());
  }, [audioService]);

  // Configurar volume de música
  const setMusicVolume = useCallback((volume: number) => {
    audioService.setMusicVolume(volume);
    setConfig(audioService.getConfig());
  }, [audioService]);

  // Configurar volume de efeitos sonoros
  const setSFXVolume = useCallback((volume: number) => {
    audioService.setSFXVolume(volume);
    setConfig(audioService.getConfig());
  }, [audioService]);

  // Mutar/desmutar
  const toggleMute = useCallback(() => {
    audioService.toggleMute();
    setConfig(audioService.getConfig());
  }, [audioService]);

  // Limpar recursos ao desmontar
  useEffect(() => {
    return () => {
      audioService.destroy();
    };
  }, [audioService]);

  return {
    // Estado
    config,
    isLoaded,
    isAudioSupported,
    
    // Ações
    playSound,
    playMusic,
    stopMusic,
    pauseMusic,
    setVolume,
    setMusicVolume,
    setSFXVolume,
    toggleMute,
    
    // Sons específicos do jogo
    playMiningSound: () => playSound('mining'),
    playCollisionSound: () => playSound('collision'),
    playNavigationSound: () => playSound('navigation'),
    playShipDeploySound: () => playSound('ship-deploy'),
    playUpgradeSound: () => playSound('upgrade'),
    playAchievementSound: () => playSound('achievement'),
    playUIClickSound: () => playSound('ui-click'),
    playUIHoverSound: () => playSound('ui-hover')
  };
}; 
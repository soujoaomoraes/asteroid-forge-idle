export interface AudioConfig {
  volume: number;
  muted: boolean;
  musicVolume: number;
  sfxVolume: number;
}

export interface SoundEffect {
  id: string;
  src: string;
  volume?: number;
  loop?: boolean;
}

export class AudioService {
  private static instance: AudioService;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private music: HTMLAudioElement | null = null;
  private config: AudioConfig = {
    volume: 0.7,
    muted: false,
    musicVolume: 0.5,
    sfxVolume: 0.8
  };

  private constructor() {
    this.initializeAudioContext();
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('🎵 Audio context initialized');
    } catch (error) {
      console.error('❌ Failed to initialize audio context:', error);
    }
  }

  // Carregar efeito sonoro
  public async loadSoundEffect(sound: SoundEffect): Promise<void> {
    try {
      const audio = new Audio(sound.src);
      audio.preload = 'auto';
      audio.volume = (sound.volume || 1.0) * this.config.sfxVolume;
      
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve);
        audio.addEventListener('error', reject);
        audio.load();
      });

      this.sounds.set(sound.id, audio);
      console.log(`🎵 Sound loaded: ${sound.id}`);
    } catch (error) {
      console.error(`❌ Failed to load sound ${sound.id}:`, error);
    }
  }

  // Carregar música de fundo
  public async loadMusic(src: string): Promise<void> {
    try {
      this.music = new Audio(src);
      this.music.preload = 'auto';
      this.music.loop = true;
      this.music.volume = this.config.musicVolume;
      
      await new Promise((resolve, reject) => {
        this.music!.addEventListener('canplaythrough', resolve);
        this.music!.addEventListener('error', reject);
        this.music!.load();
      });

      console.log('🎵 Music loaded');
    } catch (error) {
      console.error('❌ Failed to load music:', error);
    }
  }

  // Tocar efeito sonoro
  public playSound(soundId: string): void {
    if (this.config.muted) return;

    const sound = this.sounds.get(soundId);
    if (sound) {
      // Reset para permitir múltiplas reproduções
      sound.currentTime = 0;
      sound.volume = this.config.sfxVolume;
      sound.play().catch(error => {
        console.error(`❌ Failed to play sound ${soundId}:`, error);
        // Fallback para áudio gerado sinteticamente
        this.playGeneratedSound(soundId);
      });
    } else {
      console.warn(`⚠️ Sound not found: ${soundId}, using generated sound`);
      // Fallback para áudio gerado sinteticamente
      this.playGeneratedSound(soundId);
    }
  }

  // Tocar som gerado sinteticamente como fallback
  private playGeneratedSound(soundId: string): void {
    const { AudioGenerator } = require('./audioGenerator');
    const audioGenerator = AudioGenerator.getInstance();
    
    switch (soundId) {
      case 'mining':
        audioGenerator.generateMiningSound();
        break;
      case 'collision':
        audioGenerator.generateCollisionSound();
        break;
      case 'navigation':
        audioGenerator.generateNavigationSound();
        break;
      case 'ship-deploy':
        audioGenerator.generateShipDeploySound();
        break;
      case 'upgrade':
        audioGenerator.generateUpgradeSound();
        break;
      case 'achievement':
        audioGenerator.generateAchievementSound();
        break;
      case 'ui-click':
        audioGenerator.generateUIClickSound();
        break;
      case 'ui-hover':
        audioGenerator.generateUIHoverSound();
        break;
      default:
        console.warn(`⚠️ Unknown sound ID: ${soundId}`);
    }
  }

  // Tocar música
  public playMusic(): void {
    if (this.config.muted || !this.music) return;

    this.music.volume = this.config.musicVolume;
    this.music.play().catch(error => {
      console.error('❌ Failed to play music:', error);
    });
  }

  // Parar música
  public stopMusic(): void {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
    }
  }

  // Pausar música
  public pauseMusic(): void {
    if (this.music) {
      this.music.pause();
    }
  }

  // Configurar volume
  public setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  // Configurar volume de música
  public setMusicVolume(volume: number): void {
    this.config.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.music) {
      this.music.volume = this.config.musicVolume;
    }
  }

  // Configurar volume de efeitos sonoros
  public setSFXVolume(volume: number): void {
    this.config.sfxVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.config.sfxVolume;
    });
  }

  // Mutar/desmutar
  public toggleMute(): void {
    this.config.muted = !this.config.muted;
    if (this.config.muted) {
      this.pauseMusic();
    } else {
      this.playMusic();
    }
  }

  // Atualizar volumes de todos os sons
  private updateAllVolumes(): void {
    this.sounds.forEach(sound => {
      sound.volume = this.config.sfxVolume;
    });
    if (this.music) {
      this.music.volume = this.config.musicVolume;
    }
  }

  // Obter configuração atual
  public getConfig(): AudioConfig {
    return { ...this.config };
  }

  // Verificar se áudio está suportado
  public isAudioSupported(): boolean {
    return this.audioContext !== null;
  }

  // Limpar recursos
  public destroy(): void {
    this.sounds.forEach(sound => {
      sound.pause();
      sound.src = '';
    });
    this.sounds.clear();
    
    if (this.music) {
      this.music.pause();
      this.music.src = '';
      this.music = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Sons pré-definidos do jogo
export const GAME_SOUNDS: SoundEffect[] = [
  {
    id: 'mining',
    src: '/sounds/mining.mp3',
    volume: 0.8
  },
  {
    id: 'collision',
    src: '/sounds/collision.mp3',
    volume: 0.9
  },
  {
    id: 'navigation',
    src: '/sounds/navigation.mp3',
    volume: 0.6
  },
  {
    id: 'ship-deploy',
    src: '/sounds/ship-deploy.mp3',
    volume: 0.7
  },
  {
    id: 'upgrade',
    src: '/sounds/upgrade.mp3',
    volume: 0.8
  },
  {
    id: 'achievement',
    src: '/sounds/achievement.mp3',
    volume: 0.9
  },
  {
    id: 'ui-click',
    src: '/sounds/ui-click.mp3',
    volume: 0.5
  },
  {
    id: 'ui-hover',
    src: '/sounds/ui-hover.mp3',
    volume: 0.3
  }
];

// Músicas do jogo
export const GAME_MUSIC = {
  background: '/music/space-background.mp3',
  menu: '/music/menu-theme.mp3',
  gameplay: '/music/gameplay-theme.mp3'
}; 
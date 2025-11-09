// Whispered Secrets - Audio Player Functionality
class WhisperedSecretsPlayer {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.hasInteracted = false;
    this.init();
  }

  init() {
    this.createAudioElement();
    this.setupEventListeners();
    this.preloadAudio();
  }

  createAudioElement() {
    // Audio element will be created when needed
    this.audio = null;
  }

  setupEventListeners() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playIcon = document.getElementById('playIcon');
    const audioText = document.getElementById('audioText');

    if (audioPlayer) {
      audioPlayer.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleAudioPlay();
      });

      // Touch event for mobile
      audioPlayer.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.handleAudioPlay();
      });
    }
  }

  getAudioUrl() {
    // Get audio URL from data attribute or default to first available
    const audioPlayer = document.getElementById('audioPlayer');
    return audioPlayer?.dataset.audioUrl || '';
  }

  async preloadAudio() {
    // Preload audio metadata for faster playback
    const audioUrl = this.getAudioUrl();
    if (!audioUrl) return;

    try {
      this.audio = new Audio();
      this.audio.preload = 'metadata';
      this.audio.src = audioUrl;
      
      this.audio.addEventListener('loadedmetadata', () => {
        console.log('Audio metadata loaded');
      });

      this.audio.addEventListener('canplaythrough', () => {
        console.log('Audio ready to play');
        document.getElementById('audioPlayer')?.classList.remove('audio-loading');
      });

      this.audio.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        this.showError('Audio failed to load');
      });

    } catch (error) {
      console.error('Audio preload error:', error);
    }
  }

  handleAudioPlay() {
    if (!this.hasInteracted) {
      this.hasInteracted = true;
    }

    if (!this.audio) {
      this.createAudioElement();
      this.preloadAudio();
      return;
    }

    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  async playAudio() {
    try {
      if (!this.audio.src) {
        const audioUrl = this.getAudioUrl();
        if (!audioUrl) {
          this.showError('No audio file available');
          return;
        }
        this.audio.src = audioUrl;
      }

      await this.audio.play();
      this.isPlaying = true;
      this.updatePlayButton(true);
      
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.updatePlayButton(false);
      });

    } catch (error) {
      console.error('Playback error:', error);
      this.showError('Playback failed. Please tap again.');
    }
  }

  pauseAudio() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.updatePlayButton(false);
    }
  }

  updatePlayButton(playing) {
    const playIcon = document.getElementById('playIcon');
    const audioText = document.getElementById('audioText');
    
    if (playIcon) {
      playIcon.textContent = playing ? '❚❚' : '▶';
    }
    
    if (audioText) {
      audioText.textContent = playing ? 'Listening...' : 'Tap to Listen';
    }
  }

  showError(message) {
    const audioText = document.getElementById('audioText');
    if (audioText) {
      audioText.textContent = message;
      audioText.style.color = '#ff6b6b';
      
      setTimeout(() => {
        audioText.textContent = 'Tap to Listen';
        audioText.style.color = '';
      }, 3000);
    }
  }
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WhisperedSecretsPlayer();
  
  // Add fade-in animation to main content
  const container = document.querySelector('.container');
  if (container) {
    container.classList.add('fade-in');
  }
});

// Service Worker registration for better caching (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // This would be implemented for production
    console.log('Service Worker support detected');
  });
}
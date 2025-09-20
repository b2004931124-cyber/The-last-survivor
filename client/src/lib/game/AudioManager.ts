export class AudioManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled = true;

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    // Load sound files from the public directory
    this.sounds.shoot = this.createAudio('/sounds/hit.mp3', 0.3);
    this.sounds.hit = this.createAudio('/sounds/hit.mp3', 0.5);
    this.sounds.zombieDeath = this.createAudio('/sounds/hit.mp3', 0.4);
    this.sounds.itemPickup = this.createAudio('/sounds/success.mp3', 0.6);
    this.sounds.itemUse = this.createAudio('/sounds/success.mp3', 0.5);
    this.sounds.playerHit = this.createAudio('/sounds/hit.mp3', 0.7);
    this.sounds.background = this.createAudio('/sounds/background.mp3', 0.2);
    
    // Start background music
    if (this.sounds.background) {
      this.sounds.background.loop = true;
      this.sounds.background.play().catch(() => {
        console.log('Background music autoplay prevented');
      });
    }
  }

  private createAudio(src: string, volume: number): HTMLAudioElement {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.preload = 'auto';
    return audio;
  }

  private playSound(soundName: string) {
    if (!this.enabled || !this.sounds[soundName]) return;
    
    const sound = this.sounds[soundName].cloneNode() as HTMLAudioElement;
    sound.currentTime = 0;
    sound.play().catch(error => {
      console.log(`Sound ${soundName} play prevented:`, error);
    });
  }

  public playShoot() {
    this.playSound('shoot');
  }

  public playHit() {
    this.playSound('hit');
  }

  public playZombieDeath() {
    this.playSound('zombieDeath');
  }

  public playItemPickup() {
    this.playSound('itemPickup');
  }

  public playItemUse() {
    this.playSound('itemUse');
  }

  public playPlayerHit() {
    this.playSound('playerHit');
  }

  public toggleSound() {
    this.enabled = !this.enabled;
    
    if (this.sounds.background) {
      if (this.enabled) {
        this.sounds.background.play().catch(() => {});
      } else {
        this.sounds.background.pause();
      }
    }
  }

  public destroy() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }
}

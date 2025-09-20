export enum WeaponType {
  PISTOL = 'pistol',
  SHOTGUN = 'shotgun',
  SNIPER = 'sniper',
  MACHINE_GUN = 'machine_gun',
  LASER = 'laser'
}

export interface WeaponStats {
  damage: number;
  fireRate: number; // milliseconds between shots
  bulletCount: number; // bullets per shot (for shotgun)
  spread: number; // spread angle in radians (for shotgun)
  bulletSpeed: number;
  piercing: boolean; // can bullets pass through zombies?
  range: number; // max distance bullets travel
  color: string; // bullet color
}

export class Weapon {
  public type: WeaponType;
  public name!: string;
  public stats!: WeaponStats;
  public ammo: number = -1; // -1 means infinite
  public maxAmmo: number = -1;

  constructor(type: WeaponType) {
    this.type = type;
    this.setupWeapon();
  }

  private setupWeapon() {
    switch (this.type) {
      case WeaponType.PISTOL:
        this.name = 'Pistol';
        this.stats = {
          damage: 10,
          fireRate: 200,
          bulletCount: 1,
          spread: 0,
          bulletSpeed: 400,
          piercing: false,
          range: 600,
          color: '#ffff00'
        };
        break;

      case WeaponType.SHOTGUN:
        this.name = 'Shotgun';
        this.stats = {
          damage: 8,
          fireRate: 800,
          bulletCount: 5,
          spread: Math.PI / 6, // 30 degrees spread
          bulletSpeed: 300,
          piercing: false,
          range: 300,
          color: '#ff8800'
        };
        this.ammo = 12;
        this.maxAmmo = 12;
        break;

      case WeaponType.SNIPER:
        this.name = 'Sniper Rifle';
        this.stats = {
          damage: 50,
          fireRate: 1500,
          bulletCount: 1,
          spread: 0,
          bulletSpeed: 800,
          piercing: true,
          range: 1000,
          color: '#00ff88'
        };
        this.ammo = 5;
        this.maxAmmo = 5;
        break;

      case WeaponType.MACHINE_GUN:
        this.name = 'Machine Gun';
        this.stats = {
          damage: 6,
          fireRate: 100,
          bulletCount: 1,
          spread: Math.PI / 24, // slight spread
          bulletSpeed: 450,
          piercing: false,
          range: 500,
          color: '#ff4444'
        };
        this.ammo = 50;
        this.maxAmmo = 50;
        break;

      case WeaponType.LASER:
        this.name = 'Laser Gun';
        this.stats = {
          damage: 15,
          fireRate: 300,
          bulletCount: 1,
          spread: 0,
          bulletSpeed: 600,
          piercing: true,
          range: 800,
          color: '#00ffff'
        };
        this.ammo = 20;
        this.maxAmmo = 20;
        break;

      default:
        this.name = 'Unknown';
        this.stats = {
          damage: 10,
          fireRate: 200,
          bulletCount: 1,
          spread: 0,
          bulletSpeed: 400,
          piercing: false,
          range: 600,
          color: '#ffff00'
        };
    }
  }

  public canFire(): boolean {
    return this.ammo !== 0;
  }

  public fire(): boolean {
    if (!this.canFire()) return false;
    
    if (this.ammo > 0) {
      this.ammo--;
    }
    return true;
  }

  public reload() {
    this.ammo = this.maxAmmo;
  }

  public getAmmoText(): string {
    if (this.ammo === -1) return '∞';
    return `${this.ammo}/${this.maxAmmo}`;
  }
}
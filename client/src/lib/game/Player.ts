import { Bullet } from './Bullet';
import { Item } from './Item';
import { InputManager } from './InputManager';
import { Weapon, WeaponType } from './Weapon';

export class Player {
  public x: number;
  public y: number;
  public width = 20;
  public height = 20;
  public health = 100;
  public maxHealth = 100;
  public speed = 150;
  public baseSpeed = 150;
  public weaponDamage = 10;
  public baseWeaponDamage = 10;
  public inventory: Item | null = null;
  public weapon: Weapon;
  public weapons: Weapon[] = [];
  public currentWeaponIndex = 0;
  public lastAimX = 0;
  public lastAimY = -1; // Default aim up
  
  private lastShot = 0;
  private shootCooldown = 200; // milliseconds
  private lastDamageTaken = 0;
  private damageCooldown = 1000; // 1 second invincibility
  private lastPoisonTick = 0;
  private poisonCooldown = 300; // 300ms between poison damage ticks
  private speedBoostEndTime = 0;
  private weaponUpgradeEndTime = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    
    // Initialize with pistol
    this.weapon = new Weapon(WeaponType.PISTOL);
    this.weapons.push(this.weapon);
  }

  public handleInput(inputManager: InputManager, deltaTime: number) {
    const moveSpeed = (this.speed * deltaTime) / 1000;
    
    if (inputManager.isKeyPressed('KeyW') || inputManager.isKeyPressed('ArrowUp')) {
      this.y -= moveSpeed;
    }
    if (inputManager.isKeyPressed('KeyS') || inputManager.isKeyPressed('ArrowDown')) {
      this.y += moveSpeed;
    }
    if (inputManager.isKeyPressed('KeyA') || inputManager.isKeyPressed('ArrowLeft')) {
      this.x -= moveSpeed;
    }
    if (inputManager.isKeyPressed('KeyD') || inputManager.isKeyPressed('ArrowRight')) {
      this.x += moveSpeed;
    }
  }

  public update(deltaTime: number, canvasWidth: number, canvasHeight: number) {
    // Keep player within bounds
    this.x = Math.max(this.width / 2, Math.min(canvasWidth - this.width / 2, this.x));
    this.y = Math.max(this.height / 2, Math.min(canvasHeight - this.height / 2, this.y));
    
    // Check for effect expiration
    const now = Date.now();
    
    if (this.speedBoostEndTime > 0 && now > this.speedBoostEndTime) {
      this.speed = this.baseSpeed;
      this.speedBoostEndTime = 0;
    }
    
    if (this.weaponUpgradeEndTime > 0 && now > this.weaponUpgradeEndTime) {
      this.weaponDamage = this.baseWeaponDamage;
      this.weaponUpgradeEndTime = 0;
    }
  }

  public shoot(targetX: number, targetY: number): Bullet[] {
    const now = Date.now();
    if (now - this.lastShot < this.weapon.stats.fireRate) return [];
    if (!this.weapon.canFire()) return [];
    
    this.lastShot = now;
    this.weapon.fire();
    
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length === 0) return [];
    
    const baseDirX = dx / length;
    const baseDirY = dy / length;
    
    const bullets: Bullet[] = [];
    
    // Create bullets based on weapon type
    for (let i = 0; i < this.weapon.stats.bulletCount; i++) {
      let dirX = baseDirX;
      let dirY = baseDirY;
      
      // Apply spread for shotgun and machine gun
      if (this.weapon.stats.spread > 0) {
        const spreadAngle = (Math.random() - 0.5) * this.weapon.stats.spread;
        const cos = Math.cos(spreadAngle);
        const sin = Math.sin(spreadAngle);
        
        const newDirX = dirX * cos - dirY * sin;
        const newDirY = dirX * sin + dirY * cos;
        
        dirX = newDirX;
        dirY = newDirY;
      }
      
      // Apply weapon damage multiplier for upgrades
      const effectiveDamage = this.weapon.stats.damage * (this.weaponDamage / this.baseWeaponDamage);
      
      // Store aim direction for continuous shooting
      this.lastAimX = baseDirX;
      this.lastAimY = baseDirY;
      
      bullets.push(new Bullet(
        this.x, 
        this.y, 
        dirX, 
        dirY,
        effectiveDamage,
        this.weapon.stats.bulletSpeed,
        this.weapon.stats.piercing,
        this.weapon.stats.color,
        this.weapon.stats.range
      ));
    }
    
    return bullets;
  }

  public shootContinuous(deltaTime: number): Bullet[] {
    const now = Date.now();
    if (now - this.lastShot < this.weapon.stats.fireRate) return [];
    if (!this.weapon.canFire()) return [];
    
    this.lastShot = now;
    this.weapon.fire();
    
    const bullets: Bullet[] = [];
    
    // Create bullets based on weapon type
    for (let i = 0; i < this.weapon.stats.bulletCount; i++) {
      let dirX = this.lastAimX;
      let dirY = this.lastAimY;
      
      // Apply spread for shotgun and machine gun
      if (this.weapon.stats.spread > 0) {
        const spreadAngle = (Math.random() - 0.5) * this.weapon.stats.spread;
        const cos = Math.cos(spreadAngle);
        const sin = Math.sin(spreadAngle);
        
        const newDirX = dirX * cos - dirY * sin;
        const newDirY = dirX * sin + dirY * cos;
        
        dirX = newDirX;
        dirY = newDirY;
      }
      
      // Apply weapon damage multiplier for upgrades
      const effectiveDamage = this.weapon.stats.damage * (this.weaponDamage / this.baseWeaponDamage);
      
      bullets.push(new Bullet(
        this.x, 
        this.y, 
        dirX, 
        dirY,
        effectiveDamage,
        this.weapon.stats.bulletSpeed,
        this.weapon.stats.piercing,
        this.weapon.stats.color,
        this.weapon.stats.range
      ));
    }
    
    return bullets;
  }

  public takeDamage(damage: number): boolean {
    const now = Date.now();
    if (now - this.lastDamageTaken < this.damageCooldown) return false;
    
    this.lastDamageTaken = now;
    this.health = Math.max(0, this.health - damage);
    return true;
  }

  public heal(amount: number) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  public applySpeedBoost(duration: number) {
    this.speed = this.baseSpeed * 1.5;
    this.speedBoostEndTime = Date.now() + duration;
  }

  public applyWeaponUpgrade(duration: number) {
    this.weaponDamage = 20;
    this.weaponUpgradeEndTime = Date.now() + duration;
  }

  public isInvulnerable(): boolean {
    return Date.now() - this.lastDamageTaken < this.damageCooldown;
  }

  public takePoisonDamage(damage: number): boolean {
    const now = Date.now();
    if (now - this.lastPoisonTick < this.poisonCooldown) return false;
    
    this.lastPoisonTick = now;
    this.health = Math.max(0, this.health - damage);
    return true;
  }

  public addWeapon(weaponType: WeaponType) {
    // Check if we already have this weapon
    const existingWeapon = this.weapons.find(w => w.type === weaponType);
    if (existingWeapon) {
      existingWeapon.reload(); // Just reload if we already have it
      return;
    }
    
    const newWeapon = new Weapon(weaponType);
    this.weapons.push(newWeapon);
    this.switchToWeapon(this.weapons.length - 1);
  }

  public switchToWeapon(index: number) {
    if (index >= 0 && index < this.weapons.length) {
      this.currentWeaponIndex = index;
      this.weapon = this.weapons[index];
    }
  }

  public switchWeapon() {
    this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weapons.length;
    this.weapon = this.weapons[this.currentWeaponIndex];
  }

  public reloadWeapon(): boolean {
    if (this.weapon.ammo === this.weapon.maxAmmo || this.weapon.maxAmmo === -1) {
      return false; // Already full or infinite ammo
    }
    this.weapon.reload();
    return true; // Reloaded successfully
  }
}

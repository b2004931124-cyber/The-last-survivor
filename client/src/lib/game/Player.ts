import { Bullet } from './Bullet';
import { Item } from './Item';
import { InputManager } from './InputManager';

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

  public shoot(targetX: number, targetY: number): Bullet | null {
    const now = Date.now();
    if (now - this.lastShot < this.shootCooldown) return null;
    
    this.lastShot = now;
    
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length === 0) return null;
    
    const dirX = dx / length;
    const dirY = dy / length;
    
    return new Bullet(this.x, this.y, dirX, dirY);
  }

  public shootContinuous(deltaTime: number): Bullet | null {
    const now = Date.now();
    if (now - this.lastShot < this.shootCooldown) return null;
    
    this.lastShot = now;
    
    // Shoot towards mouse or default direction (up)
    return new Bullet(this.x, this.y, 0, -1);
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
}

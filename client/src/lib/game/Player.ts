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
  
  // Permanent upgrades
  public permanentDamageMultiplier = 1.0;
  public permanentFireRateMultiplier = 1.0;
  public permanentReloadSpeedMultiplier = 1.0;
  public permanentPiercingUpgrade = false;
  
  // Stackable power-ups
  public doubleShotEndTime = 0;
  public tripleShotEndTime = 0;
  public rapidFireEndTime = 0;
  public shieldEndTime = 0;
  public vampireEndTime = 0;
  public berserkerModeEndTime = 0;
  public timeDilationEndTime = 0;
  public superSoldierEndTime = 0;
  
  // Power-up stacks
  public doubleShotStacks = 0;
  public tripleShotStacks = 0;
  public rapidFireStacks = 0;
  public shieldStacks = 0;
  public vampireStacks = 0;
  
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
    
    // Reset stackable power-ups if expired
    if (this.doubleShotEndTime > 0 && now > this.doubleShotEndTime) {
      this.doubleShotEndTime = 0;
      this.doubleShotStacks = 0;
    }
    
    if (this.tripleShotEndTime > 0 && now > this.tripleShotEndTime) {
      this.tripleShotEndTime = 0;
      this.tripleShotStacks = 0;
    }
    
    if (this.rapidFireEndTime > 0 && now > this.rapidFireEndTime) {
      this.rapidFireEndTime = 0;
      this.rapidFireStacks = 0;
    }
    
    if (this.shieldEndTime > 0 && now > this.shieldEndTime) {
      this.shieldEndTime = 0;
      this.shieldStacks = 0;
    }
    
    if (this.vampireEndTime > 0 && now > this.vampireEndTime) {
      this.vampireEndTime = 0;
      this.vampireStacks = 0;
    }
    
    // Reset combination power-ups if expired
    if (this.superSoldierEndTime > 0 && now > this.superSoldierEndTime) {
      this.superSoldierEndTime = 0;
    }
    
    if (this.berserkerModeEndTime > 0 && now > this.berserkerModeEndTime) {
      this.berserkerModeEndTime = 0;
    }
    
    if (this.timeDilationEndTime > 0 && now > this.timeDilationEndTime) {
      this.timeDilationEndTime = 0;
    }
  }

  public shoot(targetX: number, targetY: number): Bullet[] {
    const now = Date.now();
    
    // Calculate effective fire rate with all upgrades
    let effectiveFireRate = this.weapon.stats.fireRate;
    
    // Apply permanent fire rate upgrade
    effectiveFireRate *= this.permanentFireRateMultiplier;
    
    // Apply rapid fire power-up
    if (this.rapidFireEndTime > now) {
      const rapidFireMultiplier = 0.3 + (0.1 * Math.max(0, this.rapidFireStacks - 1));
      effectiveFireRate *= rapidFireMultiplier;
    }
    
    // Apply berserker mode
    if (this.berserkerModeEndTime > now) {
      effectiveFireRate *= 0.4;
    }
    
    // Apply time dilation
    if (this.timeDilationEndTime > now) {
      effectiveFireRate *= 0.2;
    }
    
    // Clamp fire rate to prevent degenerate values
    effectiveFireRate = Math.max(effectiveFireRate, 30);
    
    if (now - this.lastShot < effectiveFireRate) return [];
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
    
    // Determine bullet count with power-ups
    let bulletCount = this.weapon.stats.bulletCount;
    
    // Apply double/triple shot power-ups
    if (this.tripleShotEndTime > now) {
      bulletCount *= (2 + this.tripleShotStacks);
    } else if (this.doubleShotEndTime > now) {
      bulletCount *= (1 + this.doubleShotStacks);
    }
    
    // Apply super soldier combo
    if (this.superSoldierEndTime > now) {
      bulletCount *= 2;
    }
    
    // Create bullets based on weapon type and power-ups
    for (let i = 0; i < bulletCount; i++) {
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
      
      // Calculate effective damage with all multipliers
      let effectiveDamage = this.weapon.stats.damage;
      
      // Apply permanent damage upgrade
      effectiveDamage *= this.permanentDamageMultiplier;
      
      // Apply temporary weapon upgrade
      effectiveDamage *= (this.weaponDamage / this.baseWeaponDamage);
      
      // Apply berserker mode damage bonus
      if (this.berserkerModeEndTime > now) {
        effectiveDamage *= 1.5;
      }
      
      // Apply super soldier damage bonus
      if (this.superSoldierEndTime > now) {
        effectiveDamage *= 1.3;
      }
      
      // Determine if bullet should pierce
      let shouldPierce = this.weapon.stats.piercing || this.permanentPiercingUpgrade;
      
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
        shouldPierce,
        this.weapon.stats.color,
        this.weapon.stats.range
      ));
    }
    
    return bullets;
  }

  public shootContinuous(deltaTime: number): Bullet[] {
    const now = Date.now();
    
    // Calculate effective fire rate with all upgrades (same as shoot method)
    let effectiveFireRate = this.weapon.stats.fireRate;
    effectiveFireRate *= this.permanentFireRateMultiplier;
    
    if (this.rapidFireEndTime > now) {
      const rapidFireMultiplier = 0.3 + (0.1 * Math.max(0, this.rapidFireStacks - 1));
      effectiveFireRate *= rapidFireMultiplier;
    }
    
    if (this.berserkerModeEndTime > now) {
      effectiveFireRate *= 0.4;
    }
    
    if (this.timeDilationEndTime > now) {
      effectiveFireRate *= 0.2;
    }
    
    // Clamp fire rate to prevent degenerate values
    effectiveFireRate = Math.max(effectiveFireRate, 30);
    
    if (now - this.lastShot < effectiveFireRate) return [];
    if (!this.weapon.canFire()) return [];
    
    this.lastShot = now;
    this.weapon.fire();
    
    const bullets: Bullet[] = [];
    
    // Determine bullet count with power-ups (same as shoot method)
    let bulletCount = this.weapon.stats.bulletCount;
    
    if (this.tripleShotEndTime > now) {
      bulletCount *= (2 + this.tripleShotStacks);
    } else if (this.doubleShotEndTime > now) {
      bulletCount *= (1 + this.doubleShotStacks);
    }
    
    if (this.superSoldierEndTime > now) {
      bulletCount *= 2;
    }
    
    // Create bullets with power-up effects
    for (let i = 0; i < bulletCount; i++) {
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
      
      // Calculate effective damage with all multipliers (same as shoot method)
      let effectiveDamage = this.weapon.stats.damage;
      effectiveDamage *= this.permanentDamageMultiplier;
      effectiveDamage *= (this.weaponDamage / this.baseWeaponDamage);
      
      if (this.berserkerModeEndTime > now) {
        effectiveDamage *= 1.5;
      }
      
      if (this.superSoldierEndTime > now) {
        effectiveDamage *= 1.3;
      }
      
      let shouldPierce = this.weapon.stats.piercing || this.permanentPiercingUpgrade;
      
      bullets.push(new Bullet(
        this.x, 
        this.y, 
        dirX, 
        dirY,
        effectiveDamage,
        this.weapon.stats.bulletSpeed,
        shouldPierce,
        this.weapon.stats.color,
        this.weapon.stats.range
      ));
    }
    
    return bullets;
  }

  public takeDamage(damage: number): boolean {
    const now = Date.now();
    if (now - this.lastDamageTaken < this.damageCooldown) return false;
    
    // Check for shield protection
    if (this.shieldEndTime > now && this.shieldStacks > 0) {
      this.shieldStacks--;
      if (this.shieldStacks <= 0) {
        this.shieldEndTime = 0; // Shield depleted
      }
      return false; // Damage blocked by shield
    }
    
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
    
    // For now, keep instant reload but log the upgrade benefit
    if (this.permanentReloadSpeedMultiplier < 1.0) {
      console.log(`⚡ Fast reload upgrade active: ${Math.round((1 - this.permanentReloadSpeedMultiplier) * 100)}% faster`);
    }
    
    this.weapon.reload();
    return true; // Reloaded successfully
  }

  // Permanent upgrade methods
  public applyDamageUpgrade() {
    this.permanentDamageMultiplier += 0.2; // 20% damage increase per upgrade
  }

  public applyFireRateUpgrade() {
    this.permanentFireRateMultiplier *= 0.85; // 15% faster fire rate per upgrade
  }

  public applyReloadSpeedUpgrade() {
    this.permanentReloadSpeedMultiplier *= 0.8; // 20% faster reload per upgrade
  }

  public applyMaxHealthUpgrade() {
    this.maxHealth += 25;
    this.health += 25; // Also heal when upgrading
  }

  public applyPiercingUpgrade() {
    this.permanentPiercingUpgrade = true;
  }

  // Stackable power-up methods
  public applyDoubleShot(duration: number) {
    this.doubleShotStacks++;
    this.doubleShotEndTime = Date.now() + duration;
  }

  public applyTripleShot(duration: number) {
    this.tripleShotStacks++;
    this.tripleShotEndTime = Date.now() + duration;
  }

  public applyRapidFire(duration: number) {
    this.rapidFireStacks++;
    this.rapidFireEndTime = Date.now() + duration;
  }

  public applyShield(duration: number, stacks: number = 3) {
    this.shieldStacks += stacks;
    this.shieldEndTime = Date.now() + duration;
  }

  public applyVampire(duration: number) {
    this.vampireStacks++;
    this.vampireEndTime = Date.now() + duration;
  }

  // Combination power-up methods
  public applySuperSoldier(duration: number) {
    this.superSoldierEndTime = Date.now() + duration;
    // Super Soldier combines: damage boost, fire rate boost, double shots, and health boost
    this.applySpeedBoost(duration);
    this.heal(50);
  }

  public applyBerserkerMode(duration: number) {
    this.berserkerModeEndTime = Date.now() + duration;
    // Berserker Mode: extreme fire rate and damage, but vulnerability
  }

  public applyTimeDilation(duration: number) {
    this.timeDilationEndTime = Date.now() + duration;
    // Time Dilation: extreme fire rate boost, everything else slows down
  }

  // Vampire healing when dealing damage
  public onZombieKill() {
    if (this.vampireEndTime > Date.now() && this.vampireStacks > 0) {
      const healAmount = 5 * this.vampireStacks; // More stacks = more healing
      this.heal(healAmount);
      console.log(`🩸 Vampire healing: +${healAmount} HP`);
    }
  }

  // Check combination triggers
  public checkCombinations(): ItemType[] {
    const combinations: ItemType[] = [];
    
    // Check for Super Soldier combination (Speed + Damage + Health)
    if (this.speedBoostEndTime > Date.now() && 
        this.weaponUpgradeEndTime > Date.now() && 
        this.health === this.maxHealth) {
      combinations.push(ItemType.SUPER_SOLDIER);
    }
    
    // Check for Berserker Mode combination (Rapid Fire + Double Shot)
    if (this.rapidFireEndTime > Date.now() && 
        this.doubleShotEndTime > Date.now()) {
      combinations.push(ItemType.BERSERKER_MODE);
    }
    
    // Check for Time Dilation combination (Triple Shot + Rapid Fire + Speed)
    if (this.tripleShotEndTime > Date.now() && 
        this.rapidFireEndTime > Date.now() && 
        this.speedBoostEndTime > Date.now()) {
      combinations.push(ItemType.TIME_DILATION);
    }
    
    return combinations;
  }
}

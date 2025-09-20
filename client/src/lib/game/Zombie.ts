export enum ZombieType {
  NORMAL = 'normal',
  FAST = 'fast',
  SPLITTER = 'splitter',
  HEAVY = 'heavy',
  SPLITTER_CHILD = 'splitter_child',
  BOSS = 'boss',
  POISON = 'poison',
  SHIELD = 'shield',
  BERSERKER = 'berserker'
}

export class Zombie {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public health: number;
  public maxHealth: number;
  public speed: number;
  public damage: number;
  public scoreValue: number;
  public type: ZombieType;
  public color: string;
  public shieldHealth: number = 0;
  public poisonTrail: Array<{x: number, y: number, time: number}> = [];
  public lastMinionSpawn: number = 0;
  public enraged: boolean = false;
  public baseSpeed: number;

  constructor(x: number, y: number, type: ZombieType) {
    this.x = x;
    this.y = y;
    this.type = type;
    
    switch (type) {
      case ZombieType.NORMAL:
        this.width = 18;
        this.height = 18;
        this.health = 10;
        this.maxHealth = 10;
        this.speed = 30;
        this.damage = 10;
        this.scoreValue = 10;
        this.color = '#4a5a3a';
        break;
        
      case ZombieType.FAST:
        this.width = 16;
        this.height = 16;
        this.health = 20;
        this.maxHealth = 20;
        this.speed = 80;
        this.damage = 10;
        this.scoreValue = 20;
        this.color = '#7a4a3a';
        break;
        
      case ZombieType.SPLITTER:
        this.width = 20;
        this.height = 20;
        this.health = 10;
        this.maxHealth = 10;
        this.speed = 40;
        this.damage = 5;
        this.scoreValue = 15;
        this.color = '#5a3a7a';
        break;
        
      case ZombieType.HEAVY:
        this.width = 24;
        this.height = 24;
        this.health = 40;
        this.maxHealth = 40;
        this.speed = 20;
        this.damage = 20;
        this.scoreValue = 30;
        this.color = '#6a2a2a';
        break;
        
      case ZombieType.SPLITTER_CHILD:
        this.width = 12;
        this.height = 12;
        this.health = 5;
        this.maxHealth = 5;
        this.speed = 60;
        this.damage = 5;
        this.scoreValue = 5;
        this.color = '#3a2a4a';
        break;
        
      case ZombieType.BOSS:
        this.width = 40;
        this.height = 40;
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 15;
        this.damage = 30;
        this.scoreValue = 100;
        this.color = '#8a1a1a';
        break;
        
      case ZombieType.POISON:
        this.width = 18;
        this.height = 18;
        this.health = 15;
        this.maxHealth = 15;
        this.speed = 25;
        this.damage = 8;
        this.scoreValue = 25;
        this.color = '#2a5a2a';
        break;
        
      case ZombieType.SHIELD:
        this.width = 20;
        this.height = 20;
        this.health = 15;
        this.maxHealth = 15;
        this.speed = 35;
        this.damage = 12;
        this.scoreValue = 35;
        this.color = '#4a4a6a';
        this.shieldHealth = 30;
        break;
        
      case ZombieType.BERSERKER:
        this.width = 22;
        this.height = 22;
        this.health = 25;
        this.maxHealth = 25;
        this.speed = 45;
        this.damage = 15;
        this.scoreValue = 40;
        this.color = '#6a3a1a';
        break;
        
      default:
        this.width = 18;
        this.height = 18;
        this.health = 10;
        this.maxHealth = 10;
        this.speed = 30;
        this.damage = 10;
        this.scoreValue = 10;
        this.color = '#4a5a3a';
    }
    
    this.baseSpeed = this.speed;
  }

  public update(deltaTime: number, playerX: number, playerY: number) {
    // Move towards player
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      let currentSpeed = this.speed;
      
      // Berserker gets faster when damaged
      if (this.type === ZombieType.BERSERKER && this.health < this.maxHealth) {
        const damagePercent = 1 - (this.health / this.maxHealth);
        currentSpeed = this.baseSpeed * (1 + damagePercent * 1.5);
        this.enraged = damagePercent > 0.5;
      }
      
      const moveDistance = (currentSpeed * deltaTime) / 1000;
      this.x += (dx / distance) * moveDistance;
      this.y += (dy / distance) * moveDistance;
      
      // Poison zombie leaves trail
      if (this.type === ZombieType.POISON) {
        const now = Date.now();
        if (this.poisonTrail.length === 0 || now - this.poisonTrail[this.poisonTrail.length - 1].time > 500) {
          this.poisonTrail.push({ x: this.x, y: this.y, time: now });
          // Keep only recent trail points
          this.poisonTrail = this.poisonTrail.filter(point => now - point.time < 5000);
        }
      }
    }
  }

  public takeDamage(damage: number): boolean {
    // Shield zombie blocks some damage
    if (this.type === ZombieType.SHIELD && this.shieldHealth > 0) {
      const shieldDamage = Math.min(damage, this.shieldHealth);
      this.shieldHealth -= shieldDamage;
      damage -= shieldDamage;
      
      // If shield is broken, take remaining damage
      if (damage > 0) {
        this.health = Math.max(0, this.health - damage);
      }
      return shieldDamage > 0; // Return true if any damage was blocked
    } else {
      this.health = Math.max(0, this.health - damage);
      return false;
    }
  }

  public getHealthPercentage(): number {
    return this.health / this.maxHealth;
  }
  
  public getShieldPercentage(): number {
    if (this.type !== ZombieType.SHIELD) return 0;
    return this.shieldHealth / 30; // Max shield health is 30
  }
  
  public shouldSpawnMinion(): boolean {
    if (this.type !== ZombieType.BOSS) return false;
    const now = Date.now();
    if (now - this.lastMinionSpawn > 3000) { // Spawn every 3 seconds
      this.lastMinionSpawn = now;
      return true;
    }
    return false;
  }
  
  public getPoisonTrail(): Array<{x: number, y: number, time: number}> {
    return this.poisonTrail;
  }
}

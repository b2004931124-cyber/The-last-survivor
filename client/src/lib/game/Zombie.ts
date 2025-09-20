export enum ZombieType {
  NORMAL = 'normal',
  FAST = 'fast',
  SPLITTER = 'splitter',
  HEAVY = 'heavy',
  SPLITTER_CHILD = 'splitter_child'
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
  }

  public update(deltaTime: number, playerX: number, playerY: number) {
    // Move towards player
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const moveDistance = (this.speed * deltaTime) / 1000;
      this.x += (dx / distance) * moveDistance;
      this.y += (dy / distance) * moveDistance;
    }
  }

  public takeDamage(damage: number) {
    this.health = Math.max(0, this.health - damage);
  }

  public getHealthPercentage(): number {
    return this.health / this.maxHealth;
  }
}

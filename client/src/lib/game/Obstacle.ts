export enum ObstacleType {
  WALL = 'wall',
  BARRICADE = 'barricade',
  EXPLOSIVE_BARREL = 'explosive_barrel',
  COVER = 'cover'
}

export class Obstacle {
  public x: number;
  public y: number;
  public width!: number;
  public height!: number;
  public health!: number;
  public maxHealth!: number;
  public type: ObstacleType;
  public color!: string;
  public destructible!: boolean;
  public explosive!: boolean;
  public explosionRadius!: number;
  public explosionDamage!: number;

  constructor(x: number, y: number, type: ObstacleType) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.setupObstacle();
  }

  private setupObstacle() {
    switch (this.type) {
      case ObstacleType.WALL:
        this.width = 60;
        this.height = 15;
        this.health = -1; // Indestructible
        this.maxHealth = -1;
        this.color = '#808080';
        this.destructible = false;
        this.explosive = false;
        this.explosionRadius = 0;
        this.explosionDamage = 0;
        break;

      case ObstacleType.BARRICADE:
        this.width = 40;
        this.height = 12;
        this.health = 50;
        this.maxHealth = 50;
        this.color = '#8B4513';
        this.destructible = true;
        this.explosive = false;
        this.explosionRadius = 0;
        this.explosionDamage = 0;
        break;

      case ObstacleType.EXPLOSIVE_BARREL:
        this.width = 20;
        this.height = 25;
        this.health = 20;
        this.maxHealth = 20;
        this.color = '#FF6B35';
        this.destructible = true;
        this.explosive = true;
        this.explosionRadius = 80;
        this.explosionDamage = 40;
        break;

      case ObstacleType.COVER:
        this.width = 30;
        this.height = 10;
        this.health = 30;
        this.maxHealth = 30;
        this.color = '#696969';
        this.destructible = true;
        this.explosive = false;
        this.explosionRadius = 0;
        this.explosionDamage = 0;
        break;

      default:
        this.width = 20;
        this.height = 20;
        this.health = 10;
        this.maxHealth = 10;
        this.color = '#666666';
        this.destructible = true;
        this.explosive = false;
        this.explosionRadius = 0;
        this.explosionDamage = 0;
    }
  }

  public takeDamage(damage: number): boolean {
    if (!this.destructible || this.health === -1) return false;
    
    this.health = Math.max(0, this.health - damage);
    return true;
  }

  public isDestroyed(): boolean {
    return this.destructible && this.health <= 0;
  }

  public getHealthPercentage(): number {
    if (this.health === -1 || this.maxHealth === -1) return 1;
    return this.health / this.maxHealth;
  }

  public shouldExplode(): boolean {
    return this.explosive && this.isDestroyed();
  }

  // Check if point is inside obstacle for collision
  public containsPoint(x: number, y: number): boolean {
    return x >= this.x - this.width / 2 &&
           x <= this.x + this.width / 2 &&
           y >= this.y - this.height / 2 &&
           y <= this.y + this.height / 2;
  }

  // Generate random obstacles for the map
  public static generateRandomObstacles(
    canvasWidth: number, 
    canvasHeight: number, 
    playerX: number, 
    playerY: number
  ): Obstacle[] {
    const obstacles: Obstacle[] = [];
    const obstacleCount = 8 + Math.floor(Math.random() * 5); // 8-12 obstacles
    
    for (let i = 0; i < obstacleCount; i++) {
      let x: number, y: number;
      let attempts = 0;
      
      // Try to place obstacle away from player and other obstacles
      do {
        x = Math.random() * (canvasWidth - 100) + 50;
        y = Math.random() * (canvasHeight - 100) + 50;
        attempts++;
      } while (attempts < 20 && (
        Math.sqrt(Math.pow(x - playerX, 2) + Math.pow(y - playerY, 2)) < 100 ||
        obstacles.some(obs => 
          Math.sqrt(Math.pow(x - obs.x, 2) + Math.pow(y - obs.y, 2)) < 60
        )
      ));
      
      // Choose random obstacle type with different probabilities
      const rand = Math.random();
      let type: ObstacleType;
      
      if (rand < 0.3) {
        type = ObstacleType.WALL;
      } else if (rand < 0.6) {
        type = ObstacleType.BARRICADE;
      } else if (rand < 0.8) {
        type = ObstacleType.COVER;
      } else {
        type = ObstacleType.EXPLOSIVE_BARREL;
      }
      
      obstacles.push(new Obstacle(x, y, type));
    }
    
    return obstacles;
  }
}
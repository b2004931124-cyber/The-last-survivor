export class Bullet {
  public x: number;
  public y: number;
  public width = 4;
  public height = 4;
  public speed: number;
  public dirX: number;
  public dirY: number;
  public damage: number;
  public piercing: boolean;
  public color: string;
  public distanceTraveled = 0;
  public maxRange: number;

  constructor(
    x: number, 
    y: number, 
    dirX: number, 
    dirY: number, 
    damage: number = 10,
    speed: number = 400,
    piercing: boolean = false,
    color: string = '#ffff00',
    maxRange: number = 600
  ) {
    this.x = x;
    this.y = y;
    this.dirX = dirX;
    this.dirY = dirY;
    this.damage = damage;
    this.speed = speed;
    this.piercing = piercing;
    this.color = color;
    this.maxRange = maxRange;
  }

  public update(deltaTime: number) {
    const moveDistance = (this.speed * deltaTime) / 1000;
    this.x += this.dirX * moveDistance;
    this.y += this.dirY * moveDistance;
    this.distanceTraveled += moveDistance;
  }
  
  public isExpired(): boolean {
    return this.distanceTraveled >= this.maxRange;
  }
}

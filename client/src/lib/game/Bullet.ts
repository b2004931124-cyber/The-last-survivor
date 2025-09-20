export class Bullet {
  public x: number;
  public y: number;
  public width = 4;
  public height = 4;
  public speed = 400;
  public dirX: number;
  public dirY: number;

  constructor(x: number, y: number, dirX: number, dirY: number) {
    this.x = x;
    this.y = y;
    this.dirX = dirX;
    this.dirY = dirY;
  }

  public update(deltaTime: number) {
    const moveDistance = (this.speed * deltaTime) / 1000;
    this.x += this.dirX * moveDistance;
    this.y += this.dirY * moveDistance;
  }
}

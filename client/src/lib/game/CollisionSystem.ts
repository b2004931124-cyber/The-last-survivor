interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class CollisionSystem {
  public checkCollision(obj1: GameObject, obj2: GameObject): boolean {
    const obj1Left = obj1.x - obj1.width / 2;
    const obj1Right = obj1.x + obj1.width / 2;
    const obj1Top = obj1.y - obj1.height / 2;
    const obj1Bottom = obj1.y + obj1.height / 2;
    
    const obj2Left = obj2.x - obj2.width / 2;
    const obj2Right = obj2.x + obj2.width / 2;
    const obj2Top = obj2.y - obj2.height / 2;
    const obj2Bottom = obj2.y + obj2.height / 2;
    
    return !(obj1Right < obj2Left || 
             obj1Left > obj2Right || 
             obj1Bottom < obj2Top || 
             obj1Top > obj2Bottom);
  }
}

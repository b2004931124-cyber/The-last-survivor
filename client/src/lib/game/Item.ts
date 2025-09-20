export enum ItemType {
  HEALTH_PACK = 'health_pack',
  SPEED_BOOST = 'speed_boost',
  EXPLOSIVE = 'explosive',
  AK47 = 'ak47'
}

export class Item {
  public x: number;
  public y: number;
  public width = 16;
  public height = 16;
  public type: ItemType;
  public color: string;
  public name: string;

  constructor(x: number, y: number, type: ItemType) {
    this.x = x;
    this.y = y;
    this.type = type;
    
    switch (type) {
      case ItemType.HEALTH_PACK:
        this.color = '#ff4444';
        this.name = 'Health Pack';
        break;
      case ItemType.SPEED_BOOST:
        this.color = '#44ff44';
        this.name = 'Speed Boost';
        break;
      case ItemType.EXPLOSIVE:
        this.color = '#ffaa00';
        this.name = 'Explosive';
        break;
      case ItemType.AK47:
        this.color = '#888888';
        this.name = 'AK47';
        break;
      default:
        this.color = '#ffffff';
        this.name = 'Unknown';
    }
  }
}

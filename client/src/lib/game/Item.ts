export enum ItemType {
  HEALTH_PACK = 'health_pack',
  SPEED_BOOST = 'speed_boost',
  EXPLOSIVE = 'explosive',
  AK47 = 'ak47',
  SHOTGUN = 'shotgun',
  SNIPER_RIFLE = 'sniper_rifle',
  MACHINE_GUN = 'machine_gun',
  LASER_GUN = 'laser_gun'
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
      case ItemType.SHOTGUN:
        this.color = '#8B4513';
        this.name = 'Shotgun';
        break;
      case ItemType.SNIPER_RIFLE:
        this.color = '#2F4F4F';
        this.name = 'Sniper Rifle';
        break;
      case ItemType.MACHINE_GUN:
        this.color = '#556B2F';
        this.name = 'Machine Gun';
        break;
      case ItemType.LASER_GUN:
        this.color = '#4169E1';
        this.name = 'Laser Gun';
        break;
      default:
        this.color = '#ffffff';
        this.name = 'Unknown';
    }
  }
}

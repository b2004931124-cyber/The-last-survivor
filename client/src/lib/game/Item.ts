export enum ItemType {
  HEALTH_PACK = 'health_pack',
  SPEED_BOOST = 'speed_boost',
  EXPLOSIVE = 'explosive',
  AK47 = 'ak47',
  SHOTGUN = 'shotgun',
  SNIPER_RIFLE = 'sniper_rifle',
  MACHINE_GUN = 'machine_gun',
  LASER_GUN = 'laser_gun',
  // New upgrade items
  DAMAGE_UPGRADE = 'damage_upgrade',
  FIRE_RATE_UPGRADE = 'fire_rate_upgrade',
  MAX_HEALTH_UPGRADE = 'max_health_upgrade',
  PIERCING_UPGRADE = 'piercing_upgrade',
  // Stackable power-ups
  DOUBLE_SHOT = 'double_shot',
  TRIPLE_SHOT = 'triple_shot',
  RAPID_FIRE = 'rapid_fire',
  SHIELD = 'shield',
  VAMPIRE = 'vampire',
  // Combination items
  SUPER_SOLDIER = 'super_soldier',
  BERSERKER_MODE = 'berserker_mode',
  TIME_DILATION = 'time_dilation'
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
      // New upgrade items
      case ItemType.DAMAGE_UPGRADE:
        this.color = '#FF6B6B';
        this.name = 'Damage Upgrade';
        break;
      case ItemType.FIRE_RATE_UPGRADE:
        this.color = '#FFB366';
        this.name = 'Fire Rate Upgrade';
        break;
      case ItemType.MAX_HEALTH_UPGRADE:
        this.color = '#FF66B3';
        this.name = 'Max Health Upgrade';
        break;
      case ItemType.PIERCING_UPGRADE:
        this.color = '#B366FF';
        this.name = 'Piercing Upgrade';
        break;
      // Stackable power-ups
      case ItemType.DOUBLE_SHOT:
        this.color = '#66FFB3';
        this.name = 'Double Shot';
        break;
      case ItemType.TRIPLE_SHOT:
        this.color = '#66FFFF';
        this.name = 'Triple Shot';
        break;
      case ItemType.RAPID_FIRE:
        this.color = '#FF8C66';
        this.name = 'Rapid Fire';
        break;
      case ItemType.SHIELD:
        this.color = '#C0C0C0';
        this.name = 'Shield';
        break;
      case ItemType.VAMPIRE:
        this.color = '#8B0000';
        this.name = 'Vampire';
        break;
      // Combination items
      case ItemType.SUPER_SOLDIER:
        this.color = '#FFD700';
        this.name = 'Super Soldier';
        break;
      case ItemType.BERSERKER_MODE:
        this.color = '#DC143C';
        this.name = 'Berserker Mode';
        break;
      case ItemType.TIME_DILATION:
        this.color = '#9932CC';
        this.name = 'Time Dilation';
        break;
      default:
        this.color = '#ffffff';
        this.name = 'Unknown';
    }
  }
}

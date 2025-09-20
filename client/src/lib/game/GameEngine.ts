import { Player } from './Player';
import { Zombie, ZombieType } from './Zombie';
import { Bullet } from './Bullet';
import { Item, ItemType } from './Item';
import { GameState } from './GameState';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';
import { CollisionSystem } from './CollisionSystem';
import { Renderer } from './Renderer';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameState: GameState;
  private player: Player;
  private zombies: Zombie[] = [];
  private bullets: Bullet[] = [];
  private items: Item[] = [];
  private inputManager: InputManager;
  private audioManager: AudioManager;
  private collisionSystem: CollisionSystem;
  private renderer: Renderer;
  private animationId: number | null = null;
  private lastTime = 0;
  private lastZombieSpawn = 0;
  private lastItemSpawn = 0;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gameState = new GameState();
    this.player = new Player(canvas.width / 2, canvas.height / 2);
    this.inputManager = new InputManager(canvas);
    this.audioManager = new AudioManager();
    this.collisionSystem = new CollisionSystem();
    this.renderer = new Renderer(ctx);

    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Mouse shooting
    this.canvas.addEventListener('mousedown', (e) => {
      if (this.gameState.phase !== 'playing') return;
      this.inputManager.setMouseDown(true);
      this.handleShooting(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('mouseup', () => {
      this.inputManager.setMouseDown(false);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.gameState.phase !== 'playing') return;
      if (this.inputManager.isMouseDown()) {
        this.handleShooting(e.clientX, e.clientY);
      }
    });

    // Item usage
    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyE' && this.gameState.phase === 'playing') {
        this.useItem();
      }
    });
  }

  private handleShooting(mouseX: number, mouseY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const targetX = mouseX - rect.left;
    const targetY = mouseY - rect.top;
    
    const bullet = this.player.shoot(targetX, targetY);
    if (bullet) {
      this.bullets.push(bullet);
      this.audioManager.playShoot();
    }
  }

  private useItem() {
    if (this.player.inventory) {
      const item = this.player.inventory;
      this.player.inventory = null;
      this.applyItemEffect(item);
      this.audioManager.playItemUse();
    }
  }

  private applyItemEffect(item: Item) {
    switch (item.type) {
      case ItemType.HEALTH_PACK:
        this.player.heal(30);
        break;
      case ItemType.SPEED_BOOST:
        this.player.applySpeedBoost(10000); // 10 seconds
        break;
      case ItemType.EXPLOSIVE:
        this.explodeAroundPlayer();
        break;
      case ItemType.AK47:
        this.player.applyWeaponUpgrade(10000); // 10 seconds
        break;
    }
  }

  private explodeAroundPlayer() {
    this.explodeAt(this.player.x, this.player.y, 100, 50);
  }
  
  private explodeAt(x: number, y: number, radius: number, damage: number) {
    for (let i = this.zombies.length - 1; i >= 0; i--) {
      const zombie = this.zombies[i];
      const distance = Math.sqrt(
        Math.pow(zombie.x - x, 2) + 
        Math.pow(zombie.y - y, 2)
      );
      
      if (distance <= radius) {
        zombie.takeDamage(damage);
        this.audioManager.playHit();
        
        if (zombie.health <= 0) {
          this.handleZombieDeath(zombie, i);
        }
      }
    }
  }
  
  private checkPoisonDamage() {
    // Check if player is in any poison area
    const inPoison = this.zombies.some(zombie => {
      if (zombie.type !== ZombieType.POISON) return false;
      
      const trail = zombie.getPoisonTrail();
      return trail.some(point => {
        const distance = Math.sqrt(
          Math.pow(point.x - this.player.x, 2) + 
          Math.pow(point.y - this.player.y, 2)
        );
        return distance <= 15; // Poison radius
      });
    });
    
    // Apply poison damage only once per cooldown period
    if (inPoison) {
      if (this.player.takePoisonDamage(2)) {
        this.audioManager.playPlayerHit();
      }
    }
  }

  private spawnZombie() {
    const now = Date.now();
    if (now - this.lastZombieSpawn < 1000) return; // Spawn every second
    
    this.lastZombieSpawn = now;
    
    // Determine spawn position (from edges)
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch (side) {
      case 0: // Top
        x = Math.random() * this.canvas.width;
        y = -20;
        break;
      case 1: // Right
        x = this.canvas.width + 20;
        y = Math.random() * this.canvas.height;
        break;
      case 2: // Bottom
        x = Math.random() * this.canvas.width;
        y = this.canvas.height + 20;
        break;
      case 3: // Left
        x = -20;
        y = Math.random() * this.canvas.height;
        break;
      default:
        x = 0;
        y = 0;
    }
    
    // Determine zombie type based on spawn rates (including new types)
    const rand = Math.random();
    let zombieType: ZombieType;
    
    if (rand < 0.35) {
      zombieType = ZombieType.NORMAL;
    } else if (rand < 0.5) {
      zombieType = ZombieType.FAST;
    } else if (rand < 0.65) {
      zombieType = ZombieType.SPLITTER;
    } else if (rand < 0.75) {
      zombieType = ZombieType.HEAVY;
    } else if (rand < 0.83) {
      zombieType = ZombieType.POISON;
    } else if (rand < 0.91) {
      zombieType = ZombieType.SHIELD;
    } else if (rand < 0.97) {
      zombieType = ZombieType.BERSERKER;
    } else {
      zombieType = ZombieType.BOSS;
    }
    
    this.zombies.push(new Zombie(x, y, zombieType));
  }

  private spawnItem() {
    const now = Date.now();
    if (now - this.lastItemSpawn < 15000) return; // Spawn every 15 seconds
    
    this.lastItemSpawn = now;
    
    const x = Math.random() * (this.canvas.width - 40) + 20;
    const y = Math.random() * (this.canvas.height - 40) + 20;
    
    const itemTypes = Object.values(ItemType);
    const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    
    this.items.push(new Item(x, y, randomType));
  }

  private handleZombieDeath(zombie: Zombie, index: number) {
    this.gameState.addScore(zombie.scoreValue);
    this.zombies.splice(index, 1);
    this.audioManager.playZombieDeath();
    
    // Handle special zombie death effects
    if (zombie.type === ZombieType.SPLITTER) {
      const splitZombie1 = new Zombie(zombie.x - 20, zombie.y, ZombieType.SPLITTER_CHILD);
      const splitZombie2 = new Zombie(zombie.x + 20, zombie.y, ZombieType.SPLITTER_CHILD);
      this.zombies.push(splitZombie1, splitZombie2);
    } else if (zombie.type === ZombieType.BOSS) {
      // Boss death explosion effect
      this.explodeAt(zombie.x, zombie.y, 150, 75);
    }
  }

  private update(deltaTime: number) {
    if (this.gameState.phase !== 'playing') return;
    
    // Update game time
    this.gameState.updateTime(deltaTime);
    
    // Handle input
    this.player.handleInput(this.inputManager, deltaTime);
    
    // Continuous shooting with space or mouse
    if (this.inputManager.isKeyPressed('Space') || this.inputManager.isMouseDown()) {
      const bullet = this.player.shootContinuous(deltaTime);
      if (bullet) {
        this.bullets.push(bullet);
        this.audioManager.playShoot();
      }
    }
    
    // Update player
    this.player.update(deltaTime, this.canvas.width, this.canvas.height);
    
    // Update zombies and handle special abilities
    this.zombies.forEach(zombie => {
      zombie.update(deltaTime, this.player.x, this.player.y);
      
      // Boss zombie spawns minions
      if (zombie.shouldSpawnMinion()) {
        const minionX = zombie.x + (Math.random() - 0.5) * 60;
        const minionY = zombie.y + (Math.random() - 0.5) * 60;
        this.zombies.push(new Zombie(minionX, minionY, ZombieType.NORMAL));
      }
    });
    
    // Update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update(deltaTime);
      
      // Remove bullets that are off-screen
      if (bullet.x < -50 || bullet.x > this.canvas.width + 50 ||
          bullet.y < -50 || bullet.y > this.canvas.height + 50) {
        this.bullets.splice(i, 1);
      }
    }
    
    // Check collisions
    this.checkCollisions();
    
    // Check poison trail damage
    this.checkPoisonDamage();
    
    // Spawn entities
    this.spawnZombie();
    this.spawnItem();
    
    // Check game over
    if (this.player.health <= 0) {
      this.gameState.setPhase('ended');
    }
  }

  private checkCollisions() {
    // Bullet-Zombie collisions
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      
      for (let j = this.zombies.length - 1; j >= 0; j--) {
        const zombie = this.zombies[j];
        
        if (this.collisionSystem.checkCollision(bullet, zombie)) {
          const shieldBlocked = zombie.takeDamage(this.player.weaponDamage);
          
          // Some bullets may bounce off shields
          if (!shieldBlocked || zombie.type !== ZombieType.SHIELD || Math.random() > 0.7) {
            this.bullets.splice(i, 1);
          }
          
          this.audioManager.playHit();
          
          if (zombie.health <= 0) {
            this.handleZombieDeath(zombie, j);
          }
          break;
        }
      }
    }
    
    // Player-Zombie collisions
    this.zombies.forEach(zombie => {
      if (this.collisionSystem.checkCollision(this.player, zombie)) {
        if (this.player.takeDamage(zombie.damage)) {
          this.audioManager.playPlayerHit();
        }
      }
    });
    
    // Player-Item collisions
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      
      if (this.collisionSystem.checkCollision(this.player, item)) {
        this.player.inventory = item;
        this.items.splice(i, 1);
        this.audioManager.playItemPickup();
      }
    }
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.gameState.phase === 'playing') {
      // Render poison trails first (behind everything else)
      this.renderer.renderPoisonTrails(this.zombies);
      
      // Render game objects
      this.renderer.renderPlayer(this.player);
      this.zombies.forEach(zombie => this.renderer.renderZombie(zombie));
      this.bullets.forEach(bullet => this.renderer.renderBullet(bullet));
      this.items.forEach(item => this.renderer.renderItem(item));
      
      // Render UI
      this.renderer.renderUI(this.gameState, this.player);
    } else if (this.gameState.phase === 'ended') {
      this.renderer.renderGameOver(this.gameState, this.canvas.width, this.canvas.height);
    }
  }

  private gameLoop = (currentTime: number) => {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    this.render();
    
    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  public start() {
    this.gameState.setPhase('playing');
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  public restart() {
    // Reset game state
    this.gameState = new GameState();
    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
    this.zombies = [];
    this.bullets = [];
    this.items = [];
    this.lastZombieSpawn = 0;
    this.lastItemSpawn = 0;
    
    this.start();
  }

  public destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.audioManager.destroy();
  }
}

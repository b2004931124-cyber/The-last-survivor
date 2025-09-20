import { Player } from './Player';
import { Zombie, ZombieType } from './Zombie';
import { Bullet } from './Bullet';
import { Item } from './Item';
import { GameState } from './GameState';

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public renderPlayer(player: Player) {
    this.ctx.save();
    
    // Flash red if invulnerable
    if (player.isInvulnerable()) {
      this.ctx.globalAlpha = 0.5;
    }
    
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.fillRect(
      player.x - player.width / 2,
      player.y - player.height / 2,
      player.width,
      player.height
    );
    
    // Draw health bar above player
    const barWidth = 30;
    const barHeight = 4;
    const barX = player.x - barWidth / 2;
    const barY = player.y - player.height / 2 - 10;
    
    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillRect(barX, barY, barWidth, barHeight);
    
    this.ctx.fillStyle = '#00ff00';
    const healthWidth = (player.health / player.maxHealth) * barWidth;
    this.ctx.fillRect(barX, barY, healthWidth, barHeight);
    
    this.ctx.restore();
  }

  public renderZombie(zombie: Zombie) {
    this.ctx.save();
    
    // Special effects for berserker when enraged
    if (zombie.type === ZombieType.BERSERKER && zombie.enraged) {
      this.ctx.shadowColor = '#ff0000';
      this.ctx.shadowBlur = 10;
    }
    
    this.ctx.fillStyle = zombie.color;
    this.ctx.fillRect(
      zombie.x - zombie.width / 2,
      zombie.y - zombie.height / 2,
      zombie.width,
      zombie.height
    );
    
    // Draw shield for shield zombies
    if (zombie.type === ZombieType.SHIELD && zombie.shieldHealth > 0) {
      this.ctx.strokeStyle = '#00aaff';
      this.ctx.lineWidth = 3;
      this.ctx.globalAlpha = 0.7;
      this.ctx.strokeRect(
        zombie.x - zombie.width / 2 - 3,
        zombie.y - zombie.height / 2 - 3,
        zombie.width + 6,
        zombie.height + 6
      );
      this.ctx.globalAlpha = 1.0;
    }
    
    // Draw crown for boss zombies
    if (zombie.type === ZombieType.BOSS) {
      this.ctx.fillStyle = '#ffaa00';
      this.ctx.fillRect(
        zombie.x - 8,
        zombie.y - zombie.height / 2 - 8,
        16,
        6
      );
      // Crown points
      this.ctx.fillRect(zombie.x - 6, zombie.y - zombie.height / 2 - 10, 3, 4);
      this.ctx.fillRect(zombie.x - 1, zombie.y - zombie.height / 2 - 12, 3, 6);
      this.ctx.fillRect(zombie.x + 4, zombie.y - zombie.height / 2 - 10, 3, 4);
    }
    
    // Draw health bar for boss and heavy zombies
    if ((zombie.type === ZombieType.HEAVY || zombie.type === ZombieType.BOSS) && zombie.health < zombie.maxHealth) {
      const barWidth = zombie.type === ZombieType.BOSS ? 50 : 30;
      const barHeight = 4;
      const barX = zombie.x - barWidth / 2;
      const barY = zombie.y - zombie.height / 2 - (zombie.type === ZombieType.BOSS ? 15 : 8);
      
      this.ctx.fillStyle = '#ff0000';
      this.ctx.fillRect(barX, barY, barWidth, barHeight);
      
      this.ctx.fillStyle = zombie.type === ZombieType.BOSS ? '#ffaa00' : '#ffaa00';
      const healthWidth = zombie.getHealthPercentage() * barWidth;
      this.ctx.fillRect(barX, barY, healthWidth, barHeight);
    }
    
    // Draw shield bar for shield zombies
    if (zombie.type === ZombieType.SHIELD && zombie.shieldHealth > 0) {
      const barWidth = 25;
      const barHeight = 3;
      const barX = zombie.x - barWidth / 2;
      const barY = zombie.y + zombie.height / 2 + 3;
      
      this.ctx.fillStyle = '#0066cc';
      this.ctx.fillRect(barX, barY, barWidth, barHeight);
      
      this.ctx.fillStyle = '#00aaff';
      const shieldWidth = zombie.getShieldPercentage() * barWidth;
      this.ctx.fillRect(barX, barY, shieldWidth, barHeight);
    }
    
    this.ctx.restore();
  }

  public renderBullet(bullet: Bullet) {
    this.ctx.fillStyle = '#ffff00';
    this.ctx.fillRect(
      bullet.x - bullet.width / 2,
      bullet.y - bullet.height / 2,
      bullet.width,
      bullet.height
    );
  }

  public renderItem(item: Item) {
    this.ctx.fillStyle = item.color;
    this.ctx.fillRect(
      item.x - item.width / 2,
      item.y - item.height / 2,
      item.width,
      item.height
    );
    
    // Draw border
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      item.x - item.width / 2,
      item.y - item.height / 2,
      item.width,
      item.height
    );
  }

  public renderUI(gameState: GameState, player: Player) {
    this.ctx.save();
    this.ctx.font = '16px Inter, Arial, sans-serif';
    
    // Health (bottom left)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, this.ctx.canvas.height - 50, 120, 35);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(`HP: ${player.health}/${player.maxHealth}`, 20, this.ctx.canvas.height - 25);
    
    // Score and time (top center)
    const scoreText = `Score: ${gameState.score}`;
    const timeText = `Time: ${gameState.getSurvivalTimeFormatted()}`;
    const scoreWidth = this.ctx.measureText(scoreText).width;
    const timeWidth = this.ctx.measureText(timeText).width;
    const maxWidth = Math.max(scoreWidth, timeWidth);
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(this.ctx.canvas.width / 2 - maxWidth / 2 - 10, 10, maxWidth + 20, 50);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(scoreText, this.ctx.canvas.width / 2 - scoreWidth / 2, 30);
    this.ctx.fillText(timeText, this.ctx.canvas.width / 2 - timeWidth / 2, 50);
    
    // Inventory (bottom right)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(this.ctx.canvas.width - 130, this.ctx.canvas.height - 70, 120, 60);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText('Inventory (E):', this.ctx.canvas.width - 125, this.ctx.canvas.height - 50);
    
    if (player.inventory) {
      this.ctx.fillStyle = player.inventory.color;
      this.ctx.fillRect(this.ctx.canvas.width - 100, this.ctx.canvas.height - 40, 16, 16);
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '12px Inter, Arial, sans-serif';
      this.ctx.fillText(player.inventory.name, this.ctx.canvas.width - 80, this.ctx.canvas.height - 28);
    } else {
      this.ctx.fillStyle = '#666666';
      this.ctx.fillText('Empty', this.ctx.canvas.width - 100, this.ctx.canvas.height - 30);
    }
    
    this.ctx.restore();
  }
  
  public renderPoisonTrails(zombies: any[]) {
    this.ctx.save();
    
    zombies.forEach(zombie => {
      if (zombie.type === ZombieType.POISON) {
        const trail = zombie.getPoisonTrail();
        const now = Date.now();
        
        trail.forEach((point: {x: number, y: number, time: number}) => {
          const age = now - point.time;
          const alpha = Math.max(0, 1 - age / 5000); // Fade over 5 seconds
          
          this.ctx.globalAlpha = alpha * 0.6;
          this.ctx.fillStyle = '#00ff00';
          this.ctx.fillRect(point.x - 8, point.y - 8, 16, 16);
        });
      }
    });
    
    this.ctx.restore();
  }

  public renderGameOver(gameState: GameState, canvasWidth: number, canvasHeight: number) {
    this.ctx.save();
    
    // Background overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Game Over text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 48px Inter, Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', canvasWidth / 2, canvasHeight / 2 - 100);
    
    // Stats
    this.ctx.font = '24px Inter, Arial, sans-serif';
    this.ctx.fillText(`Final Score: ${gameState.score}`, canvasWidth / 2, canvasHeight / 2 - 40);
    this.ctx.fillText(`Survival Time: ${gameState.getSurvivalTimeFormatted()}`, canvasWidth / 2, canvasHeight / 2);
    
    // Restart instruction
    this.ctx.font = '18px Inter, Arial, sans-serif';
    this.ctx.fillText('Click to restart', canvasWidth / 2, canvasHeight / 2 + 60);
    
    this.ctx.restore();
    
    // Add click listener for restart
    const restartHandler = () => {
      window.location.reload();
    };
    
    this.ctx.canvas.addEventListener('click', restartHandler, { once: true });
  }
}

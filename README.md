# 建議系統需求:
Node.js 20+（建議使用 v20.x），否則容易報錯
現代瀏覽器（支援HTML5 Canvas）
## 安裝步驟 Installation Steps
```bash
# 1. 開啟命令提示字元，並 CD 至專案資料夾

# 2. 安裝依賴 Install dependencies
npm install

# 3. 啟動開發伺服器 Start development server  
npm run dev

# 4. 開啟瀏覽器訪問 Open browser and visit
# http://localhost:5000
```
# Zombie Survival Game

A 2D pixel-style zombie survival shooting game built with HTML5 Canvas and TypeScript.

## Game Overview

You play as a survivor trying to stay alive against waves of zombies. Use various weapons and items to survive as long as possible while earning points by eliminating zombies.

## Controls

- **Movement**: WASD keys or Arrow keys
- **Shooting**: Hold Spacebar for continuous shooting, or hold mouse button and move cursor to aim
- **Use Item**: Press E to use the item in your inventory

## Gameplay Features

### Player Character
- Health: 100 HP (displayed in bottom left)
- Movement: Free 360-degree movement
- Weapon: Starting damage of 10 per bullet
- Inventory: Can carry one item at a time

### Zombie Types

1. **Normal Zombie** (50% spawn rate)
   - Health: 10 HP
   - Speed: Slow
   - Damage: 10
   - Score: 10 points

2. **Fast Zombie** (20% spawn rate)
   - Health: 20 HP
   - Speed: Fast
   - Damage: 10
   - Score: 20 points

3. **Splitter Zombie** (20% spawn rate)
   - Health: 10 HP
   - Speed: Medium
   - Damage: 5
   - Score: 15 points
   - **Special**: Splits into 2 smaller zombies when killed

4. **Heavy Zombie** (10% spawn rate)
   - Health: 40 HP
   - Speed: Very slow
   - Damage: 20
   - Score: 30 points

### Items (spawn every 15 seconds)

1. **Health Pack** (Red)
   - Restores 30 HP

2. **Speed Boost** (Green)
   - Increases movement speed by 50% for 10 seconds

3. **Explosive** (Orange)
   - Damages all zombies within range when used

4. **AK47 Upgrade** (Gray)
   - Increases weapon damage to 20 for 10 seconds

## Game Mechanics

- **Survival**: The game tracks your survival time starting from 0 seconds
- **Scoring**: Earn points by killing zombies, different types give different scores
- **Damage**: Players have 1-second invincibility after taking damage
- **Spawning**: Zombies spawn from the edges of the screen every second
- **Items**: Appear randomly on the map, walk over them to pick up

## UI Elements

- **Top Center**: Score and survival time
- **Bottom Left**: Health bar
- **Bottom Right**: Current inventory item

## Audio

The game includes sound effects for:
- Shooting bullets
- Hitting zombies
- Zombie deaths
- Item pickup
- Item usage
- Player taking damage
- Background music

## Game Over

When your health reaches 0, the game ends and displays:
- Final score
- Total survival time
- Option to restart

## File Structure


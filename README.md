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



請用 JavaScript 和 HTML5 Canvas 製作一款 2D 射擊類小遊戲，主題為「最後生還者」。

遊戲需求如下：

1. 玩家角色：
- 玩家控制一名倖存者角色，可以在地圖上自由上下左右移動（使用鍵盤方向鍵或 WASD）。
- 玩家可以發射子彈射擊殭屍（使用空白鍵或滑鼠按住持續射擊），初始武器有10滴傷害。
- 玩家有血量（初始 100HP，顯示在左下角），被殭屍碰觸會扣血。
- 玩家有得分系統，擊倒殭屍可得分。
- 畫面右下角顯示一個背包格子，用來儲存道具。
- 玩家可按下 E 鍵使用背包中的道具。

2. 敵人殭屍：
- 殭屍會從畫面四周隨機生成並朝玩家移動。
- 擊中殭屍可得分，殭屍被擊倒後消失。
- 殭屍種類包含：
  - 普通殭屍(生成機率:50%)：緩慢移動，朝玩家方向前進。(生命值10滴，傷害10滴血，得分10分)
  - 快速殭屍(生成機率:20%)：移動速度快，血量低。(生命值20滴，傷害10滴血，得分20分)
  - 分裂殭屍(生成機率:20%)：被擊倒後分裂成兩個小殭屍。(生命值10滴，傷害5滴血，得分5分)
  - 重型殭屍(生成機率:10%)：血量高，移動慢，需多次射擊才能擊倒。(生命值40滴，傷害20滴血，得分30分)

3. 道具系統：
- 每 15 秒會在地圖上隨機生成一個道具。
- 道具種類包含：
  - 補血包：恢復玩家血量30HP。
  - 加速器：提升玩家移動速度10秒。
  - 爆炸彈：對玩家前方造成範圍傷害，擊倒玩家面向前方範圍的殭屍。
  - AK47步槍:能夠將武器傷害提升至20，持續10秒。
- 玩家碰觸道具後可拾取並儲存至背包，若已有道具則會覆蓋之前儲存的道具，變成新拾取的道具。
- 玩家按下 E 鍵可使用背包中的道具，並觸發對應效果。

4. UI 顯示：
- 畫面左下角顯示玩家血量HP。
- 畫面中上方顯示玩家目前積分與存活時間(從0秒開始計算)。
- 畫面右下角顯示背包道具狀態。
- 可加入音效與背景音樂（例如射擊、命中、拾取道具、使用道具、殭屍死亡音效等）。
- 玩家死亡後，會出現Game over結算畫面，顯示積分與生存時間，還有重新遊玩按鈕。

5. 技術建議：
- 使用 Canvas 繪製角色、殭屍與道具、UI介面等。
- 使用 `requestAnimationFrame` 控制遊戲迴圈。
- 使用 `class` 建立 Player、Zombie、Bullet、Item 等物件。
- 使用碰撞偵測判斷角色與殭屍、道具的互動。
- 請生成一個可執行的 HTML + JavaScript 原始碼骨架，並包含註解說明每個主要模組的功能。

## File Structure


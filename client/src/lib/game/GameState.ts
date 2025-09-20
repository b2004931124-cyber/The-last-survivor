export type GamePhase = 'ready' | 'playing' | 'ended';

export class GameState {
  public phase: GamePhase = 'ready';
  public score = 0;
  public survivalTime = 0;
  private startTime = 0;

  public setPhase(phase: GamePhase) {
    this.phase = phase;
    if (phase === 'playing') {
      this.startTime = Date.now();
    }
  }

  public addScore(points: number) {
    this.score += points;
  }

  public updateTime(deltaTime: number) {
    if (this.phase === 'playing') {
      this.survivalTime = (Date.now() - this.startTime) / 1000;
    }
  }

  public getSurvivalTimeFormatted(): string {
    const minutes = Math.floor(this.survivalTime / 60);
    const seconds = Math.floor(this.survivalTime % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

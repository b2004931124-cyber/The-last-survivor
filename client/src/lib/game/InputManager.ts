export class InputManager {
  private keys: Set<string> = new Set();
  private mouseDown = false;

  constructor(canvas: HTMLCanvasElement) {
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
    });

    document.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    // Prevent context menu on right click
    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  public isKeyPressed(key: string): boolean {
    return this.keys.has(key);
  }

  public isMouseDown(): boolean {
    return this.mouseDown;
  }

  public setMouseDown(down: boolean) {
    this.mouseDown = down;
  }
}

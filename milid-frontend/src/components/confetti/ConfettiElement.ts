
import { Confetti } from './Confetti';

export class ConfettiElement {

  canvas!: HTMLCanvasElement | null;
  confetti!: Confetti | null;

  mounted = false;

  get pixelRatio(): number {
    return window.devicePixelRatio || 1;
  }

  mount() {
    if (this.mounted) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '30';
    canvas.style.pointerEvents = 'none';
    this.canvas = document.body.appendChild(canvas);

    const width = window.innerWidth;
    const height = window.innerHeight;
    this.canvas.width = Math.floor(width * this.pixelRatio);
    this.canvas.height = Math.floor(height * this.pixelRatio);

    this.mounted = true;
    //
    // options
    // https://github.com/alampros/react-confetti#props
    this.confetti = new Confetti(this.canvas, {
      numberOfPieces: 300,
      recycle: false,
      colors: ['#0077b4', '#e84a64', '#e8e664']
    }) as Confetti;

    setTimeout(() => this.stop(), 8000);
  }

  stop() {
    if (this.confetti) {
      this.confetti.stop();
    }
  }

  unmount() {
    if (!this.mounted) return;

    this.stop();

    if (this.canvas) {
      document.body.removeChild(this.canvas);
    }

    this.mounted = false;
  }
}
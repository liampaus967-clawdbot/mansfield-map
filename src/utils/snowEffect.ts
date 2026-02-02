import mapboxgl from 'mapbox-gl';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  opacity: number;
}

export class SnowEffect {
  private map: mapboxgl.Map;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private snowflakes: Snowflake[] = [];
  private animationId: number | null = null;
  private isActive: boolean = false;

  constructor(map: mapboxgl.Map) {
    this.map = map;
  }

  public start(density: number = 150): void {
    if (this.isActive) return;
    this.isActive = true;

    // Create canvas overlay
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '999';

    const mapContainer = this.map.getContainer();
    mapContainer.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    // Initialize snowflakes
    this.snowflakes = [];
    for (let i = 0; i < density; i++) {
      this.snowflakes.push(this.createSnowflake());
    }

    // Start animation
    this.animate();

    // Handle resize
    window.addEventListener('resize', this.resize);
  }

  public stop(): void {
    if (!this.isActive) return;
    this.isActive = false;

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    this.canvas = null;
    this.ctx = null;
    this.snowflakes = [];

    window.removeEventListener('resize', this.resize);
  }

  private createSnowflake(forceTop: boolean = false): Snowflake {
    const canvas = this.canvas!;
    return {
      x: Math.random() * canvas.width,
      y: forceTop ? Math.random() * canvas.height : -10,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 1.5 + 0.5,
      drift: Math.random() * 1 - 0.5,
      opacity: Math.random() * 0.6 + 0.4,
    };
  }

  private resize = (): void => {
    if (!this.canvas) return;
    const rect = this.map.getContainer().getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  };

  private animate = (): void => {
    if (!this.isActive || !this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw snowflakes
    this.snowflakes.forEach((flake, index) => {
      // Update position
      flake.y += flake.speed;
      flake.x += flake.drift;

      // Reset snowflake if it goes off screen
      if (flake.y > this.canvas!.height) {
        this.snowflakes[index] = this.createSnowflake();
      }
      if (flake.x > this.canvas!.width) {
        flake.x = 0;
      }
      if (flake.x < 0) {
        flake.x = this.canvas!.width;
      }

      // Draw snowflake
      this.ctx!.beginPath();
      this.ctx!.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      this.ctx!.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      this.ctx!.fill();
    });

    this.animationId = requestAnimationFrame(this.animate);
  };
}


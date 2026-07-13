let particles = [];
const PARTICLE_COUNT = 220;
const NOISE_SCALE = 0.0015;
const NOISE_TIME_SCALE = 0.0006;
const BG = 245;
let noiseZ = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.id('p5-bg-canvas');
  background(BG);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(spawnParticle());
  }
}

function spawnParticle() {
  return {
    x: random(width),
    y: random(height),
    px: 0,
    py: 0,
    life: random(80, 260),
  };
}

function draw() {
  // Faint fade overlay so trails dissolve gradually instead of filling the screen.
  noStroke();
  fill(BG, BG, BG, 5);
  rect(0, 0, width, height);

  stroke(40, 40, 40, 14);
  strokeWeight(0.70);
  noFill();

  for (const p of particles) {
    p.px = p.x;
    p.py = p.y;
    const angle = noise(p.x * NOISE_SCALE, p.y * NOISE_SCALE, noiseZ) * TWO_PI * 2;
    p.x += cos(angle);
    p.y += sin(angle);
    line(p.px, p.py, p.x, p.y);
    p.life--;
    if (p.life <= 0 || p.x < -5 || p.x > width + 5 || p.y < -5 || p.y > height + 5) {
      p.x = random(width);
      p.y = random(height);
      p.life = random(80, 260);
    }
  }

  noiseZ += NOISE_TIME_SCALE;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(BG);
}

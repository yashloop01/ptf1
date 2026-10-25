/**
 * ThreeScene - Interactive 3D WebGL Atmosphere
 * Tailored for Google Material You & Apple Light Aesthetic
 * Features:
 * - 4 Selectable 3D Modes:
 *   1. Deep Space Orbit (Google 4-Color Orbital Satellites & Clean Hologram Rings)
 *   2. Neural Matrix (Google Blue AI Synaptic Lattice)
 *   3. Quantum Torus (Smooth Light Ribbon Knot)
 *   4. Stardust Swarm (Google 4-Color Ambient Micro-Particles)
 * - Dynamic lighting reacting to cursor coordinates
 * - Camera scroll parallax
 * - Smooth lerp damping and responsive resize
 */

class Universe3D {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.canvas = document.getElementById('webgl-canvas');
    if (!this.canvas) return;

    this.currentMode = 'space'; // 'space' | 'neural' | 'torus' | 'particles'
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    // 1. Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xf8f9fa, 0.0012);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 24;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // 2. Lights
    this.setupLights();

    // 3. Create Starfield / Floating Stardust Background
    this.createStarfield();

    // 4. Object Groups for each mode
    this.spaceGroup = new THREE.Group();
    this.neuralGroup = new THREE.Group();
    this.torusGroup = new THREE.Group();
    this.swarmGroup = new THREE.Group();

    this.scene.add(this.spaceGroup);
    this.scene.add(this.neuralGroup);
    this.scene.add(this.torusGroup);
    this.scene.add(this.swarmGroup);

    // Build geometries for modes
    this.buildSpaceMode();
    this.buildNeuralMode();
    this.buildTorusMode();
    this.buildSwarmMode();

    // Set initial visibility
    this.setMode(this.currentMode, false);

    // 5. Events
    this.bindEvents();

    // 6. Start Render Loop
    this.animate();
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    this.scene.add(ambientLight);

    // Cursor tracking point lights (Google Blue and Google Red)
    this.cyanLight = new THREE.PointLight(0x1a73e8, 3.5, 50);
    this.cyanLight.position.set(10, 10, 15);
    this.scene.add(this.cyanLight);

    this.purpleLight = new THREE.PointLight(0xea4335, 2.8, 50);
    this.purpleLight.position.set(-10, -10, 15);
    this.scene.add(this.purpleLight);

    const centerGlow = new THREE.PointLight(0x4285f4, 2.0, 30);
    centerGlow.position.set(0, 0, 5);
    this.scene.add(centerGlow);
  }

  createStarfield() {
    const starCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    // Google 4-Color Palette + Warm Stone + Slate
    const colorPalette = [
      new THREE.Color(0x1a73e8), // Google Blue
      new THREE.Color(0xea4335), // Google Red
      new THREE.Color(0xfbbc04), // Google Yellow
      new THREE.Color(0x34a853), // Google Green
      new THREE.Color(0x9aa0a6), // Soft Google Gray
      new THREE.Color(0xcc785c)  // Anthropic Warm Clay
    ];

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.NormalBlending
    });

    this.starfield = new THREE.Points(geometry, material);
    this.scene.add(this.starfield);
  }

  /* ---------------- MODE 1: Space Orbit (NASA & Google AI) ---------------- */
  buildSpaceMode() {
    // Inner Pearlescent Core
    const coreGeo = new THREE.IcosahedronGeometry(4.2, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf1f3f4,
      roughness: 0.25,
      metalness: 0.5,
      wireframe: false,
      emissive: 0x1a73e8,
      emissiveIntensity: 0.25
    });
    this.spaceCore = new THREE.Mesh(coreGeo, coreMat);
    this.spaceGroup.add(this.spaceCore);

    // Outer Wire Shell
    const wireGeo = new THREE.IcosahedronGeometry(4.35, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1a73e8,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.spaceWire = new THREE.Mesh(wireGeo, wireMat);
    this.spaceGroup.add(this.spaceWire);

    // Planetary Rings
    const ringGeo1 = new THREE.RingGeometry(6.5, 7.8, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x4285f4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    this.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.ring1.rotation.x = Math.PI / 2.5;
    this.spaceGroup.add(this.ring1);

    const ringGeo2 = new THREE.RingGeometry(8.4, 9.1, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x34a853,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    this.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.ring2.rotation.x = Math.PI / 2.1;
    this.ring2.rotation.y = Math.PI / 6;
    this.spaceGroup.add(this.ring2);

    // Orbiting Satellite Nodes (Google 4-Colors)
    this.satellites = [];
    const satColors = [0x1a73e8, 0xea4335, 0xfbbc04, 0x34a853, 0x4285f4, 0xcc785c];
    for (let i = 0; i < 6; i++) {
      const satGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const satMat = new THREE.MeshBasicMaterial({
        color: satColors[i],
        transparent: true,
        opacity: 0.85
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.userData = {
        radius: 8.8 + (i % 2) * 1.5,
        speed: 0.4 + i * 0.12,
        phase: (i * Math.PI) / 3,
        inclination: (i * Math.PI) / 6
      };
      this.spaceGroup.add(sat);
      this.satellites.push(sat);
    }
  }

  /* ---------------- MODE 2: Neural Matrix (Google Blue AI Synapses) ---------------- */
  buildNeuralMode() {
    const nodeCount = 55;
    this.neuralNodes = [];
    const nodeGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x1a73e8,
      transparent: true,
      opacity: 0.85
    });

    const positions = [];
    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 14;
      mesh.position.set(x, y, z);
      mesh.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2
      };
      this.neuralGroup.add(mesh);
      this.neuralNodes.push(mesh);
      positions.push(new THREE.Vector3(x, y, z));
    }

    // Connect close nodes with crisp lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4285f4,
      transparent: true,
      opacity: 0.28
    });

    this.neuralLines = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < 5.8) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            positions[i],
            positions[j]
          ]);
          const line = new THREE.Line(lineGeo, lineMat);
          this.neuralGroup.add(line);
          this.neuralLines.push({ line, nodeA: this.neuralNodes[i], nodeB: this.neuralNodes[j] });
        }
      }
    }
  }

  /* ---------------- MODE 3: Quantum Torus Knot ---------------- */
  buildTorusMode() {
    const knotGeo = new THREE.TorusKnotGeometry(5, 1.4, 180, 32, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0xf8f9fa,
      emissive: 0x1a73e8,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.7
    });
    this.torusKnot = new THREE.Mesh(knotGeo, knotMat);
    this.torusGroup.add(this.torusKnot);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x4285f4,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    this.torusWire = new THREE.Mesh(knotGeo, wireMat);
    this.torusGroup.add(this.torusWire);
  }

  /* ---------------- MODE 4: Stardust Swarm (Google 4-Color Swarm) ---------------- */
  buildSwarmMode() {
    const swarmCount = 2800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(swarmCount * 3);
    const colors = new Float32Array(swarmCount * 3);

    const googleColorsRGB = [
      [26 / 255, 115 / 255, 232 / 255],   // Blue
      [234 / 255, 67 / 255, 53 / 255],    // Red
      [251 / 255, 188 / 255, 4 / 255],    // Yellow
      [52 / 255, 168 / 255, 83 / 255]     // Green
    ];

    for (let i = 0; i < swarmCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 11;
      const height = (Math.random() - 0.5) * 5;

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      const pick = googleColorsRGB[Math.floor(Math.random() * googleColorsRGB.length)];
      colors[i * 3] = pick[0];
      colors[i * 3 + 1] = pick[1];
      colors[i * 3 + 2] = pick[2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending
    });

    this.swarmPoints = new THREE.Points(geometry, material);
    this.swarmGroup.add(this.swarmPoints);
  }

  setMode(mode, playSound = true) {
    this.currentMode = mode;
    this.spaceGroup.visible = mode === 'space';
    this.neuralGroup.visible = mode === 'neural';
    this.torusGroup.visible = mode === 'torus';
    this.swarmGroup.visible = mode === 'particles';

    if (playSound && window.audioFX) {
      window.audioFX.playWarp();
    }

    // Update active UI chips in 3D dock
    document.querySelectorAll('.scene-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.scene === mode);
    });
  }

  bindEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mouse Movement Tracking
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Scroll Tracking
    window.addEventListener('scroll', () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        this.scrollProgress = window.scrollY / maxScroll;
      }
    });

    // 3D Scene Controls Click
    document.querySelectorAll('.scene-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const selected = btn.dataset.scene;
        if (selected) {
          this.setMode(selected, true);
        }
      });
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Lerp mouse
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Dynamic light movement
    this.cyanLight.position.x = this.mouse.x * 14 + Math.sin(elapsedTime * 0.8) * 3;
    this.cyanLight.position.y = this.mouse.y * 12 + Math.cos(elapsedTime * 0.8) * 3;
    this.purpleLight.position.x = -this.mouse.x * 14 - Math.sin(elapsedTime * 0.8) * 3;
    this.purpleLight.position.y = -this.mouse.y * 12 - Math.cos(elapsedTime * 0.8) * 3;

    // Rotate background starfield very slowly
    if (this.starfield) {
      this.starfield.rotation.y = elapsedTime * 0.015;
      this.starfield.rotation.x = this.mouse.y * 0.08;
    }

    // Scroll parallax & camera damping
    this.camera.position.x = this.mouse.x * 2.2;
    this.camera.position.y = this.mouse.y * 2.2 - this.scrollProgress * 6;
    this.camera.lookAt(0, -this.scrollProgress * 4, 0);

    // MODE 1: Space Orbit animation
    if (this.spaceGroup.visible) {
      this.spaceCore.rotation.y = elapsedTime * 0.22;
      this.spaceCore.rotation.x = elapsedTime * 0.12;
      this.spaceWire.rotation.y = -elapsedTime * 0.18;
      this.spaceWire.rotation.x = elapsedTime * 0.08;

      this.ring1.rotation.z = elapsedTime * 0.14;
      this.ring2.rotation.z = -elapsedTime * 0.1;

      this.satellites.forEach((sat) => {
        const u = sat.userData;
        const angle = elapsedTime * u.speed + u.phase;
        sat.position.x = Math.cos(angle) * u.radius;
        sat.position.z = Math.sin(angle) * u.radius;
        sat.position.y = Math.sin(angle * 1.5) * 2;
      });

      this.spaceGroup.rotation.y = this.mouse.x * 0.3;
      this.spaceGroup.rotation.x = -this.mouse.y * 0.3;
    }

    // MODE 2: Neural Matrix animation
    if (this.neuralGroup.visible) {
      this.neuralNodes.forEach((node) => {
        const u = node.userData;
        node.position.y = u.baseY + Math.sin(elapsedTime * 1.2 + u.phase) * 0.6;
        node.position.x = u.baseX + Math.cos(elapsedTime * 0.8 + u.phase) * 0.4;
      });

      this.neuralLines.forEach((item) => {
        const positions = item.line.geometry.attributes.position.array;
        positions[0] = item.nodeA.position.x;
        positions[1] = item.nodeA.position.y;
        positions[2] = item.nodeA.position.z;
        positions[3] = item.nodeB.position.x;
        positions[4] = item.nodeB.position.y;
        positions[5] = item.nodeB.position.z;
        item.line.geometry.attributes.position.needsUpdate = true;
      });

      this.neuralGroup.rotation.y = elapsedTime * 0.1 + this.mouse.x * 0.35;
      this.neuralGroup.rotation.x = this.mouse.y * 0.35;
    }

    // MODE 3: Quantum Torus animation
    if (this.torusGroup.visible) {
      this.torusKnot.rotation.x = elapsedTime * 0.25;
      this.torusKnot.rotation.y = elapsedTime * 0.35;
      this.torusWire.rotation.x = elapsedTime * 0.25;
      this.torusWire.rotation.y = elapsedTime * 0.35;

      this.torusGroup.rotation.y = this.mouse.x * 0.45;
      this.torusGroup.rotation.x = -this.mouse.y * 0.45;
    }

    // MODE 4: Stardust Swarm animation
    if (this.swarmGroup.visible) {
      this.swarmPoints.rotation.y = elapsedTime * 0.16;
      this.swarmPoints.rotation.x = Math.sin(elapsedTime * 0.1) * 0.2 + this.mouse.y * 0.25;
      this.swarmGroup.rotation.z = this.mouse.x * 0.25;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined') {
    window.universe3D = new Universe3D();
  }
});

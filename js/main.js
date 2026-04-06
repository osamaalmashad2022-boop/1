/* ============================================
   Neutron Academy — JavaScript
   Three.js 3D Hero + Interactions
   ============================================ */

// ── Three.js 3D Hero Scene with Education Models ──
function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const colorPalette = [
    new THREE.Color(0x06b6d4),
    new THREE.Color(0x3b82f6),
    new THREE.Color(0x8b5cf6),
    new THREE.Color(0xec4899),
    new THREE.Color(0x10b981),
  ];

  // ── Particle System ──
  const particleCount = 1200;
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 35;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 35;
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // ── Education 3D Models Collection ──
  const eduModels = [];

  // Helper: create glow material
  function glowMat(color, opacity = 0.9) {
    return new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide,
      shininess: 100,
    });
  }

  // ── 1. 3D BOOK ──
  function createBook() {
    const book = new THREE.Group();
    // Cover
    const coverGeo = new THREE.BoxGeometry(1.2, 1.6, 0.12);
    const coverMat = glowMat(0x3b82f6);
    const cover = new THREE.Mesh(coverGeo, coverMat);
    book.add(cover);
    // Pages
    const pagesGeo = new THREE.BoxGeometry(1.1, 1.5, 0.09);
    const pagesMat = new THREE.MeshPhongMaterial({ color: 0xf1f5f9, emissive: 0xf1f5f9, emissiveIntensity: 0.1 });
    const pages = new THREE.Mesh(pagesGeo, pagesMat);
    pages.position.set(-0.02, 0, 0.01);
    book.add(pages);
    // Spine
    const spineGeo = new THREE.BoxGeometry(0.12, 1.6, 0.14);
    const spine = new THREE.Mesh(spineGeo, glowMat(0x2563eb));
    spine.position.set(0.66, 0, 0);
    book.add(spine);
    // Open page flap (decorative)
    const flapGeo = new THREE.PlaneGeometry(0.5, 1.4);
    const flapMat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    const flap = new THREE.Mesh(flapGeo, flapMat);
    flap.position.set(-0.35, 0, 0.08);
    flap.rotation.y = -0.3;
    book.add(flap);
    book.scale.set(0.7, 0.7, 0.7);
    return book;
  }

  // ── 2. PENCIL ──
  function createPencil() {
    const pencil = new THREE.Group();
    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.08, 0.08, 2, 6);
    const bodyMat = glowMat(0xf59e0b);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    pencil.add(body);
    // Tip cone
    const tipGeo = new THREE.ConeGeometry(0.08, 0.3, 6);
    const tipMat = new THREE.MeshPhongMaterial({ color: 0x92400e, emissive: 0x92400e, emissiveIntensity: 0.15 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.y = -1.15;
    pencil.add(tip);
    // Lead point
    const leadGeo = new THREE.ConeGeometry(0.03, 0.12, 6);
    const leadMat = new THREE.MeshPhongMaterial({ color: 0x1e293b });
    const lead = new THREE.Mesh(leadGeo, leadMat);
    lead.position.y = -1.36;
    pencil.add(lead);
    // Eraser
    const eraserGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.2, 8);
    const eraserMat = glowMat(0xec4899);
    const eraser = new THREE.Mesh(eraserGeo, eraserMat);
    eraser.position.y = 1.1;
    pencil.add(eraser);
    // Metal band
    const bandGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.08, 8);
    const bandMat = new THREE.MeshPhongMaterial({ color: 0xc0c0c0, emissive: 0x888888, emissiveIntensity: 0.2, shininess: 200 });
    const band = new THREE.Mesh(bandGeo, bandMat);
    band.position.y = 0.98;
    pencil.add(band);
    pencil.scale.set(0.7, 0.7, 0.7);
    return pencil;
  }

  // ── 3. GRADUATION CAP ──
  function createGradCap() {
    const cap = new THREE.Group();
    // Board (mortar)
    const boardGeo = new THREE.BoxGeometry(1.4, 0.06, 1.4);
    const boardMat = glowMat(0x1e293b);
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.y = 0.35;
    cap.add(board);
    // Skull cap (dome)
    const domeGeo = new THREE.SphereGeometry(0.55, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = glowMat(0x1e293b);
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0;
    cap.add(dome);
    // Button on top
    const btnGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 8);
    const btnMat = glowMat(0xf59e0b);
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.position.y = 0.42;
    cap.add(btn);
    // Tassel string
    const tassPoints = [];
    tassPoints.push(new THREE.Vector3(0, 0.42, 0));
    tassPoints.push(new THREE.Vector3(0.7, 0.35, 0));
    tassPoints.push(new THREE.Vector3(0.7, -0.1, 0));
    const tassCurve = new THREE.CatmullRomCurve3(tassPoints);
    const tassGeo = new THREE.TubeGeometry(tassCurve, 12, 0.02, 6, false);
    const tassMat = glowMat(0xf59e0b);
    const tassel = new THREE.Mesh(tassGeo, tassMat);
    cap.add(tassel);
    // Tassel end
    const tassEndGeo = new THREE.CylinderGeometry(0.04, 0.01, 0.2, 8);
    const tassEnd = new THREE.Mesh(tassEndGeo, glowMat(0xf59e0b));
    tassEnd.position.set(0.7, -0.2, 0);
    cap.add(tassEnd);
    cap.scale.set(0.65, 0.65, 0.65);
    return cap;
  }

  // ── 4. GLOBE ──
  function createGlobe() {
    const globe = new THREE.Group();
    // Sphere
    const sphereGeo = new THREE.SphereGeometry(0.7, 24, 24);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.6,
      wireframe: false,
      shininess: 80,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    globe.add(sphere);
    // Wireframe overlay
    const wireGeo = new THREE.SphereGeometry(0.71, 16, 12);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.3 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    globe.add(wire);
    // Latitude rings
    for (let i = 1; i <= 3; i++) {
      const ringGeo = new THREE.TorusGeometry(0.7 * Math.cos(i * 0.4), 0.008, 8, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.5 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.7 * Math.sin(i * 0.4);
      ring.rotation.x = Math.PI / 2;
      globe.add(ring);
    }
    // Stand ring
    const standRingGeo = new THREE.TorusGeometry(0.8, 0.025, 8, 32);
    const standRingMat = glowMat(0x94a3b8, 0.7);
    const standRing = new THREE.Mesh(standRingGeo, standRingMat);
    standRing.rotation.x = Math.PI / 2;
    standRing.rotation.z = 0.3;
    globe.add(standRing);
    // Stand base
    const baseGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.08, 16);
    const base = new THREE.Mesh(baseGeo, glowMat(0x94a3b8, 0.7));
    base.position.y = -0.85;
    globe.add(base);
    // Stand pole
    const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
    const pole = new THREE.Mesh(poleGeo, glowMat(0x94a3b8, 0.7));
    pole.position.y = -0.6;
    globe.add(pole);
    globe.scale.set(0.65, 0.65, 0.65);
    return globe;
  }

  // ── 5. FLOATING LETTER ──
  function createLetter(char) {
    const letter = new THREE.Group();
    // Create text using a simple torus/shape-based approach
    const loader = document.fonts ? null : null;
    // Use a bold 3D shape for the letter
    const shape = new THREE.Shape();
    const fontSize = 0.8;

    // Create letter shapes procedurally
    if (char === 'A') {
      shape.moveTo(-0.4, -0.5);
      shape.lineTo(-0.1, 0.5);
      shape.lineTo(0.1, 0.5);
      shape.lineTo(0.4, -0.5);
      shape.lineTo(0.25, -0.5);
      shape.lineTo(0.15, -0.15);
      shape.lineTo(-0.15, -0.15);
      shape.lineTo(-0.25, -0.5);
      shape.closePath();
      // Crossbar hole
      const hole = new THREE.Path();
      hole.moveTo(-0.08, -0.05);
      hole.lineTo(0, 0.25);
      hole.lineTo(0.08, -0.05);
      hole.closePath();
      shape.holes.push(hole);
    } else if (char === 'B') {
      shape.moveTo(-0.3, -0.5);
      shape.lineTo(-0.3, 0.5);
      shape.lineTo(0.1, 0.5);
      shape.quadraticCurveTo(0.4, 0.5, 0.4, 0.25);
      shape.quadraticCurveTo(0.4, 0.05, 0.15, 0.0);
      shape.quadraticCurveTo(0.45, -0.05, 0.45, -0.25);
      shape.quadraticCurveTo(0.45, -0.5, 0.1, -0.5);
      shape.closePath();
      const hole1 = new THREE.Path();
      hole1.moveTo(-0.15, 0.1);
      hole1.lineTo(-0.15, 0.35);
      hole1.lineTo(0.05, 0.35);
      hole1.quadraticCurveTo(0.2, 0.35, 0.2, 0.225);
      hole1.quadraticCurveTo(0.2, 0.1, 0.05, 0.1);
      hole1.closePath();
      shape.holes.push(hole1);
      const hole2 = new THREE.Path();
      hole2.moveTo(-0.15, -0.35);
      hole2.lineTo(-0.15, -0.05);
      hole2.lineTo(0.08, -0.05);
      hole2.quadraticCurveTo(0.25, -0.05, 0.25, -0.2);
      hole2.quadraticCurveTo(0.25, -0.35, 0.08, -0.35);
      hole2.closePath();
      shape.holes.push(hole2);
    } else if (char === 'C') {
      shape.moveTo(0.35, -0.35);
      shape.lineTo(0.2, -0.5);
      shape.lineTo(-0.1, -0.5);
      shape.quadraticCurveTo(-0.4, -0.5, -0.4, -0.2);
      shape.lineTo(-0.4, 0.2);
      shape.quadraticCurveTo(-0.4, 0.5, -0.1, 0.5);
      shape.lineTo(0.2, 0.5);
      shape.lineTo(0.35, 0.35);
      shape.lineTo(0.35, 0.25);
      shape.lineTo(0.1, 0.35);
      shape.lineTo(-0.1, 0.35);
      shape.quadraticCurveTo(-0.22, 0.35, -0.22, 0.2);
      shape.lineTo(-0.22, -0.2);
      shape.quadraticCurveTo(-0.22, -0.35, -0.1, -0.35);
      shape.lineTo(0.1, -0.35);
      shape.lineTo(0.35, -0.25);
      shape.closePath();
    }

    const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 3 };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const colorMap = { 'A': 0x06b6d4, 'B': 0x8b5cf6, 'C': 0x10b981 };
    const mat = new THREE.MeshPhongMaterial({
      color: colorMap[char] || 0x06b6d4,
      emissive: colorMap[char] || 0x06b6d4,
      emissiveIntensity: 0.35,
      shininess: 120,
      transparent: true,
      opacity: 0.85,
    });
    const mesh = new THREE.Mesh(geo, mat);
    // Add glow outline
    const outlineMat = new THREE.MeshBasicMaterial({
      color: colorMap[char] || 0x06b6d4,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const outline = new THREE.Mesh(geo, outlineMat);
    outline.scale.set(1.1, 1.1, 1.1);
    letter.add(outline);
    letter.add(mesh);
    letter.scale.set(0.8, 0.8, 0.8);
    return letter;
  }

  // ── 6. ATOM MODEL ──
  function createAtom() {
    const atom = new THREE.Group();
    // Nucleus
    const nucleusGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const nucleusMat = glowMat(0xec4899);
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    atom.add(nucleus);
    // Electron orbits
    const orbitColors = [0x06b6d4, 0x8b5cf6, 0x10b981];
    for (let i = 0; i < 3; i++) {
      const orbitGeo = new THREE.TorusGeometry(0.55 + i * 0.12, 0.012, 8, 48);
      const orbitMat = new THREE.MeshBasicMaterial({ color: orbitColors[i], transparent: true, opacity: 0.5 });
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.rotation.x = Math.PI / 2 + (i * Math.PI) / 3;
      orbit.rotation.z = (i * Math.PI) / 4;
      atom.add(orbit);
      // Electron
      const electronGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const electron = new THREE.Mesh(electronGeo, glowMat(orbitColors[i]));
      electron.userData.orbitRadius = 0.55 + i * 0.12;
      electron.userData.orbitSpeed = 1.5 + i * 0.8;
      electron.userData.orbitIndex = i;
      electron.userData.isElectron = true;
      atom.add(electron);
    }
    atom.scale.set(0.8, 0.8, 0.8);
    return atom;
  }

  // ── 7. LIGHTBULB (idea) ──
  function createLightbulb() {
    const bulb = new THREE.Group();
    // Glass bulb
    const glassGeo = new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const glassMat = new THREE.MeshPhongMaterial({
      color: 0xfde68a,
      emissive: 0xfde68a,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.5,
      shininess: 100,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.rotation.x = Math.PI;
    bulb.add(glass);
    // Base
    const baseGeo = new THREE.CylinderGeometry(0.2, 0.12, 0.25, 10);
    const baseMat = glowMat(0x94a3b8, 0.8);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.35;
    bulb.add(base);
    // Filament
    const filPoints = [];
    for (let i = 0; i < 8; i++) {
      filPoints.push(new THREE.Vector3(
        Math.sin(i * 1.2) * 0.08,
        -0.15 + i * 0.05,
        Math.cos(i * 1.2) * 0.08
      ));
    }
    const filCurve = new THREE.CatmullRomCurve3(filPoints);
    const filGeo = new THREE.TubeGeometry(filCurve, 16, 0.015, 4, false);
    const filMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.8 });
    const filament = new THREE.Mesh(filGeo, filMat);
    bulb.add(filament);
    // Glow sphere
    const glowGeo = new THREE.SphereGeometry(0.5, 12, 12);
    const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0.08 });
    const glow = new THREE.Mesh(glowGeo, glowMaterial);
    bulb.add(glow);
    bulb.scale.set(0.7, 0.7, 0.7);
    return bulb;
  }

  // ── Place models in the scene ──
  const modelConfigs = [
    // Far left edge
    { create: createBook, pos: [-13, 2, -3], rot: [0.3, 0.5, 0.1] },
    { create: createGradCap, pos: [-12, -3.5, -4], rot: [0.2, 0.3, 0] },
    { create: createAtom, pos: [-14, 0.5, -5], rot: [0.3, 0.1, 0.2] },
    { create: createPencil, pos: [-11, 5, -6], rot: [0, 0, -0.5] },
    { create: () => createLetter('A'), pos: [-10, -1, -5], rot: [0.1, 0.2, 0] },
    { create: createLightbulb, pos: [-12, -6, -5], rot: [0, 0, 0.2] },
    // Far right edge
    { create: createPencil, pos: [13, -2, -3], rot: [0, 0, 0.7] },
    { create: createGlobe, pos: [12, 3.5, -4], rot: [0, 0, 0.2] },
    { create: () => createLetter('B'), pos: [10, 1, -5], rot: [-0.1, 0.3, 0.1] },
    { create: () => createLetter('C'), pos: [14, -0.5, -5], rot: [0, -0.2, 0.1] },
    { create: createBook, pos: [11, -5, -6], rot: [-0.3, 1.2, 0] },
    { create: createGradCap, pos: [12, 6, -6], rot: [0.1, -0.5, 0.1] },
  ];

  modelConfigs.forEach((config, i) => {
    const model = config.create();
    model.position.set(...config.pos);
    model.rotation.set(...config.rot);
    model.userData = {
      rotSpeed: { x: (Math.random() - 0.5) * 0.008, y: (Math.random() - 0.5) * 0.012 },
      floatSpeed: Math.random() * 0.6 + 0.3,
      floatAmp: Math.random() * 0.5 + 0.3,
      floatOffset: Math.random() * Math.PI * 2,
      origY: config.pos[1],
      origX: config.pos[0],
      swayAmp: Math.random() * 0.2 + 0.1,
      swaySpeed: Math.random() * 0.3 + 0.15,
    };
    eduModels.push(model);
    scene.add(model);
  });

  // ── Also keep some abstract wireframe shapes for depth ──
  const abstractShapes = [];
  for (let i = 0; i < 6; i++) {
    const geos = [
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.OctahedronGeometry(0.4, 0),
      new THREE.DodecahedronGeometry(0.35, 0),
    ];
    const geo = geos[Math.floor(Math.random() * geos.length)];
    const mat = new THREE.MeshPhongMaterial({
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      transparent: true,
      opacity: 0.12,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 24,
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 12 - 8
    );
    mesh.userData = {
      rotSpeed: { x: (Math.random() - 0.5) * 0.015, y: (Math.random() - 0.5) * 0.015 },
    };
    abstractShapes.push(mesh);
    scene.add(mesh);
  }

  // ── Lighting (enhanced) ──
  const ambientLight = new THREE.AmbientLight(0x6080a0, 0.6);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 0.4);
  mainLight.position.set(5, 8, 5);
  scene.add(mainLight);

  const pointLight1 = new THREE.PointLight(0x06b6d4, 2, 60);
  pointLight1.position.set(8, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x8b5cf6, 1.5, 60);
  pointLight2.position.set(-8, -5, 5);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0xec4899, 1, 50);
  pointLight3.position.set(0, 8, -5);
  scene.add(pointLight3);

  const pointLight4 = new THREE.PointLight(0x10b981, 1, 50);
  pointLight4.position.set(0, -6, 3);
  scene.add(pointLight4);

  camera.position.z = 10;

  // ── Mouse Interaction ──
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Animation Loop ──
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Particles slow rotation
    particlesMesh.rotation.y = time * 0.03;
    particlesMesh.rotation.x = time * 0.015;

    // Animate education models with smooth floating
    eduModels.forEach((model) => {
      const ud = model.userData;
      // Gentle rotation
      model.rotation.x += ud.rotSpeed.x;
      model.rotation.y += ud.rotSpeed.y;
      // Smooth floating up and down
      model.position.y = ud.origY + Math.sin(time * ud.floatSpeed + ud.floatOffset) * ud.floatAmp;
      // Gentle horizontal sway
      model.position.x = ud.origX + Math.sin(time * ud.swaySpeed + ud.floatOffset * 2) * ud.swayAmp;

      // Animate electrons in atom models
      model.children && model.children.forEach(child => {
        if (child.userData && child.userData.isElectron) {
          const idx = child.userData.orbitIndex;
          const r = child.userData.orbitRadius;
          const speed = child.userData.orbitSpeed;
          const angle = time * speed + idx * (Math.PI * 2 / 3);
          // Calculate position on tilted orbit
          const rotX = Math.PI / 2 + (idx * Math.PI) / 3;
          const rotZ = (idx * Math.PI) / 4;
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle) * Math.cos(rotX);
          const z = r * Math.sin(angle) * Math.sin(rotX);
          child.position.set(
            x * Math.cos(rotZ) - y * Math.sin(rotZ),
            x * Math.sin(rotZ) + y * Math.cos(rotZ),
            z
          );
        }
      });
    });

    // Abstract shapes rotation
    abstractShapes.forEach(shape => {
      shape.rotation.x += shape.userData.rotSpeed.x;
      shape.rotation.y += shape.userData.rotSpeed.y;
    });

    // Animate lights for dynamic feel
    pointLight1.position.x = 8 + Math.sin(time * 0.5) * 3;
    pointLight2.position.y = -5 + Math.cos(time * 0.4) * 3;

    // Camera follows mouse
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, -2);

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ── 3D Tilt Effect for Cards ──
function initCardTilt() {
  const cards = document.querySelectorAll('.course-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ── Navbar Scroll ──
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      toggle.classList.toggle('active');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
      });
    });
  }
}

// ── Scroll Reveal ──
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ── Counter Animation ──
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        const suffix = entry.target.dataset.suffix || '';
        animateCounter(entry.target, 0, target, 2000, suffix);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, start, end, duration, suffix) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * eased);
    el.textContent = current + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// ── Smooth Scroll ──
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Particle Mouse Trail (subtle) ──
function initMouseTrail() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.85) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(6, 182, 212, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 5;
        left: ${e.clientX - hero.getBoundingClientRect().left}px;
        top: ${e.clientY - hero.getBoundingClientRect().top}px;
        transition: all 1s ease;
      `;
      hero.appendChild(particle);
      requestAnimationFrame(() => {
        particle.style.transform = `translateY(-30px) scale(0)`;
        particle.style.opacity = '0';
      });
      setTimeout(() => particle.remove(), 1000);
    }
  });
}

// ── Lightbox Modal Logic ──
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  if (!modal || !modalImg) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      // Find the image source. If trigger is an img, use its src. Else, find img inside.
      let imgSrc;
      if (trigger.tagName.toLowerCase() === 'img') {
        imgSrc = trigger.src;
      } else {
        const img = trigger.querySelector('img');
        if (img) imgSrc = img.src;
      }
      
      if (imgSrc) {
        modalImg.src = imgSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

// ── Initialize Everything ──
document.addEventListener('DOMContentLoaded', () => {
  initHeroScene();
  initCardTilt();
  initNavbar();
  initScrollReveal();
  initCounters();
  initSmoothScroll();
  initMouseTrail();
  initLightbox();
});

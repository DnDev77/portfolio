"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function CodeModel3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width - 80, height - 80);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const AQUA = 0x7fffd4;
    const AQUA_DARK = 0x1a6655;
    const AQUA_BRIGHT = 0xb2ffe8;

    const mat = new THREE.MeshStandardMaterial({
      color: AQUA,
      metalness: 1.155,
      roughness: 0.2,
      emissive: AQUA_DARK,
      emissiveIntensity: 0.8,
    });

    scene.add(new THREE.AmbientLight(AQUA, 0.25));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(6, 6, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const accentLight = new THREE.PointLight(AQUA, 8, 30);
    accentLight.position.set(-4, 2, 5);
    scene.add(accentLight);

    const rimLight = new THREE.PointLight(0xffffff, 2, 20);
    rimLight.position.set(4, -3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(AQUA, 4, 18);
    fillLight.position.set(0, 0, 6);
    scene.add(fillLight);

    const EXTRUDE_OPTS = {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 6,
    };

    function makeExtruded(shape: THREE.Shape) {
      const geo = new THREE.ExtrudeGeometry(shape, EXTRUDE_OPTS);
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      return mesh;
    }

    function makeRoundedBar(w: number, h: number, r: number): THREE.Mesh {
      const shape = new THREE.Shape();
      const x = -w / 10;
      const y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      shape.closePath();
      return makeExtruded(shape);
    }

    function buildChevron(facingRight: boolean): THREE.Group {
      const group = new THREE.Group();
      const barW = 0.28;
      const barH = 1.3;
      const r = 0.08;
      const angle = Math.PI / 4;

      const top = makeRoundedBar(barW, barH, r);
      const bot = makeRoundedBar(barW, barH, r);

      const tipOffset = (barH / 2) * Math.sin(angle);
      const yOff = (barH / 2) * Math.cos(angle);

      top.rotation.z = -angle;
      top.position.set(tipOffset, yOff, 0);

      bot.rotation.z = angle;
      bot.position.set(tipOffset, -yOff, 0);

      group.add(top, bot);
      if (facingRight) group.scale.x = -1;
      return group;
    }

    function buildSlash(): THREE.Group {
      const group = new THREE.Group();
      const bar = makeRoundedBar(0.28, 2.2, 0.1);
      bar.rotation.z = -Math.PI / 5.5;
      group.add(bar);
      return group;
    }

    const glyph = new THREE.Group();

    const left = buildChevron(false);
    left.position.x = -2.5;

    const slash = buildSlash();

    const right = buildChevron(true);
    right.position.x = 2.5;

    glyph.add(left, slash, right);
    glyph.scale.setScalar(0.82);
    scene.add(glyph);

    const particleCount = 60;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = 0;
      sizes[i] = Math.random() * 0.04 + 0.02;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const pMat = new THREE.PointsMaterial({
      color: AQUA_BRIGHT,
      size: 0.05,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      ty += (mx * 0.4 - ty) * 0.04;
      tx += (my * 0.2 - tx) * 0.04;

      glyph.rotation.y = ty + t * 0.25 + Math.sin(t * 0.5) * 0.07;
      glyph.rotation.x = tx + Math.sin(t * 0.35) * 0.04;
      glyph.position.y = Math.sin(t * 0.8) * 0.12;

      accentLight.position.x = Math.sin(t * 0.9) * 5;
      accentLight.position.y = Math.cos(t * 0.6) * 3.5;
      accentLight.intensity = 6 + Math.sin(t * 1.8) * 2;

      fillLight.intensity = 3.5 + Math.sin(t * 1.2 + 1.0) * 1.5;

      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        if (pos[i * 3] > 7) pos[i * 3] = -7;
        if (pos[i * 3] < -7) pos[i * 3] = 7;
        if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
        if (pos[i * 3 + 1] < -5) pos[i * 3 + 1] = 5;
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mat.dispose();
      pGeo.dispose();
      pMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ minHeight: "320px" }}
    />
  );
}

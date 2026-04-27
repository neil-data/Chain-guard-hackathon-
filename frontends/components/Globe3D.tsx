"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const PORT_COORDS: Record<string, { lat: number; lon: number }> = {
  "ROTTERDAM": { lat: 51.9244, lon: 4.4777 },
  "HAMBURG": { lat: 53.5753, lon: 9.9300 },
  "ANTWERP": { lat: 51.2652, lon: 4.4069 },
  "PIRAEUS": { lat: 37.9475, lon: 23.6478 },
  "ALGECIRAS": { lat: 36.1408, lon: -5.4531 },
  "LOS_ANGELES": { lat: 33.7395, lon: -118.2618 },
  "NEW_YORK": { lat: 40.6892, lon: -74.0445 },
  "SAVANNAH": { lat: 32.0835, lon: -81.0998 },
  "DUBAI_JEBEL_ALI": { lat: 24.9857, lon: 55.0272 },
  "JEDDAH": { lat: 21.5433, lon: 39.1728 },
  "MOMBASA": { lat: -4.0435, lon: 39.6682 },
  "DURBAN": { lat: -29.8587, lon: 31.0218 },
  "MUMBAI": { lat: 18.9322, lon: 72.8375 },
  "KARACHI": { lat: 24.8607, lon: 67.0099 },
  "COLOMBO": { lat: 6.9271, lon: 79.8612 },
  "SINGAPORE": { lat: 1.2897, lon: 103.8501 },
  "HONG_KONG": { lat: 22.3193, lon: 114.1694 },
  "SHANGHAI": { lat: 31.2304, lon: 121.4737 },
  "BUSAN": { lat: 35.1796, lon: 129.0756 },
  "SANTOS": { lat: -23.9618, lon: -46.3322 },
};

interface GlobeProps {
  height?: number;
  showThreats?: boolean;
  showRoutes?: boolean;
  autoRotate?: boolean;
  interactive?: boolean;
  customRoutes?: string[][];
}

export default function Globe3D({
  height = 400,
  showThreats = false,
  showRoutes = false,
  autoRotate = true,
  interactive = false,
  customRoutes,
}: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const w = container.clientWidth || 400;
    const h = height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0.2, 2.8);

    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const geo = new THREE.SphereGeometry(1, 72, 72);
    const loader = new THREE.TextureLoader();
    const nightTex = loader.load("https://unpkg.com/three-globe/example/img/earth-night.jpg");
    const bumpTex = loader.load("https://unpkg.com/three-globe/example/img/earth-topology.png");

    const mat = new THREE.MeshPhongMaterial({
      map: nightTex,
      bumpMap: bumpTex,
      bumpScale: 0.008,
      specular: new THREE.Color(0x1a4a2e),
      shininess: 8,
    });
    const earth = new THREE.Mesh(geo, mat);
    scene.add(earth);

    const atmGeo = new THREE.SphereGeometry(1.06, 72, 72);
    const atmMat = new THREE.MeshPhongMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(atmGeo, atmMat));

    const sun = new THREE.DirectionalLight(0xfff5e0, 1.4);
    sun.position.set(5, 3, 4);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    function latLonToVec3(lat: number, lon: number, r = 1.02) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }

    function createArc(lat1: number, lon1: number, lat2: number, lon2: number, color: number, width: number) {
      const start = latLonToVec3(lat1, lon1);
      const end = latLonToVec3(lat2, lon2);
      // ✅ FIX: lowered arc from 1.3 → 1.15 so routes don't overshoot the container
      const mid = start.clone().add(end).normalize().multiplyScalar(1.15);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(80);
      const curveGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 80, width, 6, false);
      const curveMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
      return new THREE.Mesh(curveGeo, curveMat);
    }

    function addDot(lat: number, lon: number, color: number) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.015, 12, 12),
        new THREE.MeshBasicMaterial({ color })
      );
      dot.position.copy(latLonToVec3(lat, lon, 1.025));
      return dot;
    }

    const routeGroup = new THREE.Group();
    if (showRoutes) {
      const routesToRender = customRoutes || [["MUMBAI", "ROTTERDAM"], ["SINGAPORE", "ROTTERDAM"]];

      routesToRender.forEach((path, idx) => {
        const color = idx === 0 ? 0x22c55e : idx === 1 ? 0xf59e0b : 0x3b82f6;
        const width = idx === 0 ? 0.005 : 0.002;

        for (let i = 0; i < path.length - 1; i++) {
          const p1 = PORT_COORDS[path[i]];
          const p2 = PORT_COORDS[path[i + 1]];
          if (p1 && p2) {
            routeGroup.add(createArc(p1.lat, p1.lon, p2.lat, p2.lon, color, width));
            if (i === 0) routeGroup.add(addDot(p1.lat, p1.lon, color));
            if (i === path.length - 2) routeGroup.add(addDot(p2.lat, p2.lon, color));
          }
        }
      });
      scene.add(routeGroup);
    }

    const threatGroup = new THREE.Group();
    if (showThreats) {
      const hotspots = [
        { lat: 12.5, lon: 43.5 },
        { lat: 26.5, lon: 56.4 },
        { lat: 1.0, lon: 103.0 },
      ];
      hotspots.forEach((h) => {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.03, 0.04, 32),
          new THREE.MeshBasicMaterial({
            color: 0xef4444,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
          })
        );
        ring.position.copy(latLonToVec3(h.lat, h.lon, 1.025));
        ring.lookAt(new THREE.Vector3(0, 0, 0));
        threatGroup.add(ring);
      });
      scene.add(threatGroup);
    }

    let targetRotY = 0;
    let isDragging = false;
    let prevX = 0;
    const onMouseDown = (e: MouseEvent) => {
      if (interactive) { isDragging = true; prevX = e.clientX; }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) { targetRotY += (e.clientX - prevX) * 0.005; prevX = e.clientX; }
    };
    const onMouseUp = () => { isDragging = false; };

    if (interactive) {
      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    const onResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / h;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, h);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && !isDragging) targetRotY += 0.0015;
      earth.rotation.y += (targetRotY - earth.rotation.y) * 0.05;
      routeGroup.rotation.y = earth.rotation.y;
      threatGroup.rotation.y = earth.rotation.y;

      threatGroup.children.forEach((c) => {
        const t = Date.now() * 0.002;
        const s = 1 + 0.2 * Math.sin(t);
        c.scale.set(s, s, 1);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (interactive) {
        container.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      }
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [height, showThreats, showRoutes, autoRotate, interactive, customRoutes]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height, cursor: interactive ? "grab" : "default" }}
      className="relative"
    />
  );
}
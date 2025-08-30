import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { latLongToVector3 } from "../utils/utils";
import { exchanges } from "../data/exchanges";

import ExchangeDot from './ExchangeDot';
import { Exchange } from '../types/Exchange';

{exchanges.map((exchange, idx) => (
  <ExchangeDot key={idx} exchange={exchange} />
))}


const GlobeScene = () => {
  const mountRef = useRef(null);

useEffect(() => {
  const mountNode = mountRef.current; // ✅ зберігаємо ref

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  mountNode.appendChild(renderer.domElement); // ✅ використовуємо збережений ref

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const texture = new THREE.TextureLoader().load("/earth_texture.jpg");
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  const controls = new OrbitControls(camera, renderer.domElement);

  const radius = 1.01;
  exchanges.forEach((exchange) => {
    const pos = latLongToVector3(exchange.lat, exchange.lon, radius);
    const dotGeometry = new THREE.SphereGeometry(0.01, 8, 8);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    dot.position.copy(pos);
    scene.add(dot);
  });

  const animate = () => {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.001;
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    mountNode.removeChild(renderer.domElement); // ✅ використовуємо ту саму змінну
  };
}, []);

  return <div ref={mountRef} />;
};

export default GlobeScene;

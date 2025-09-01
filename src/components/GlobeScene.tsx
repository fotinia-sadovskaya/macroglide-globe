import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { latLongToVector3 } from "../utils/utils";
import { exchanges } from "../data/exchanges";
import "./GlobeScene.css";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const GlobeScene = () => {
   // 🔧 Ref для DOM-елемента, в який буде вставлено WebGL canvas
  const mountRef = useRef<HTMLDivElement>(null);

// 🧠 Ref для збереження стану кліку на точку (зберігається між рендерами)
  const clickedOnDotRef = useRef(false); // 🔒 Зберігає стан кліку на точку

  useEffect(() => {
    let clickedOnDot = false; // 🟣 Відстежуємо, чи клік був по точці
    let rotationPaused = false; // 🔄 Контроль обертання

    const pauseRotation = () => (rotationPaused = true);
    const resumeRotation = () => (rotationPaused = false);

    const mountNode = mountRef.current;
    if (!mountNode) return;

    // 🎬 Ініціалізація сцени
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
    mountNode.appendChild(renderer.domElement);

    // 🌍 Створення глобуса
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const texture = new THREE.TextureLoader().load("/earth_texture.jpeg");
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // 💡 Освітлення
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // 🎮 Контролер обертання
    const controls = new OrbitControls(camera, renderer.domElement);

    // 📍 Додавання точок бірж
    const radius = 1.01;
    exchanges.forEach((exchange) => {
      const pos = latLongToVector3(exchange.lat, exchange.lon, radius);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.01, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xff00ff })
      );
      dot.position.copy(pos);
      dot.name = exchange.name;
      dot.userData = {
        info: exchange.description,
        logo: exchange.logoUrl,
        chart: exchange.chartUrl,
      };
      globe.add(dot);
    });

    // 📦 Завантаження моделі
    const loader = new GLTFLoader();
    loader.load("/models/earth.glb", (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.set(0, 0, 0);
      scene.add(model);
    });

    // 🧠 Ініціалізація інструментів
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const tooltip = document.getElementById("tooltip");
    const infoBox = document.getElementById("infoBox");
    if (!tooltip || !infoBox) return;

    // 🖱 Наведення миші — показує tooltip
    window.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(globe.children);

      if (intersects.length > 0) {
        const dot = intersects[0].object;
        tooltip.style.display = "block";
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
        tooltip.style.opacity = "1";
        tooltip.innerHTML = `
          ${
            dot.userData.logo
              ? `<img src="${dot.userData.logo}" width="20" style="vertical-align:middle;margin-right:6px;" />`
              : ""
          }
          <span>${dot.name}</span>
        `;
        pauseRotation();
      } else {
        tooltip.style.opacity = "0";
        tooltip.style.display = "none";
        resumeRotation();
      }
    });

    // 🖱 Клік — показує або ховає infoBox
    window.addEventListener("click", (event) => {
      clickedOnDot = false;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(globe.children);

      if (intersects.length > 0) {
        const dot = intersects[0].object;
        clickedOnDot = true;

        infoBox.style.display = "block";
        infoBox.style.left = `${event.clientX}px`;
        infoBox.style.top = `${event.clientY}px`;
        infoBox.style.opacity = "1";
        infoBox.style.transform = "scale(1)";
        infoBox.style.transition = "opacity 0.5s ease, transform 0.3s ease";

        infoBox.innerHTML = `
          <strong>${dot.name}</strong><br/>
          ${dot.userData.info || "Немає опису"}<br/>
          ${
            dot.userData.logo
              ? `<img src="${dot.userData.logo}" width="80" style="margin-top:6px;" />`
              : ""
          }
          ${
            dot.userData.chart
              ? `<img src="${dot.userData.chart}" width="120" style="margin-top:6px;" />`
              : ""
          }
          <br/>
          <button id="closeInfoBox" style="margin-top:10px;">Закрити</button>
        `;

        // ⏱ Таймер закриття після натискання кнопки
        const closeBtn = document.getElementById("closeInfoBox");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            infoBox.style.opacity = "0";
            infoBox.style.transform = "scale(0.95)";
            setTimeout(() => {
              infoBox.style.display = "none";
              infoBox.innerHTML = "";
            }, 500); // ⏳ Плавне закриття
          });
        }
      }

      // ❌ Клік поза точкою і поза вікном — закриваємо
      if (!clickedOnDot && !infoBox.contains(event.target as Node)) {
        infoBox.style.opacity = "0";
        infoBox.style.transform = "scale(0.95)";
        setTimeout(() => {
          infoBox.style.display = "none";
          infoBox.innerHTML = "";
        }, 500);
      }
    });

    // 🔁 Анімація сцени
    const animate = () => {
      requestAnimationFrame(animate);
      if (!rotationPaused) globe.rotation.y += 0.001;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 🧹 При демонтажі компонента
    return () => {
      mountNode.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={mountRef} className="fullscreen" />
      <div id="tooltip"></div>
      <div id="infoBox"></div>
    </>
  );
};

export default GlobeScene;

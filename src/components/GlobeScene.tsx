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
    // 🧠 Ref для збереження стану кліку на точку
    //clickedOnDotRef = { current: false };

    // 🔄 Контроль обертання глобуса
    let rotationPaused = false;
    const pauseRotation = () => (rotationPaused = true);
    const resumeRotation = () => (rotationPaused = false);

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
    const mountNode = mountRef.current;
    if (!mountNode) return;
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

    // 📦 Завантаження моделі
    const loader = new GLTFLoader();
    loader.load("/models/earth.glb", (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.set(0, 0, 0);
      scene.add(model);
    });

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
      dot.userData = { ...exchange };

      globe.add(dot);
    });

    // 🧭 Raycaster для визначення об'єкта під курсором
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 📦 DOM-елементи
    const tooltip = document.getElementById("tooltip");
    const infoBox = document.getElementById("infoBox");
    if (!tooltip || !infoBox) return;

    // 🖱 Наведення миші — показує tooltip
    const handleMouseMove = (event: MouseEvent) => {
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
        <span>${dot.userData.name ?? "—"}</span>
      `;
        pauseRotation();
      } else {
        tooltip.style.opacity = "0";
        tooltip.style.display = "none";
        resumeRotation();
      }
    };

    // 🖱 Клік — показує або ховає infoBox
    const handleClick = (event: MouseEvent) => {
      clickedOnDotRef.current = false;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(globe.children);

      if (intersects.length > 0) {
        const dot = intersects[0].object;
        clickedOnDotRef.current = true;

        console.log("Clicked dot data:", dot.userData);

        // ❌ Показуємо infoBox
        infoBox.style.display = "block";
        infoBox.style.left = `${event.clientX}px`;
        infoBox.style.top = `${event.clientY}px`;
        infoBox.style.opacity = "1";
        infoBox.style.transform = "scale(1)";
        infoBox.style.transition = "opacity 0.5s ease, transform 0.3s ease";

        infoBox.innerHTML = `
  <div style="position:relative; padding:12px; max-width:280px;">
    <div id="infoBoxClose" style="position:absolute; top:8px; right:8px; cursor:pointer;">✖</div>
    <div style="display:flex; align-items:center; gap:10px;">
      ${
        dot.userData.logo
          ? `<img src="${dot.userData.logo}" width="40" height="40" style="object-fit:contain;" />`
          : `<div style="width:40px; height:40px; background:#ccc; border-radius:4px;"></div>`
      }
      <div>
        <strong style="font-size:16px;">${
          dot.userData.name || "—"
        }</strong><br/>
        <span style="font-size:13px; color:#666;">${
          dot.userData.country || "Країна невідома"
        }</span>
      </div>
    </div>
    <p style="margin-top:10px; font-size:14px;">
      ${dot.userData.description || "<em>Опис недоступний</em>"}
    </p>
    <div style="margin-top:10px; font-size:13px;">
      <strong>Ціна:</strong><br/>
      🔹 <strong>Last:</strong> ${dot.userData.last ?? "—"}<br/>
      🟢 <strong>Buy:</strong> ${dot.userData.buy ?? "—"}<br/>
      🔴 <strong>Sell:</strong> ${dot.userData.sell ?? "—"}
    </div>
    ${
      dot.userData.chart
        ? `<img src="${dot.userData.chart}" width="100%" style="margin-top:10px; border-radius:4px;" />`
        : ""
    }
  </div>
`;

        // ❌ Обробник закриття вікна
        const closeIcon = document.getElementById("infoBoxClose");
        if (closeIcon) {
          closeIcon.addEventListener("click", () => {
            infoBox.style.opacity = "0";
            infoBox.style.transform = "scale(0.95)";
            setTimeout(() => {
              infoBox.style.display = "none";
              infoBox.innerHTML = "";
            }, 500);
          });
        }
      }

      // ❌ Клік поза точкою і поза вікном — закриваємо
      if (!clickedOnDotRef.current && !infoBox.contains(event.target as Node)) {
        infoBox.style.opacity = "0";
        infoBox.style.transform = "scale(0.95)";
        setTimeout(() => {
          infoBox.style.display = "none";
          infoBox.innerHTML = "";
        }, 500);
      }
    };

    // 🔁 Анімація сцени
    const animate = () => {
      requestAnimationFrame(animate);
      if (!rotationPaused) globe.rotation.y += 0.001;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 📌 Додаємо обробники
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // 🧹 Очищення при демонтажі
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
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

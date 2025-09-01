import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { latLongToVector3 } from "../utils/utils";
import { exchanges } from "../data/exchanges";
import "./GlobeScene.css";

import ExchangeDot from "./ExchangeDot";
import { Exchange } from "../data/Types/Exchange";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

{
  exchanges.map((exchange, idx) => (
    <ExchangeDot key={idx} exchange={exchange} />
  ));
}

const GlobeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let clickedOnDot = false;

    // 🔧 Контроль обертання
    let rotationPaused = false;

    function pauseRotation() {
      rotationPaused = true;
    }

    function resumeRotation() {
      rotationPaused = false;
    }

    const mountNode = mountRef.current; // ✅ зберігаємо ref
    if (!mountNode) return; // ⬅️ Додай це одразу після присвоєння

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
    const texture = new THREE.TextureLoader().load("/earth_texture.jpeg");
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

      dot.name = exchange.name;
      dot.userData = {
        info: exchange.description,
        logo: exchange.logoUrl, // 👈 додай URL логотипу
        chart: exchange.chartUrl, // 👈 або графік
      };

      globe.add(dot);
    });

    // ⬇️ Завантаження моделі всередині useEffect
    const loader = new GLTFLoader();
    loader.load(
      "/models/earth.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        scene.add(model); // ✅ тепер scene доступна
      },
      undefined,
      (error) => {
        console.error("Помилка завантаження моделі:", error);
      }
    );

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const tooltip = document.getElementById("tooltip");
    const infoBox = document.getElementById("infoBox");
    if (!tooltip || !infoBox) return; // ⬅️ перевірка на null

    /*
    window.addEventListener("click", (event) => {
      clickedOnDot = false; // скидаємо перед кожним кліком

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

        const name = dot.name || "Невідомо";
        const description = dot.userData?.info || "Немає опису";
        const logo = dot.userData?.logo
          ? `<img src="${dot.userData.logo}" width="80" style="margin-top:6px;" />`
          : "";
        const chart = dot.userData?.chart
          ? `<img src="${dot.userData.chart}" width="120" style="margin-top:6px;" />`
          : "";

        infoBox.innerHTML = `
        <strong>${name}</strong><br/>
        ${description}<br/>
        ${logo}
        ${chart}
        <br/>
        <button onclick="document.getElementById('infoBox').style.display='none'" style="margin-top:10px;">Закрити</button>
      `;
      }

      // Закриття при кліку поза точкою і поза вікном
      if (!clickedOnDot && infoBox && !infoBox.contains(event.target as Node)) {
        infoBox.style.opacity = "0";
        infoBox.style.transform = "scale(0.95)";
        setTimeout(() => {
          infoBox.style.display = "none";
          infoBox.innerHTML = "";
        }, 300);
      }
    });
     */

    window.addEventListener("click", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(globe.children);

      if (intersects.length > 0) {
        const clickedDot = intersects[0].object;
        console.log("Clicked on:", clickedDot.name);
        // Можна додати логіку: показати інфо, змінити колір, тощо
      }
    });

    const animate = () => {
      requestAnimationFrame(animate);
      if (!rotationPaused) {
        globe.rotation.y += 0.001;
      }
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

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

    window.addEventListener("click", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(globe.children);

      if (intersects.length > 0) {
        const dot = intersects[0].object;
        infoBox.style.display = "block";
        infoBox.style.left = `${event.clientX}px`;
        infoBox.style.top = `${event.clientY}px`;
        infoBox.style.opacity = "1";
        infoBox.style.transform = "scale(1)";

        infoBox.innerHTML = `
      <strong>${dot.name}</strong><br/>
      ${dot.userData.info || "Немає опису"}<br/>
      ${
        dot.userData.logo ? `<img src="${dot.userData.logo}" width="80" />` : ""
      }
      ${
        dot.userData.chart
          ? `<img src="${dot.userData.chart}" width="120" />`
          : ""
      }
    `;
      } else {
        // 👇 Закриття при кліку поза вікном
        if (!infoBox.contains(event.target as Node)) {
          infoBox.style.opacity = "0";
          infoBox.style.transform = "scale(0.95)";
          setTimeout(() => {
            infoBox.style.display = "none";
          }, 300);
        }
      }
    });

    return () => {
      mountNode.removeChild(renderer.domElement); // ✅ використовуємо ту саму змінну
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

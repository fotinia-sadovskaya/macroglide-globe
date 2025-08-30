import React, { useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { latLongToVector3 } from "../utils/utils";

const ExchangeDot = ({ exchange, radius = 1.01 }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const position = latLongToVector3(exchange.lat, exchange.lon, radius);

  return (
    <mesh
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      <sphereGeometry args={[0.015, 16, 16]} />
      <meshStandardMaterial
        color={hovered ? "#00ffff" : "#ff00ff"}
        emissive={hovered ? "#00ffff" : "#000000"}
        emissiveIntensity={hovered ? 1 : 0}
      />
      {clicked && (
        <Html
          position={[0, 0.03, 0]}
          center
          distanceFactor={1.5}
          style={{
            background: "rgba(0,0,0,0.7)",
            padding: "8px 12px",
            borderRadius: "6px",
            color: "white",
            fontSize: "0.8rem",
            maxWidth: "200px",
          }}
        >
          <strong>{exchange.name}</strong>
          <br />
          <em>Короткий опис біржі</em>
          <br />
          {/* Можна додати логотип */}
        </Html>
      )}
    </mesh>
  );
};

export default ExchangeDot;

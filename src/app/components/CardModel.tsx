"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function CardModel() {
  const { scene } = useGLTF("/Sample Business Card.gltf");
  const ref = useRef<THREE.Object3D>(null);
  const [rotationComplete, setRotationComplete] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.z = 0;
      ref.current.rotation.x = -Math.PI / 2;
      ref.current.rotation.y = 0;
    }
  }, []);

  useFrame(() => {
    if (ref.current && !rotationComplete) {
      ref.current.rotation.z += 0.03;
      if (ref.current.rotation.z >= Math.PI) {
        ref.current.rotation.z = Math.PI;
        setRotationComplete(true);
      }
    }
  });

  return (
    <primitive ref={ref} object={scene} scale={1} position={[0, -0.2, 0]} />
  );
}

export default function ThreeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex items-center justify-center w-[75vw] h-screen mx-auto"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 70 }}
        className="rounded-2xl shadow-lg"
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 5, 5]} intensity={1.2} castShadow />
        <pointLight position={[-3, -2, -3]} intensity={0.5} />
        <Environment preset="city" />

        <CardModel />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </motion.div>
  );
}

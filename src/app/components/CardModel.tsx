"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function CardModel({ rotationComplete }: { rotationComplete: boolean }) {
  const { scene } = useGLTF("/Sample Business Card.gltf");
  const ref = useRef<THREE.Object3D>(null);
  const [floatPhase, setFloatPhase] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Initial rotation setup
  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.set(-Math.PI / 2, 0, 0);
    }
  }, []);

  // Handle mouse movement relative to screen center
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;

    // Rotation animation (once)
    if (!rotationComplete) {
      ref.current.rotation.z += 0.03;
      if (ref.current.rotation.z >= Math.PI) {
        ref.current.rotation.z = Math.PI;
      }
      return;
    }

    // Floating animation (after rotation)
    setFloatPhase((prev) => prev + delta * 1.2); // slightly slower, smoother
    const floatY = Math.sin(floatPhase) * 0.12; // ⬆️ more noticeable float (was 0.05)

    // Smoothly follow mouse position (gentle tilt)
    const targetRotX = mousePos.y * 0.08; // ⬇️ reduced tilt strength
    const targetRotY = mousePos.x * 0.1;

    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -Math.PI / 2 + targetRotX,
      0.05
    );
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      targetRotY,
      0.05
    );

    // Apply floating with subtle damping
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      -0.2 + floatY,
      0.08
    );
  });

  return (
    <primitive ref={ref} object={scene} scale={1} position={[0, -0.2, 0]} />
  );
}

export default function ThreeCard() {
  const [rotationComplete, setRotationComplete] = useState(false);

  // Track when rotation animation finishes
  useEffect(() => {
    const timer = setTimeout(() => setRotationComplete(true), 3500); // ~3.5s rotation
    return () => clearTimeout(timer);
  }, []);

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

        <CardModel rotationComplete={rotationComplete} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </motion.div>
  );
}

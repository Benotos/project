import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

export function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 1] }}>
        {/* A massive, slowly moving particle system */}
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1} 
        />
        
        {/* Later, you could map your 2D illustrations onto planes here using <mesh> */}
      </Canvas>
    </div>
  );
}
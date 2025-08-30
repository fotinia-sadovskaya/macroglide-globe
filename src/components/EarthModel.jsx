import { useGLTF } from '@react-three/drei';

export default function EarthModel(props) {
  const { scene } = useGLTF('/models/earth.glb'); // шлях до моделі

  return <primitive object={scene} {...props} />;
}

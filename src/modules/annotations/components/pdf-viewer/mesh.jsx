export function PDFMesh({ texture }) {
  const aspectRatio = texture.image.width / texture.image.height;
  return (
    <mesh>
      <planeGeometry args={[aspectRatio * 5, 5]} /> {/* Adjusted for aspect ratio */}
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};
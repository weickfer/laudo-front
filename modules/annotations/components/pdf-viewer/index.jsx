import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import * as pdfjs from 'pdfjs-dist';
import { useThree } from '@react-three/fiber';
import { PDFMesh } from './mesh';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-dist/pdf.worker.min.js'

export function PDFViewer({ url, setThreeOnLoad }) {
  const [texture, setTexture] = useState(null);
  const three = useThree()

  useEffect(() => {
    const loadPdf = async () => {
      const pdf = await pdfjs.getDocument(url).promise;
      const page = await pdf.getPage(1);

      const scale = 10;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');

      const context = canvas.getContext('2d');
      context.fillStyle = 'red'
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const texture = new THREE.CanvasTexture(canvas);

      setTexture(texture);
    };

    loadPdf();
  }, [url]);

  useEffect(() => {
    setThreeOnLoad(three)
  }, [])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {texture && <PDFMesh texture={texture} />}
      <OrbitControls enableRotate={false} />
    </>
  );
};



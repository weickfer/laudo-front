import * as fabric from "fabric";
import React, { useEffect, useRef, useState } from "react";

import { useSidebar } from '../../contexts/sidebar';

import { createArrow, createCircle, createRectangle, createTextBox, editArrow, editRectangle, resizeCircle } from "./shapes";
import { getObjectByPosition, parseToVector, resizeCanvas, vectorToObject } from "./utils";


export function ImageEditor({ url, cachedVectors = [], onSubmit }) {
  const [annotationType, toggleTool] = useSidebar()
  const [canvas, setCanvas] = useState()
  const canvasRef = useRef(null);
  const currentAnnotation = useRef()
  const readOnly = typeof onSubmit !== 'function';

  useEffect(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#f3f3f3',
      selection: false,
      stopContextMenu: true,
      fireRightClick: true,
    });
    resizeCanvas(fabricCanvas, window.innerWidth * 0.70)

    fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then(image => {
      image.selectable = false
      image.set({
        originX: 'center',
        originY: 'center'
      });

      image.scaleX = 0.7
      image.scaleY = 0.7

      fabricCanvas.centerObject(image)


      fabricCanvas.add(image);

      image.scaleToWidth(fabricCanvas.width);
      image.scaleToHeight(fabricCanvas.height);
      fabricCanvas.renderAll()

      if (cachedVectors.length > 0) {
        cachedVectors.forEach(vector => {
          const object = vectorToObject(vector, fabricCanvas.width, fabricCanvas.height)

          if (readOnly) {
            object.set('selectable', false)
          }

          fabricCanvas.add(object);
        })

        fabricCanvas.renderAll();
      }

      // const lineTest = createLineWithControls(fabricCanvas)

      // fabricCanvas.add(lineTest)
      // fabricCanvas.renderAll()

    })

    setCanvas(fabricCanvas)

    return () => {
      fabricCanvas.dispose()
    }
  }, [url]);

  useEffect(() => {
    if (!canvas) return

    canvas.on('mouse:down', ({ e, target }) => {
      if (e?.button && e.button !== 0) return
      // if(e?.touches?.length > 1) return

      

      const pointer = canvas.getPointer(e.touches?.[0] ?? e);
      const object = getObjectByPosition(canvas, pointer)

      const fromX = pointer.x;
      const fromY = pointer.y;

      if (annotationType === 'arrow') {
        const arrow = createArrow(fromX, fromY, fromX, fromY, 0)
        canvas.add(...arrow)
        currentAnnotation.current = {
          type: 'arrow',
          shape: arrow,
        }
      }

      if (annotationType === 'circle') {
        const circle = createCircle(fromX, fromY)
        canvas.add(circle)

        currentAnnotation.current = {
          type: 'circle',
          shape: circle
        }
      }

      if (annotationType === 'rect') {
        const rect = createRectangle(fromX, fromY)
        canvas.add(rect)

        currentAnnotation.current = {
          type: 'rect',
          shape: rect
        }
      }

      if (annotationType === 'text') {
        const text = createTextBox(fromX, fromY)
        canvas.add(text)

        currentAnnotation.current = {
          type: 'text',
          shape: text
        }
      }

      if (annotationType === 'trash') {
        if (object) {
          canvas.remove(object)
          canvas.renderAll()
        }
      }

      // // console.log(object?.type)
      // if(!annotationType && object?.type === 'group') {
      //   const [line, chevron] = object.getObjects()

      //   canvas.remove(object)
      //   const { x1, x2, y1, y2 } = line
      //   const { angle } = chevron

      //   const arrow = createArrow(x1, y1, x2, y2,angle)
      //   canvas.add(...arrow)
      //   currentAnnotation.current = {
      //     type: 'arrow',
      //     shape: arrow,
      //   }
      //   // currentAnnotation.current = {
      //   //   type: 'arrow',
      //   //   shape: arrow,
      //   // }
      // }

    })

    canvas.on('mouse:move', ({ e }) => {
      if (!currentAnnotation.current) return;


      const pointer = canvas.getPointer(e.touches?.[0] ?? e);
      const toX = pointer.x;
      const toY = pointer.y;

      const annotation = currentAnnotation.current

      if (annotation.type === 'arrow') {
        editArrow(annotation.shape, toX, toY)
      }

      if (annotation.type === 'circle') {
        resizeCircle(annotation.shape, toX, toY)
      }

      if (annotation.type === 'rect') {
        editRectangle(annotation.shape, toX, toY)
      }

      canvas.renderAll();
    })

    canvas.on("mouse:up", () => {
      if (!currentAnnotation.current) return

      const annotation = currentAnnotation.current

      if (Array.isArray(annotation.shape)) {
        const group = new fabric.Group(annotation.shape, {
          annotationType: annotation.type,
          selectable: true,
          lockRotation: true
        });
        canvas.add(group);
        canvas.remove(...annotation.shape)
        // setVectors(oldState => [...oldState, annotation.shape])
      }

      canvas.renderAll();

      currentAnnotation.current = null;
      toggleTool(annotationType)
    });

    canvas.on('object:scaling', ({ target }) => {
      if (target.type === 'rect') {
        const width = Math.abs(target.width * target.scaleX);
        const height = Math.abs(target.height * target.scaleY);

        target.set({
          objectCaching: false,
          scaleX: 1,
          scaleY: 1,
          width,
          height
        });

        target.setCoords();
        canvas.renderAll();
      }

      if (target.type === 'textbox') {
        const scaleX = target.scaleX;
        const scaleY = target.scaleY;

        target.set({
          width: target.width * scaleX,
          height: target.height * scaleY,
          fontSize: target.fontSize * scaleY,
          scaleX: 1,
          scaleY: 1
        });

        target.setCoords();
        canvas.requestRenderAll();
      }
    });

    return () => {
      canvas.off()
    }
  }, [canvas, annotationType])

  useEffect(() => {
    const handleResize = () => {
      if (canvas) {
        resizeCanvas(canvas, window.innerWidth * 0.70);
        canvas.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvas])

  const handleSaveVectors = () => {
    const vectors = canvas.getObjects()
      .filter(object => object.type !== 'image')
      .map(object => parseToVector({
        type: object.annotationType ?? object.type,
        shape: object
      }, canvas.width, canvas.height))

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      width:  1080,
      height: 720,
    })

    // const anchor = document.createElement('a')
    // anchor.href = dataURL;
    // anchor.download = 'image.png';
    // document.body.appendChild(anchor);
    // anchor.click();
    // document.body.removeChild(anchor);

    onSubmit(vectors, dataURL)
  }

  return (
    <>
      <canvas className="image-editor" ref={canvasRef} />
      {
        !readOnly && (
          <button
            onClick={handleSaveVectors}
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            Salvar
          </button>
        )
      }
    </>
  );
};

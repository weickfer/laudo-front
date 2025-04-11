import * as fabric from 'fabric';
import { createArrow, createCircle, createRectangle, createTextBox } from './shapes';

function pointInCircle(x, y, cx, cy, radius) {
  const distanceSquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distanceSquared <= radius * radius;
}

export function isPointInsideObject(point, obj) {
  if (obj.type === 'circle') {
    const circleCenterX = obj.left // Posição X do centro
    const circleCenterY = obj.top  // Posição Y do centro

    // Use a função pointInCircle para verificar se o ponto está dentro do círculo
    const scaledRadius = obj.radius * Math.max(obj.scaleX, obj.scaleY); // Usando o maior fator de escala
    return pointInCircle(point.x, point.y, circleCenterX, circleCenterY, scaledRadius);
  } else {
    // For other shapes, use the bounding box approach
    const objectLeft = obj.left;
    const objectTop = obj.top;
    const objectRight = obj.left + obj.width * obj.scaleX;
    const objectBottom = obj.top + obj.height * obj.scaleY;

    return (
      point.x >= objectLeft &&
      point.x <= objectRight &&
      point.y >= objectTop &&
      point.y <= objectBottom
    );
  }
}

export function getObjectByPosition(canvas, point) {
  return canvas.getObjects().filter(o => o.type !== 'image').find((obj) => isPointInsideObject(point, obj));
}

const aspectRatio = 16 / 9

export function resizeCanvas(canvas, width) {
  const height = width / aspectRatio
  canvas.setWidth(width)
  canvas.setHeight(height)
  canvas.renderAll()
}

export function parseToVector({ type, shape }, canvasWidth, canvasHeight) {
  if (type === "arrow") {
    const [line, head] = shape.getObjects()
    // const [tr, _, bl] = shape.getCoords()

    return {
      type,
      x1: line.x1 / canvasWidth,
      y1: line.y1 / canvasHeight,
      x2: line.x2 / canvasWidth,
      y2: line.y2 / canvasHeight,
      angle: head.angle,
      groupAngle: shape.angle, 
    }
  }

  if (type === 'circle') {
    return {
      type,
      top: shape.top / canvasHeight,
      left: shape.left / canvasWidth,
      radius: shape.radius
    }
  }

  if (type === 'rect') {
    return {
      type,
      top: shape.top / canvasHeight,
      left: shape.left / canvasWidth,
      width: shape.width / canvasWidth,
      height: shape.height / canvasHeight,
    }
  }

  if (type === 'textbox') {
    return {
      type,
      top: shape.top / canvasHeight,
      left: shape.left / canvasWidth,
      fontSize: shape.fontSize,
      width: shape.width / canvasWidth,
      content: shape.text,
    }
  }
}

export function vectorToObject(vector, canvasWidth, canvasHeight) {
  if (vector.type === 'arrow') {
    return new fabric.Group(
      createArrow(
        vector.x1 * canvasWidth, 
        vector.y1 * canvasHeight, 
        vector.x2 * canvasWidth, 
        vector.y2 * canvasHeight, 
        vector.angle
      ), {
      annotationType: vector.type,
      selectable: true,
      angle: vector.groupAngle,
      lockRotation: true
    }
    )
  }
  if (vector.type === 'circle') {
    return createCircle(
      vector.left * canvasWidth, 
      vector.top * canvasHeight, 
      vector.radius
    )
  }

  if (vector.type === 'rect') {
    return createRectangle(
      vector.left * canvasWidth, 
      vector.top * canvasHeight, 
      vector.width * canvasWidth, 
      vector.height * canvasHeight
    )
  }

  if (vector.type === 'textbox') {
    return createTextBox(
      vector.left * canvasWidth, 
      vector.top * canvasHeight, 
      vector.content, 
      vector.fontSize, 
      vector.width * canvasWidth
    )
  }
}
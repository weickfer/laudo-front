import * as fabric from 'fabric'

const headSize = 15;

const cornerStyle = {
  borderColor: 'blue',
  cornerColor: 'blue',
  cornerSize: 8,
  transparentCorners: false
}

export function createArrow(fromX, fromY, toX, toY, angle) {
  const line = new fabric.Line([fromX, fromY, toX, toY], {
    stroke: "red",
    strokeWidth: 5,
    selectable: false,
  });

  const arrowAngle = angle ?? (Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI) + 90);

  const arrowHead = new fabric.Triangle({
    left: toX,
    top: toY,
    originX: "center",
    originY: "center",
    angle: arrowAngle,
    width: headSize,
    height: headSize,
    fill: "red",
    selectable: false,
  });

  return [line, arrowHead];
};

export function editArrow(shape, toX, toY) {
  const [line, arrowHead] = shape
  line.set({ x2: toX, y2: toY });
  arrowHead.set({ left: toX, top: toY });

  const angle = Math.atan2(toY - line.y1, toX - line.x1) * (180 / Math.PI);

  arrowHead.set({ angle: angle + 90 });
}

export function createCircle(fromX, fromY, radius = 0) {
  const circle = new fabric.Circle({
    left: fromX,
    top: fromY,
    radius,
    stroke: "blue",
    strokeWidth: 5,
    fill: "transparent",
    originX: 'center',
    originY: 'center',
    selectable: true,
    lockRotation: true
  });
  return circle;
};

export function resizeCircle(shape, toX, toY) {
  const radius = Math.sqrt((toX - shape.left) ** 2 + (toY - shape.top) ** 2);

  shape.set({
    radius: radius,
    originX: 'center',
    originY: 'center'
  });
  shape.setCoords()
}

export function createRectangle(fromX, fromY, width = 0, height = 0) {
  const rectangle = new fabric.Rect({
    left: fromX,
    top: fromY,
    width: width,
    height: height,
    stroke: "green",
    strokeWidth: 5,
    fill: "transparent",
    originX: 'left',
    originY: 'top',
    selectable: true,
    lockRotation: true
  });
  return rectangle;
}

export function editRectangle(shape, toX, toY) {
  const width = Math.abs(toX - shape.left);
  const height = Math.abs(toY - shape.top);

  shape.set({
    width: width,
    height: height,
    originX: 'left',
    originY: 'top'
  });
  shape.setCoords()
}


export function createTextBox(fromX, fromY, content = 'Digite aqui', fontSize = 20, width = 200) {
  const textBox = new fabric.Textbox(content, {
    left: fromX,            
    top: fromY,            
    width,          
    fontSize,        
    fill: '#333',        
    textAlign: 'center', 
    fontFamily: 'Arial', 
    editable: true,
    backgroundColor: 'transparent',
    padding: 10,
    ...cornerStyle,
  });

  textBox.on('changed', () => {
    textBox.set({
      width: Math.max(200, textBox.width)
    });
  });

  return textBox
}

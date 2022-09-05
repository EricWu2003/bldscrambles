import React, {useRef, useEffect} from 'react'
import Cube from 'cubejs';



const GRIDSIZE = 20;
const GAP = 5;

const colors = {
  U: '#FFFFFF',
  D: '#FFFF00',
  L: '#FFA500',
  R: '#FF0000',
  F: '#00FF00',
  B: '#0000FF',
}

const Canvas = props => {

  

  const { currentScramble } = props;
  const cube = new Cube();
  cube.move(currentScramble);
  const cubeString = cube.asString();

  
  const canvasRef = useRef(null)
    
    
    
  useEffect(() => {
    const draw = ctx => {
      const {width, height} = props;
      const totalWidth = 12*GRIDSIZE + 3*GAP;
      const totalHeight = 9*GRIDSIZE + 2*GAP;
      const marginLeft = (width - totalWidth)/2;
      const marginTop = (height - totalHeight)/2;


      ctx.fillStyle = '#fdd';
      ctx.fillRect(0, 0, width, height);

      drawSquare(ctx, cubeString, 3*GRIDSIZE + 1*GAP + marginLeft, marginTop);
      drawSquare(ctx, cubeString.slice(9), 6*GRIDSIZE + 2*GAP + marginLeft, 3*GRIDSIZE + 1*GAP + marginTop);
      drawSquare(ctx, cubeString.slice(18), 3*GRIDSIZE + 1*GAP + marginLeft, 3*GRIDSIZE + 1*GAP + marginTop);
      drawSquare(ctx, cubeString.slice(27), 3*GRIDSIZE + 1*GAP + marginLeft, 6*GRIDSIZE + 2*GAP + marginTop);
      drawSquare(ctx, cubeString.slice(36), 0*GRIDSIZE + marginLeft, 3*GRIDSIZE + 1*GAP + marginTop);
      drawSquare(ctx, cubeString.slice(45), 9*GRIDSIZE + 3*GAP + marginLeft, 3*GRIDSIZE + 1*GAP + marginTop);
    }

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    //Our draw come here
    draw(context)
  }, [canvasRef, cubeString, props])
  
  return <canvas ref={canvasRef} width={props.width} height={props.height}/>
}

const drawSquare =  (ctx, square, x, y) => {
  const positions = [[0,0], [1,0], [2,0], [0,1], [1,1], [2,1], [0,2], [1,2], [2,2]];

  ctx.strokeStyle = "#000000";
  for (let i = 0; i < 9; i ++) {
    ctx.fillStyle = colors[square[i]];
    ctx.fillRect(x + positions[i][0] * GRIDSIZE, y + positions[i][1] * GRIDSIZE, GRIDSIZE, GRIDSIZE);
    ctx.strokeRect(x + positions[i][0] * GRIDSIZE, y + positions[i][1] * GRIDSIZE, GRIDSIZE, GRIDSIZE);
  }

}


export default Canvas
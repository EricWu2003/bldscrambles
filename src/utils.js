import Cube from "cubejs";

export function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

export function generateRandomScramble() {
  Cube.initSolver();
  
  return Cube.scramble();

}

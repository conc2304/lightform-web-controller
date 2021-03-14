import { Matrix, solve } from 'ml-matrix';

export function lfComputePerspectiveWarp (vertices: number[][]) {
  const uvs = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1]
  ];

  let linearSystem = [];
  for(var i = 0; i < vertices.length; i++) {
    const from = vertices[i];
    const to = uvs[i];
    linearSystem.push( [from[0],from[1],1, 0,0,0, -from[0]*to[0],-from[1]*to[0],-to[0]] );
    linearSystem.push( [0,0,0, -from[0],-from[1],-1, from[0]*to[1],from[1]*to[1],to[1]] );
  }
  linearSystem.push([0,0,0, 0,0,0, 0,0,1])

  const A = new Matrix(linearSystem);
  const b = Matrix.from1DArray(9, 1, [0,0,0, 0,0,0, 0,0,1]);
  const x = solve(A, b, true);
  const homography = Matrix.from1DArray(3, 3, x.to1DArray());

  return homography.transpose().to1DArray(); // transpose because opengl expects column-major matrix
};

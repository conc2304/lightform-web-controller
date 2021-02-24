import p5 from 'p5';

export function lfP5smoothQuad (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, detailX: number = 8, detailY: number = 8) {

  const gId = `smoothQuad|${x1}|${y1}|${x2}|${y2}|${x3}|${y3}|${x4}|${y4}|${detailX}|${detailY}`;

  if (!this._renderer.geometryInHash(gId)) {
    const smoothQuadGeom = new p5.Geometry(detailX, detailY, function () {
      //algorithm adapted from c++ to js
      //https://stackoverflow.com/questions/16989181/whats-the-correct-way-to-draw-a-distorted-plane-in-opengl/16993202#16993202
      let xRes = 1.0 / (this.detailX - 1);
      let yRes = 1.0 / (this.detailY - 1);
      for (let y = 0; y < this.detailY; y++) {
        for (let x = 0; x < this.detailX; x++) {
          let pctx = x * xRes;
          let pcty = y * yRes;

          let linePt0x = (1 - pcty) * x1 + pcty * x4;
          let linePt0y = (1 - pcty) * y1 + pcty * y4;
          let linePt1x = (1 - pcty) * x2 + pcty * x3;
          let linePt1y = (1 - pcty) * y2 + pcty * y3;

          let ptx = (1 - pctx) * linePt0x + pctx * linePt1x;
          let pty = (1 - pctx) * linePt0y + pctx * linePt1y;

          const vector = new p5.Vector();
          vector.add(ptx, pty);
          this.vertices.push(vector);
          this.uvs.push([pctx, pcty]);
        }
      }
    });

    //compute faces
    (smoothQuadGeom as any).faces = [];

    for (let y = 0; y < detailY - 1; y++) {
      for (let x = 0; x < detailX - 1; x++) {
        let pt0 = x + y * detailX;
        let pt1 = x + 1 + y * detailX;
        let pt2 = x + 1 + (y + 1) * detailX;
        let pt3 = x + (y + 1) * detailX;
        (smoothQuadGeom as any).faces.push([pt0, pt1, pt2]);
        (smoothQuadGeom as any).faces.push([pt0, pt2, pt3]);
      }
    }
    (smoothQuadGeom as any).computeNormals()._makeTriangleEdges()._edgesToVertices();
    this._renderer.createBuffers(gId, smoothQuadGeom);
  }
  this._renderer.drawBuffersScaled(gId, 1, 1, 1);

  return this;
};

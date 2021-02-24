// ==== Library Imports =======================================================
import p5 from 'p5';
import lfAlignmentService from './lf-alignment.service';
import lfP5DraggablesService from './lf-p5-draggables.service';
import { LfMaskPath } from './lf-remote-api/lf-remote-api-alignment.service';

// ==== App Imports ===========================================================

class lfP5AlignmentService {
  // ==== PUBLIC ============================================================
  // ---- Construction ------------------------------------------------------
  constructor(localP5: p5, draggableService: lfP5DraggablesService) {
    this.lfP5 = localP5;
    this.draggableService = draggableService;
    this.LF_BLUE_LIGHT_RGB = this.lfP5.color(88, 133, 255);
    this.LF_BLUE_BASE_RGB = this.lfP5.color(44, 101, 255);
    this.LF_GREEN_RGB = this.lfP5.color(23, 232, 176);
    this.LF_RED_RGB = this.lfP5.color(255, 0, 0);
  }

  // ---- Properties --------------------------------------------------------

  public drawAlignmentPath(pathPoints: LfMaskPath, canvasSize: { width: number, height: number }) {
    this.lfP5.push();
    this.lfP5.stroke('white');
    this.lfP5.strokeWeight(3);
    this.lfP5.fill(44, 101, 255, 100);
    this.lfP5.beginShape();
    pathPoints.map((pointXY: Array<number>) => {
      const x = lfAlignmentService.lfPointToP5Value(pointXY[0], 'x', canvasSize);
      const y = lfAlignmentService.lfPointToP5Value(pointXY[1], 'y', canvasSize);
      this.lfP5.vertex(x, y);
    });
    this.lfP5.endShape(this.lfP5.CLOSE);
    this.lfP5.pop();
  }

  public createDragPoints(maskPath: LfMaskPath, size: { width: number, height: number }) {
    const draggableShapeWidth = size.width / 4;
    const draggableShapeHeight = size.height / 4

    let vecTL: p5.Vector, vecTM: p5.Vector, vecTR: p5.Vector, vecRM: p5.Vector, vecBR: p5.Vector, vecBM: p5.Vector, vecBL: p5.Vector, vecLM: p5.Vector;

    if (maskPath?.length) {
      // if we have the path use it,
      const p = maskPath;
      if (maskPath.length === 4) {
        vecTL = this.createPoint(lfAlignmentService.lfPointToP5Value(p[0][0], 'x', size), lfAlignmentService.lfPointToP5Value(p[0][1], 'y', size));
        vecTR = this.createPoint(lfAlignmentService.lfPointToP5Value(p[1][0], 'x', size), lfAlignmentService.lfPointToP5Value(p[1][1], 'y', size));
        vecBR = this.createPoint(lfAlignmentService.lfPointToP5Value(p[2][0], 'x', size), lfAlignmentService.lfPointToP5Value(p[2][1], 'y', size));
        vecBL = this.createPoint(lfAlignmentService.lfPointToP5Value(p[3][0], 'x', size), lfAlignmentService.lfPointToP5Value(p[3][1], 'y', size));
      }
      else if (maskPath.length === 8) {
        vecTL = this.createPoint(lfAlignmentService.lfPointToP5Value(p[0][0], 'x', size), lfAlignmentService.lfPointToP5Value(p[0][1], 'y', size));
        vecTM = this.createPoint(lfAlignmentService.lfPointToP5Value(p[1][0], 'x', size), lfAlignmentService.lfPointToP5Value(p[1][1], 'y', size));
        vecTR = this.createPoint(lfAlignmentService.lfPointToP5Value(p[2][0], 'x', size), lfAlignmentService.lfPointToP5Value(p[2][1], 'y', size));
        vecRM = this.createPoint(lfAlignmentService.lfPointToP5Value(p[3][0], 'x', size), lfAlignmentService.lfPointToP5Value(p[3][1], 'y', size));
        vecBR = this.createPoint(lfAlignmentService.lfPointToP5Value(p[4][0], 'x', size), lfAlignmentService.lfPointToP5Value(p[4][1], 'y', size));
        vecBM = this.createPoint(lfAlignmentService.lfPointToP5Value(p[5][0], 'x', size), lfAlignmentService.lfPointToP5Value(p[5][1], 'y', size));
        vecBL = this.createPoint(lfAlignmentService.lfPointToP5Value(p[6][0], 'x', size), lfAlignmentService.lfPointToP5Value(p[6][1], 'y', size));
        vecLM = this.createPoint(lfAlignmentService.lfPointToP5Value(p[7][0], 'x', size), lfAlignmentService.lfPointToP5Value(p[7][1], 'y', size));
      }

    } else {
      // if not just center it
      // if (maskPath.length === 4) {
        vecTL = this.createPoint(-draggableShapeWidth, -draggableShapeHeight);
        vecTR = this.createPoint(draggableShapeWidth, -draggableShapeHeight);
        vecBR = this.createPoint(draggableShapeWidth, draggableShapeHeight);
        vecBL = this.createPoint(-draggableShapeWidth, draggableShapeHeight);
      // } else if ([8,0].includes(maskPath.length)) {
      //   vecTL = this.createPoint(-draggableShapeWidth, -draggableShapeHeight);
      //   vecTM = this.createPoint(0, -draggableShapeHeight);
      //   vecTR = this.createPoint(draggableShapeWidth, -draggableShapeHeight);
      //   vecRM = this.createPoint(draggableShapeWidth, 0);
      //   vecBR = this.createPoint(draggableShapeWidth, draggableShapeHeight);
      //   vecBM = this.createPoint(0, draggableShapeHeight);
      //   vecBL = this.createPoint(-draggableShapeWidth, draggableShapeHeight);
      //   vecLM = this.createPoint(-draggableShapeWidth, 0);
      // }
    }

    return { vecTL, vecTM, vecTR, vecRM, vecBR, vecBM, vecBL, vecLM };
  }




  // ---- Methods -----------------------------------------------------------

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
  private lfP5: p5;
  private draggableService: lfP5DraggablesService;
  private readonly LF_BLUE_LIGHT_RGB: p5.Color;
  private readonly LF_BLUE_BASE_RGB: p5.Color;
  private readonly LF_GREEN_RGB: p5.Color;
  private readonly LF_RED_RGB: p5.Color;

  // ---- Methods -----------------------------------------------------------

  private createPoint(x: number, y: number): p5.Vector {
    let vec = this.lfP5.createVector(x, y);
    this.draggableService.addDrag(vec);

    return vec;
  }

}

export default lfP5AlignmentService;

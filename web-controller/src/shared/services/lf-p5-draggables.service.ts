// ==== Library Imports =======================================================
import p5 from 'p5';

// ==== App Imports ===========================================================

class lfP5DraggablesService {
  // ==== PUBLIC ============================================================
  // ---- Construction ------------------------------------------------------
  constructor(localP5: p5, sustainSelection: boolean = true) {
    this.lfP5 = localP5;
    this.sustainSelection = sustainSelection; // sets whether the selected index should remain selected after mouseRelease
    this.LF_BLUE_LIGHT_RGB = this.lfP5.color(88, 133, 255);
    this.LF_BLUE_BASE_RGB = this.lfP5.color(44, 101, 255);
    this.LF_GREEN_RGB = this.lfP5.color(23, 232, 176);
    this.LF_RED_RGB = this.lfP5.color(255, 0, 0);
  }

  // ---- Properties --------------------------------------------------------
  public selectedIndex = -1;
  public draggablePoints: Array<p5.Vector> = [];

  // ---- Methods -----------------------------------------------------------
  public addDrag(vec: p5.Vector): void {
    this.draggablePoints.push(vec);
  }

  public drawDrag(connect = false): void {
    this.lfP5.push();

    connect = true;

    // draw the outline
    if (connect) {
      this.lfP5.strokeWeight(2);
      this.lfP5.stroke(this.LF_BLUE_LIGHT_RGB);
      this.lfP5.noFill();
      this.lfP5.beginShape();
      this.draggablePoints.map((point: p5.Vector, i: number) => {
        this.lfP5.vertex(point.x, point.y);
      });
      this.lfP5.endShape(this.lfP5.CLOSE);
    }


    // draw the circles
    this.lfP5.push();
    this.lfP5.noFill();
    this.lfP5.strokeWeight(3);
    this.draggablePoints.map((point: p5.Vector, i: number) => {
      if (this.selectedIndex == i) {
        this.lfP5.stroke(this.LF_GREEN_RGB);
        this.lfP5.fill('white');
      } else {
        this.lfP5.stroke(this.LF_BLUE_BASE_RGB);
        this.lfP5.fill(this.LF_BLUE_BASE_RGB);
      }
      this.lfP5.circle(point.x, point.y, 10);
    });
    this.lfP5.pop();
  }

  public dragMousePressed(): void {
    this.findSelected();
  }

  public dragMouseReleased(): void {
    if (!this.sustainSelection) {
      this.selectedIndex = -1;
    }
  }

  public dragMouseDragged(): void {

    if (this.selectedIndex == -1) return;

    const nextPointX = this.getMouseX();
    const nextPointY = this.getMouseY();
    if (this.pointInCanvas(nextPointX, nextPointY)) {
      this.draggablePoints[this.selectedIndex].x = nextPointX;
      this.draggablePoints[this.selectedIndex].y = nextPointY;
    }
  }

  public findSelected(): void {
    const MIN_DIST = this.lfP5.pow(this.DRAG_SIZE / 2, 2);
    const mX = this.getMouseX();
    const mY = this.getMouseY();
    let closest = 99999;


    if (this.pointInCanvas(mX, mY)) {
      this.selectedIndex = -1;

      for (let i = 0; i < this.draggablePoints.length; i++) {
        const distX = this.draggablePoints[i].x - mX;
        const distY = this.draggablePoints[i].y - mY;
        const distance = distX * distX + distY * distY;
        if (distance < closest && distance < MIN_DIST) {
          closest = distance;
          this.selectedIndex = i;
        }
      }
    }
  }

  public getMouseX(): number {
    return this.lfP5.mouseX - this.lfP5.width / 2;
  }

  public getMouseY(): number {
    return this.lfP5.mouseY - this.lfP5.height / 2;
  }

  public getPmouseX(): number {
    return this.lfP5.pmouseX - this.lfP5.width / 2;
  }

  public getPmouseY(): number {
    return this.lfP5.pmouseY - this.lfP5.height / 2;
  }

  public pointInCanvas(x: number, y: number): boolean {
    const xAbsMax = this.lfP5.width / 2
    const yAbsMax = this.lfP5.height / 2;
    return (x <= xAbsMax && x >= -xAbsMax && y <= yAbsMax && y >= -yAbsMax);
  }

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
  private lfP5: p5;
  private sustainSelection: boolean;
  private readonly DRAG_SIZE = 20;
  private readonly LF_BLUE_LIGHT_RGB: p5.Color;
  private readonly LF_BLUE_BASE_RGB: p5.Color;
  private readonly LF_GREEN_RGB: p5.Color;
  private readonly LF_RED_RGB: p5.Color;

  // ---- Methods -----------------------------------------------------------

}

export default lfP5DraggablesService;

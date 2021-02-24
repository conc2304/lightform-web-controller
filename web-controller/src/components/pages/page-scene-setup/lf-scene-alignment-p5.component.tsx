// ==== Library Imports =======================================================
import { Component, Element, h, Prop } from '@stencil/core';
import p5 from 'p5';
import debounce from 'debounce';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import lfP5DraggablesService from '../../../shared/services/lf-p5-draggables.service';
import { lfP5smoothQuad } from '../../../shared/services/lf-p5-smooth-quad.fn';
import lfRemoteApiAlignmentService, { LfMaskPath } from '../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import lfAppStateStore from '../../../store/lf-app-state.store';
import { SCAN_IMG_ASPECT_RATIO } from '../../../shared/constants/lf-alignment.constant';
import lfAlignmentService from '../../../shared/services/lf-alignment.service';
import lfP5AlignmentService from '../../../shared/services/lf-p5-alignment.service';
import lfAlignmentStateStore from '../../../store/lf-alignment-state.store';

@Component({
  tag: 'lf-scene-alignment-p5',
  styleUrls: ['lf-scene-alignment.component.scss'],
  shadow: true,
})
export class LfSceneAlignmentP5 {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSceneAlignmentP5').logger;
  private p5Canvas: HTMLElement;
  private debugCorners = false; // TODO Set to False

  private canvasSize = {
    width: 500,
    height: 500 / SCAN_IMG_ASPECT_RATIO,
  };

  // ==== HOST HTML REFERENCE =====================================================================
  @Element() hostElement: HTMLElement;

  // ==== State() VARIABLES SECTION ===============================================================

  // ==== PUBLIC PROPERTY API - Prop() SECTION ====================================================
  @Prop() isMobileLayout: boolean = lfAppStateStore.mobileLayout;
  @Prop() maskPath?: LfMaskPath = null;
  @Prop() scanImgUrl?: string = null;
  @Prop() canvasWidth?: number = null;
  @Prop() lfObjectOutlineImageUrl?: string = null;
  // @Prop() octoMask?: LfMaskPath = null;
  @Prop() octoMask?: LfMaskPath = null;

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    if (this.isMobileLayout) {
      if (this.canvasWidth > 250) {
        this.canvasWidth = 250;
      }
    } else {
      if (this.canvasWidth > 600) {
        this.canvasWidth = 600;
      }
    }

    this.canvasSize = {
      width: this.canvasWidth,
      height: this.canvasWidth / SCAN_IMG_ASPECT_RATIO,
    };
  }

  public async componentDidLoad() {
    this.log.debug('componentDidLoad');
    this.init();
  }

  // ==== LISTENERS SECTION =======================================================================
  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================

  private init() {
    this.p5Canvas.innerHTML = '';
    new p5(p => {
      this.p5Sketch(p, this);
    }, this.p5Canvas);
  }

  private p5Sketch(p: p5, props: LfSceneAlignmentP5 = this) {
    const FRAME_RATE = 24;

    const draggableService = new lfP5DraggablesService(p, true);
    const lfP5DrawService = new lfP5AlignmentService(p, draggableService);

    (p as any).smoothQuad = lfP5smoothQuad;

    let p5ScanImg;
    let p5SvgOutlineImg;
    let vecTL: p5.Vector, vecTM: p5.Vector, vecTR: p5.Vector, vecRM: p5.Vector, vecBR: p5.Vector, vecBM: p5.Vector, vecBL: p5.Vector, vecLM: p5.Vector;
    let octoMaskInitialized = false;

    p.setup = () => {
      props.p5Canvas.innerHTML = '';
      const canvas = p.createCanvas(props.canvasSize.width, props.canvasSize.height, p.WEBGL);
      canvas.style('visibility', 'visible');
      p.background(100);
      p.frameRate(FRAME_RATE);
      p.colorMode(p.RGB, 255);

      p5ScanImg = p.loadImage(props.scanImgUrl);

      if (props.lfObjectOutlineImageUrl) {
        p5SvgOutlineImg = p.loadImage(props.lfObjectOutlineImageUrl);
      }

      document.addEventListener(
        'onDirectionalPadPressed',
        (event: CustomEvent) => {
          const { direction, incrementAmount } = event.detail;
          const vertexIndex = draggableService.selectedIndex;
          if (!direction || !draggableService.draggablePoints.length || vertexIndex < 0) return;

          draggableService.draggablePoints[vertexIndex];

          // TODO handle arrow keys for perspective
          const d = ['down', 'right'].includes(direction) ? 1 : -1;
          const v = d * incrementAmount;
          const x = ['left', 'right'].includes(direction) ? v : 0;
          const y = ['up', 'down'].includes(direction) ? v : 0;

          draggableService.draggablePoints[vertexIndex].add(x, y, 0);

          this.updateObjectAlignmentPreview(draggableService.draggablePoints);
        },
        false,
      );
    };

    // DRAW
    p.draw = () => {
      // create the scan image background
      if (p5ScanImg) {
        p.image(p5ScanImg, -props.canvasSize.width / 2, -props.canvasSize.height / 2, props.canvasSize.width, props.canvasSize.height);
      }

      // create the the Alignment Path shape
      if (props.maskPath) {
        lfP5DrawService.drawAlignmentPath(props.maskPath, this.canvasSize);
      }
      // end alignment path

      // Create corner draggable LF Object outline svg
      if (props.lfObjectOutlineImageUrl) {
        if (!p5SvgOutlineImg) {
          p5SvgOutlineImg = p.loadImage(props.lfObjectOutlineImageUrl);
          ({ vecTL, vecTR, vecBR, vecBL } = lfP5DrawService.createDragPoints(props.maskPath, this.canvasSize));
        } else if (vecTL && vecTR && vecBL && vecBR) {
          // we have initialized the svg outline
          p.push();
          p.strokeWeight(0);
          p.texture(p5SvgOutlineImg);
          (p as any).smoothQuad(vecTL.x, vecTL.y, vecTR.x, vecTR.y, vecBR.x, vecBR.y, vecBL.x, vecBL.y);
          p.pop();

          draggableService.drawDrag();
        }
      }

      // Environment OctoMask
      if (props.octoMask) {
        if (octoMaskInitialized) {
          //draw it
          // lfP5DrawService.drawAlignmentPath(props.octoMask, this.canvasSize);
          p.push();
          draggableService.drawDrag();
          p.pop();
        } else {
          // initialize it once
          ({ vecTL, vecTM, vecTR, vecRM, vecBR, vecBM, vecBL, vecLM } = lfP5DrawService.createDragPoints(props.octoMask, this.canvasSize));
          octoMaskInitialized = true;
        }
      }

      if (this.debugCorners) {
        this.p5RenderDebugCorners(p);
      }
    };
    // end p5.Draw

    // Mouse/Touch Events
    p.mousePressed = () => {
      draggableService.dragMousePressed();
    };

    p.touchStarted = () => {
      draggableService.dragMousePressed();
    };

    p.mouseReleased = () => {
      if (draggableService.selectedIndex !== -1) {
        this.updateAlignment(draggableService.draggablePoints);
      }
      draggableService.dragMouseReleased();
    };

    p.touchEnded = () => {
      if (draggableService.selectedIndex !== -1) {
        this.updateAlignment(draggableService.draggablePoints);
      }
      draggableService.dragMouseReleased();
    };

    p.mouseDragged = async () => {
      draggableService.dragMouseDragged();

      if (draggableService.selectedIndex !== -1 && p.frameCount % 20 === 0) {
        // fake throttling
        this.updateAlignment(draggableService.draggablePoints);
      }
    };

    p.touchMoved = () => {
      draggableService.dragMouseDragged();

      if (draggableService.selectedIndex !== -1 && p.frameCount % 20 === 0) {
        // fake throttling
        this.updateAlignment(draggableService.draggablePoints);
      }
    };
  }
  // end this.p5Sketch
  // ----------------------

  private updateAlignment(points) {
    if (lfAlignmentStateStore.scanType === 'object') {
      this.updateObjectAlignmentPreview(points);
    } else {
      // todo
    }
  }

  private resizeVectors(vectors: Array<p5.Vector>): LfMaskPath {
    return vectors.map(xyPoint => {
      const x = lfAlignmentService.p5PointToLfValue(xyPoint.x, 'x', this.canvasSize);
      const y = lfAlignmentService.p5PointToLfValue(xyPoint.y, 'y', this.canvasSize);
      return [x, y];
    });
  }

  private updateObjectAlignmentPreview(points: Array<p5.Vector>) {
    const objectCornerPoints = this.resizeVectors(points);
    debounce(lfRemoteApiAlignmentService.setObjectAlignment(lfAppStateStore.deviceSelected.serialNumber, objectCornerPoints), 400);
  }

  private p5RenderDebugCorners(lfp5) {
    const size = 40;
    lfp5.push();
    lfp5.strokeWeight(3);
    lfp5.stroke('red');

    lfp5.noFill();
    lfp5.stroke('red');
    lfp5.circle(-this.canvasSize.width / 2, -this.canvasSize.height / 2, size); // TL
    lfp5.stroke('blue');
    lfp5.circle(this.canvasSize.width / 2, -this.canvasSize.height / 2, size); // TR
    lfp5.stroke('yellow');
    lfp5.circle(this.canvasSize.width / 2, this.canvasSize.height / 2, size); // BR
    lfp5.stroke('white');
    lfp5.circle(-this.canvasSize.width / 2, this.canvasSize.height / 2, size); // BL
    lfp5.pop();
  }

  // ==== RENDERING SECTION =======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <div class={`lf-scene-alignment--container`}>
        <div ref={el => (this.p5Canvas = el as HTMLElement)} id="p5js-canvas-wrapper"></div>
      </div>
    );
  }
}

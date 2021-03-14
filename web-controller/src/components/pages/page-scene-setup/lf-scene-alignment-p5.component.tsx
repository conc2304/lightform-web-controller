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
import { lfComputePerspectiveWarp } from '../../../shared/services/lf-compute-perspective-warp.fn';

@Component({
  tag: 'lf-scene-alignment-p5',
  styleUrls: ['lf-scene-alignment-p5.component.scss'],
  shadow: true,
})
export class LfSceneAlignmentP5 {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSceneAlignmentP5').logger;
  private p5Canvas: HTMLElement;
  private debugCorners = false; // TODO Set to False

  private p5CanvasSize = {
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
  @Prop() lfObjectOutlineImageUrl?: string = null;
  // @Prop() octoMask?: LfMaskPath = null;
  @Prop() octoMask?: LfMaskPath = null;

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    this.resetCanvasSize();
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
    let vecTL: p5.Vector, vecTR: p5.Vector, vecBR: p5.Vector, vecBL: p5.Vector;
    let vecTM: p5.Vector, vecRM: p5.Vector, vecBM: p5.Vector, vecLM: p5.Vector;
    let octoMaskInitialized = false;
    let perspectiveShader;

    p.setup = () => {
      props.p5Canvas.innerHTML = '';
      p.setAttributes('antialias', true);
      const canvas = p.createCanvas(props.p5CanvasSize.width, props.p5CanvasSize.height, p.WEBGL);
      //p.perspective(p.PI / 3.0, props.p5CanvasSize.width / props.p5CanvasSize.height, 1, 1000);
      p.ortho(-props.p5CanvasSize.width/2, props.p5CanvasSize.width/2, -props.p5CanvasSize.height/2, props.p5CanvasSize.height/2, 0, 500);

      canvas.style('visibility', 'visible');

      const gl = (p as any)._renderer.GL;
      gl.disable(gl.DEPTH_TEST);

      p.background(100);
      p.frameRate(FRAME_RATE);
      p.colorMode(p.RGB, 255);

      p5ScanImg = p.loadImage(props.scanImgUrl);

      if (props.lfObjectOutlineImageUrl) {
        p5SvgOutlineImg = p.loadImage(props.lfObjectOutlineImageUrl);
      }

      const vertexShader =
        'precision highp float;' +
        'attribute vec3 aPosition;' +
        'attribute vec2 aTexCoord;' +
        'varying vec2 vPosition;' +
        'varying vec2 vTexCoord;' +
        'uniform vec2 resolution;' +
        'void main() {' +
        '  vPosition = aPosition.xy;' +
        '  vTexCoord = aTexCoord;' +
        '  gl_Position = vec4(2.0 * vec2(aPosition.x, -aPosition.y) / resolution, 0.0, 1.0);' +
        '}';
      const fragmentShader =
        'precision highp float;' +
        'varying vec2 vPosition;' +
        'varying vec2 vTexCoord;' +
        'uniform mat3 homography;' +
        'uniform sampler2D texture;' +
        'void main() {' +
        '  vec3 homogeneousUv = homography * vec3(vPosition, 1.0);' +
        '  vec2 uv = homogeneousUv.xy / homogeneousUv.z;' +
        '  vec4 tex = texture2D(texture, uv);' +
        '  gl_FragColor = tex;' +
        '}';
      perspectiveShader = p.createShader(vertexShader, fragmentShader);

      document.addEventListener(
        'onDirectionalPadPressed',
        (event: CustomEvent) => {
          this.log.warn(event.detail);
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
        p.image(p5ScanImg, -props.p5CanvasSize.width / 2, -props.p5CanvasSize.height / 2, props.p5CanvasSize.width, props.p5CanvasSize.height);
      }

      // create the the Alignment Path shape
      if (props.maskPath && !props.lfObjectOutlineImageUrl) {
        lfP5DrawService.drawAlignmentPath(props.maskPath, this.p5CanvasSize);
      }
      // end alignment path

      // Create corner draggable LF Object outline svg
      if (props.lfObjectOutlineImageUrl) {
        if (!p5SvgOutlineImg) {
          p5SvgOutlineImg = p.loadImage(props.lfObjectOutlineImageUrl);
          ({ vecTL, vecTR, vecBR, vecBL } = lfP5DrawService.createDragPoints(props.maskPath, this.p5CanvasSize));
          lfRemoteApiAlignmentService.setObjectAlignment(lfAppStateStore.deviceSelected.serialNumber, [
            [vecTL.x, vecTL.y],
            [vecTR.x, vecTR.y],
            [vecBR.x, vecBR.y],
            [vecBL.x, vecBL.y],
          ]);
        } else if (vecTL && vecTR && vecBL && vecBR) {
          // we have initialized the svg outline
          p.push();
          p.fill(p.color(0, 0, 0, 0)); // This enables alpha blending so images with alpha images actually have transparency
          p.shader(perspectiveShader);
          const homography = lfComputePerspectiveWarp([[vecTL.x, vecTL.y], [vecTR.x, vecTR.y], [vecBR.x, vecBR.y], [vecBL.x, vecBL.y]]);
          perspectiveShader.setUniform('homography', homography);
          perspectiveShader.setUniform('texture', p5SvgOutlineImg);
          perspectiveShader.setUniform('resolution', [props.p5CanvasSize.width, props.p5CanvasSize.height]);
          p.quad(vecTL.x, vecTL.y, vecTR.x, vecTR.y, vecBR.x, vecBR.y, vecBL.x, vecBL.y);
          p.resetShader();
          p.pop();

          draggableService.drawDrag();
        }
      }

      // Environment OctoMask
      if (props.octoMask) {
        if (octoMaskInitialized) {
          //draw it
          lfP5DrawService.drawAlignmentPath(props.octoMask, this.p5CanvasSize);
          p.push();
          draggableService.drawDrag();
          p.pop();
        } else {
          // initialize it once
          console.log({ vecTL, vecTM, vecTR, vecRM, vecBR, vecBM, vecBL, vecLM });
          ({ vecTL, vecTM, vecTR, vecRM, vecBR, vecBM, vecBL, vecLM } = lfP5DrawService.createDragPoints(props.octoMask, this.p5CanvasSize));
          octoMaskInitialized = true;
        }
      }

      if (this.debugCorners) {
        this.p5RenderDebugCorners(p);
      }
    };
    // end p5.Draw

    p.windowResized = () => {
      this.resetCanvasSize();

      p.resizeCanvas(this.p5CanvasSize.width, this.p5CanvasSize.height);
    };
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
      const x = lfAlignmentService.p5PointToLfValue(xyPoint.x, 'x', this.p5CanvasSize);
      const y = lfAlignmentService.p5PointToLfValue(xyPoint.y, 'y', this.p5CanvasSize);
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
    lfp5.circle(-this.p5CanvasSize.width / 2, -this.p5CanvasSize.height / 2, size); // TL
    lfp5.stroke('blue');
    lfp5.circle(this.p5CanvasSize.width / 2, -this.p5CanvasSize.height / 2, size); // TR
    lfp5.stroke('yellow');
    lfp5.circle(this.p5CanvasSize.width / 2, this.p5CanvasSize.height / 2, size); // BR
    lfp5.stroke('white');
    lfp5.circle(-this.p5CanvasSize.width / 2, this.p5CanvasSize.height / 2, size); // BL
    lfp5.pop();
  }

  private resetCanvasSize() {
    let height = window.innerHeight * 0.4;
    let width = height * SCAN_IMG_ASPECT_RATIO;

    if (width > window.innerWidth * 0.85) {
      width = window.innerWidth * 0.85;

      this.p5CanvasSize = {
        width: width,
        height: width / SCAN_IMG_ASPECT_RATIO,
      };
    } else {
      this.p5CanvasSize = {
        width: height * SCAN_IMG_ASPECT_RATIO,
        height: height,
      };
    }
    // const width = cutoff()
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

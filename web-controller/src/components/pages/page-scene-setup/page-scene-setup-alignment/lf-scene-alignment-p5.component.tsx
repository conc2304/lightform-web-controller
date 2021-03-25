// ==== Library Imports =======================================================
import { Component, Element, h, Host, Listen, Prop } from '@stencil/core';
import p5 from 'p5';
import debounce from 'debounce';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../../shared/services/lf-logger.service';
import lfP5DraggablesService from '../../../../shared/services/lf-p5-draggables.service';
import { lfP5smoothQuad } from '../../../../shared/services/lf-p5-smooth-quad.fn';
import lfRemoteApiAlignmentService, { LfMaskPath } from '../../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import lfAppStateStore from '../../../../store/lf-app-state.store';
import { SCAN_IMG_ASPECT_RATIO } from '../../../../shared/constants/lf-alignment.constant';
import lfAlignmentService from '../../../../shared/services/lf-alignment.service';
import lfP5AlignmentService from '../../../../shared/services/lf-p5-alignment.service';
import lfAlignmentStateStore from '../../../../store/lf-alignment-state.store';
import { lfComputePerspectiveWarp } from '../../../../shared/services/lf-compute-perspective-warp.fn';

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
  private sketch: p5;
  private draggableService: lfP5DraggablesService;
  private lfP5DrawService: lfP5AlignmentService;

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
  @Prop() mode: 'mask' | 'alignment';

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  // - -  componentWillLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    this.resetCanvasSize();
  }

  // - -  componentDidLoad Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async componentDidLoad() {
    this.log.debug('componentDidLoad');
    this.init();
  }

  // - -  disconnectedCallback Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - -
  public async disconnectedCallback() {
    this.log.debug('disconnectedCallback');
    this.p5Canvas.remove();
    this.sketch.remove();
  }

  // ==== LISTENERS SECTION =======================================================================
  @Listen('onDirectionalPadPressed', { target: 'document' })
  onDirectionalPadPressed(event: CustomEvent) {
    this.log.debug('onDirectionalPadPressed');
    const { direction, incrementAmount } = event.detail;
    const vertexIndex = this.draggableService.selectedIndex;
    if (!direction || !this.draggableService.draggablePoints.length || vertexIndex < 0) return;

    this.draggableService.draggablePoints[vertexIndex];

    // TODO handle arrow keys for perspective
    const d = ['down', 'right'].includes(direction) ? 1 : -1;
    const v = (d * incrementAmount) / 3;
    const xPixel = ['left', 'right'].includes(direction) ? v : 0;
    const yPixel = ['up', 'down'].includes(direction) ? v : 0;
    this.draggableService.draggablePoints[vertexIndex].add(xPixel, yPixel, 0);

    this.updateObjectAlignmentPreview(this.draggableService.draggablePoints);
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================
  private init() {
    this.p5Canvas.innerHTML = '';
    this.sketch = new p5(p => {
      this.p5Sketch(p, this);
    }, this.p5Canvas);
  }

  private p5Sketch(sketch: p5, props: LfSceneAlignmentP5 = this) {
    const FRAME_RATE = 24;

    this.draggableService = new lfP5DraggablesService(sketch, true);
    this.lfP5DrawService = new lfP5AlignmentService(sketch, this.draggableService);

    (sketch as any).smoothQuad = lfP5smoothQuad;

    let p5ScanImg;
    let p5SvgOutlineImg;
    let vecTL: p5.Vector, vecTR: p5.Vector, vecBR: p5.Vector, vecBL: p5.Vector;
    let vecTM: p5.Vector, vecRM: p5.Vector, vecBM: p5.Vector, vecLM: p5.Vector;
    let octoMaskInitialized = false;
    let perspectiveShader;

    sketch.setup = () => {
      props.p5Canvas.innerHTML = '';
      sketch.setAttributes('antialias', true);
      const canvas = sketch.createCanvas(props.p5CanvasSize.width, props.p5CanvasSize.height, sketch.WEBGL);
      sketch.ortho(-props.p5CanvasSize.width / 2, props.p5CanvasSize.width / 2, -props.p5CanvasSize.height / 2, props.p5CanvasSize.height / 2, 0, 500);

      canvas.style('visibility', 'visible');
      canvas.mouseMoved(() => {
        this.draggableService.updateCursor();
      });

      const gl = (sketch as any)._renderer.GL;
      gl.disable(gl.DEPTH_TEST);

      sketch.background(100);
      sketch.frameRate(FRAME_RATE);
      sketch.colorMode(sketch.RGB, 255);

      p5ScanImg = sketch.loadImage(props.scanImgUrl);

      if (props.lfObjectOutlineImageUrl) {
        p5SvgOutlineImg = sketch.loadImage(props.lfObjectOutlineImageUrl);
      }

      const vertexShader = `
        precision highp float;
        attribute vec3 aPosition;
        attribute vec2 aTexCoord;
        varying vec2 vPosition;
        varying vec2 vTexCoord;
        uniform vec2 resolution;
        void main() {
          vPosition = aPosition.xy;
          vTexCoord = aTexCoord;
          gl_Position = vec4(2.0 * vec2(aPosition.x, -aPosition.y) / resolution, 0.0, 1.0);
        }
        `;
      const fragmentShader = `
        precision highp float;
        varying vec2 vPosition;
        varying vec2 vTexCoord;
        uniform mat3 homography;
        uniform sampler2D texture;
        void main() {
          vec3 homogeneousUv = homography * vec3(vPosition, 1.0);
          vec2 uv = homogeneousUv.xy / homogeneousUv.z;
          vec4 tex = texture2D(texture, uv);
          gl_FragColor = tex;
        }
        `;
      perspectiveShader = sketch.createShader(vertexShader, fragmentShader);
    };

    // DRAW
    let state = {
      maskPath : false
    }
    sketch.draw = () => {
      // create the scan image background

      if (p5ScanImg) {
        sketch.image(p5ScanImg, -props.p5CanvasSize.width / 2, -props.p5CanvasSize.height / 2, props.p5CanvasSize.width, props.p5CanvasSize.height);
      }

      // create the the Alignment Path shape
      if (props.maskPath && !props.lfObjectOutlineImageUrl) {
        this.lfP5DrawService.drawAlignmentPath(props.maskPath, this.p5CanvasSize);

        // when object outline url is not present reset svg drag points too
        p5SvgOutlineImg = null;
        this.draggableService.draggablePoints = [];
      }
      // end alignment path

      // Create corner draggable LF Object outline svg
      if (props.lfObjectOutlineImageUrl) {
        if (!p5SvgOutlineImg) {
          p5SvgOutlineImg = sketch.loadImage(props.lfObjectOutlineImageUrl);
          ({ vecTL, vecTR, vecBR, vecBL } = this.lfP5DrawService.createDragPoints(props.maskPath, this.p5CanvasSize));

          const p5AlignmentPoints = [vecTL, vecTR, vecBR, vecBL];
          const lfAlignmentPoints = this.resizeVectorsToLf(p5AlignmentPoints);

          lfRemoteApiAlignmentService.setObjectAlignment(lfAppStateStore.deviceSelected.serialNumber, lfAlignmentPoints);
        } else if (vecTL && vecTR && vecBL && vecBR) {
          // we have initialized the svg outline
          sketch.push();
          sketch.fill(sketch.color(0, 0, 0, 0)); // This enables alpha blending so images with alpha images actually have transparency
          sketch.shader(perspectiveShader);
          const homography = lfComputePerspectiveWarp([
            [vecTL.x, vecTL.y],
            [vecTR.x, vecTR.y],
            [vecBR.x, vecBR.y],
            [vecBL.x, vecBL.y],
          ]);
          perspectiveShader.setUniform('homography', homography);
          perspectiveShader.setUniform('texture', p5SvgOutlineImg);
          perspectiveShader.setUniform('resolution', [props.p5CanvasSize.width, props.p5CanvasSize.height]);
          sketch.quad(vecTL.x, vecTL.y, vecTR.x, vecTR.y, vecBR.x, vecBR.y, vecBL.x, vecBL.y);
          sketch.resetShader();
          sketch.pop();

          this.draggableService.drawDrag();
        }
      }

      // Environment OctoMask
      if (props.octoMask) {
        if (octoMaskInitialized) {
          //draw it
          this.lfP5DrawService.drawAlignmentPath(props.octoMask, this.p5CanvasSize);
          sketch.push();
          this.draggableService.drawDrag();
          sketch.pop();
        } else {
          // initialize it once
          console.log({ vecTL, vecTM, vecTR, vecRM, vecBR, vecBM, vecBL, vecLM });
          ({ vecTL, vecTM, vecTR, vecRM, vecBR, vecBM, vecBL, vecLM } = this.lfP5DrawService.createDragPoints(props.octoMask, this.p5CanvasSize));
          octoMaskInitialized = true;
        }
      }

      if (this.debugCorners) {
        this.p5RenderDebugCorners(sketch);
      }
    };
    // end p5.Draw

    sketch.windowResized = () => {
      this.resetCanvasSize();
      sketch.resizeCanvas(this.p5CanvasSize.width, this.p5CanvasSize.height);
    };

    // Mouse/Touch Events
    sketch.mousePressed = (event: MouseEvent) => {
      this.draggableService.updateCursor();
      onPress(event);
    };

    sketch.touchStarted = (event: TouchEvent) => {
      onPress(event);
    };

    sketch.mouseReleased = (event: MouseEvent) => {
      onRelease(event);
    };

    sketch.touchEnded = (event: TouchEvent) => {
      onRelease(event);
    };

    sketch.mouseDragged = async () => {
      onDrag();
    };

    sketch.touchMoved = () => {
      onDrag();
    };

    const onDrag = () => {
      this.draggableService.dragMouseDragged();

      if (this.draggableService.selectedIndex !== -1 && sketch.frameCount % 20 === 0) {
        // fake throttling
        this.updateAlignment(this.draggableService.draggablePoints);
      }
    };

    const onPress = (event: MouseEvent | TouchEvent) => {
      if (event.target === this.hostElement) {
        this.draggableService.dragMousePressed();
        event.stopPropagation();
        event.preventDefault();
      }
    };

    const onRelease = (event: Event) => {
      if (this.draggableService.selectedIndex !== -1 && event.target === this.hostElement) {
        this.updateAlignment(this.draggableService.draggablePoints);
      }
      this.draggableService.dragMouseReleased();
    };
  }
  // end this.p5Sketch
  // ----------------------

  private updateAlignment(points: Array<p5.Vector>) {
    if (lfAlignmentStateStore.scanType === 'object') {
      this.updateObjectAlignmentPreview(points);
    } else {
      // todo
    }
  }

  private resizeVectorsToLf(vectors: Array<p5.Vector>): LfMaskPath {
    return vectors.map(xyPoint => {
      const x = lfAlignmentService.p5PointToLfValue(xyPoint.x, 'x', this.p5CanvasSize);
      const y = lfAlignmentService.p5PointToLfValue(xyPoint.y, 'y', this.p5CanvasSize);
      return [x, y];
    });
  }

  private updateObjectAlignmentPreview(points: Array<p5.Vector>) {
    const objectCornerPoints = this.resizeVectorsToLf(points);
    debounce(lfRemoteApiAlignmentService.setObjectAlignment(lfAppStateStore.deviceSelected.serialNumber, objectCornerPoints), 400);
  }

  private p5RenderDebugCorners(lfp5: p5) {
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
  }

  // ==== RENDERING SECTION =======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <Host class={`lf-scene-alignment--container`}>
        <div ref={el => (this.p5Canvas = el as HTMLElement)} id="p5js-canvas-wrapper"></div>
      </Host>
    );
  }
}

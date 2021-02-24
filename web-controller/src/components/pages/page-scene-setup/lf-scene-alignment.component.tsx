// ==== Library Imports =======================================================
import { Component, Element, h, Prop, Watch } from '@stencil/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

// ==== App Imports ===========================================================
import LfLoggerService from '../../../shared/services/lf-logger.service';
import { LfMaskPath } from '../../../shared/services/lf-remote-api/lf-remote-api-alignment.service';
import { mapValue } from '../../../shared/services/lf-utils.service';
import lfAppStateStore from '../../../store/lf-app-state.store';

@Component({
  tag: 'lf-scene-alignment',
  styleUrls: ['lf-scene-alignment.component.scss'],
  shadow: true,
})
export class LfSceneAlignment {
  // ==== OWN PROPERTIES SECTION ==================================================================
  // ---- Private  --------------------------------------------------------------------------------
  private log = new LfLoggerService('LfSceneAlignment').logger;

  // Scene Properties
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private threeCanvasElem: HTMLElement;
  private lfOrbitControls: OrbitControls;
  private lfDragControls: DragControls;
  private group: THREE.Group;

  private readonly objects: Array<THREE.Object3D> = [];
  private readonly mouse = new THREE.Vector2();
  private readonly raycaster = new THREE.Raycaster();

  // Alignment Elements
  private scanImageMesh: THREE.Mesh;
  private maskPathShape: THREE.ShapePath;
  private alignmentControlBox: THREE.BoxHelper;
  private svgOutlineObject: THREE.Group;
  private svgOutlineObjectGroup: THREE.Object3D;

  // private raycaster: THREE.Raycaster;
  private enableSelection = true;

  // private dragControls: DragControls;

  private readonly rawImageDimension = {
    width: 2592,
    height: 1944,
  };

  private readonly aspectRatio = this.rawImageDimension.width / this.rawImageDimension.height;

  private canvasSize = {
    width: 500,
    height: 500 / this.aspectRatio,
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

  // ==== EVENTS SECTION ==========================================================================

  // ==== COMPONENT LIFECYCLE EVENTS ==============================================================
  public async componentWillLoad() {
    this.log.debug('componentWillLoad');

    if (this.isMobileLayout) {
      if (this.canvasWidth > 250) {
        this.canvasWidth = 250;
      }
    } else {
      if (this.canvasWidth > 500) {
        this.canvasWidth = 500;
      }
    }

    this.canvasSize = {
      width: this.canvasWidth,
      height: this.canvasWidth / this.aspectRatio,
    };

    console.warn(this.canvasSize);
  }

  public async componentDidLoad() {
    this.log.info('componentDidLoad');

    this.init();
    this.animate();
  }

  // ==== LISTENERS SECTION =======================================================================

  @Watch('maskPath')
  onMaskPathChange(newValue: LfMaskPath) {
    this.log.warn('onMaskPathChange');
    if (newValue) {
      this.addMaskShape();
    }
    // this.animate();
  }

  @Watch('scanImgUrl')
  onScanImgUrlChange(newValue: string) {
    this.log.debug('onScanImgUrlChange');
    if (newValue) {
      this.renderThreeJsImage(this.scanImgUrl, 1);
    }
    // this.animate();
  }

  @Watch('lfObjectOutlineImageUrl')
  onLfObjectOutlineImageUrlChange(newValue: string) {
    this.log.debug('onLfObjectOutlineImageUrlChange');
    if (newValue) {
      // this.renderThreeJsImage(this.lfObjectOutlineImageUrl, 'foreground', 0.5);
      console.log(this.lfObjectOutlineImageUrl);
      this.loadSVG(this.lfObjectOutlineImageUrl);
    }
    // this.animate();
  }

  // ==== PUBLIC METHODS API - @Method() SECTION ==================================================
  // ==== LOCAL METHODS SECTION ===================================================================

  private init() {
    // THREE.JS Scene Set UP
    // renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvasSize.width, this.canvasSize.height);
    // make sure we don't somehow keep creating more instances of the scene
    this.threeCanvasElem.innerHTML = '';
    this.threeCanvasElem.appendChild(this.renderer.domElement);

    // scene
    this.scene = new THREE.Scene();

    // camera
    var aspect = this.canvasSize.width / this.canvasSize.height;
    var d = 100;
    this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    this.camera.position.set(0, 0, 500);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Scene Additions
    this.renderSceneLighting();
    this.renderGridBackground();
    this.renderThreeJsImage(this.scanImgUrl, 1);
    this.addMaskShape();

    this.addSceneControls();
  }

  private addSceneControls() {
    // Orbit Controls
    this.lfOrbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.lfOrbitControls.addEventListener('change', () => {
      this.onControlUpdate(this.renderer, this.scene, this.camera);
    });
    this.lfOrbitControls.enableRotate = false;
    this.lfOrbitControls.screenSpacePanning = true;
    this.lfOrbitControls.enableZoom = true;
    this.lfOrbitControls.enablePan = true;
    this.lfOrbitControls.zoomSpeed = 0.5;
    this.lfOrbitControls.panSpeed = 0.5;
    this.lfOrbitControls.keyPanSpeed = 20;

    // Drag Controls
    this.lfDragControls = new DragControls([...this.objects], this.camera, this.renderer.domElement);
    this.lfDragControls.addEventListener('drag', () => {
      console.log('DRAG');
      this.onControlUpdate(this.renderer, this.scene, this.camera);
    });

    //

    // window.addEventListener('resize', this.onWindowResize);

    document.addEventListener('click', () => {
      this.onClick(event);
      this.onControlUpdate(this.renderer, this.scene, this.camera);
    });
    // window.addEventListener('keydown', this.onKeyDown);
    // window.addEventListener('keyup', this.onKeyUp);
  }

  private onClick(event) {
    event.preventDefault();

    if (this.enableSelection === true) {
      const draggableObjects = this.lfDragControls.getObjects();
      console.log(draggableObjects);
      draggableObjects.length = 0;

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const intersections = this.raycaster.intersectObjects(this.objects, true);
      console.log('intersections');
      console.log(intersections);

      if (intersections.length > 0) {
        const object = intersections[0].object;

        if (this.group.children.includes(object) === true) {
          console.log('SELECT OBJECT');
          // (object as any).material.emissive.set(0x000000);
          this.scene.attach(object);
        } else {
          console.log('DESELECT OBJECT');
          // (object as any).material.emissive.set(0xaaaaaa);
          this.group.attach(object);
        }

        this.lfDragControls.transformGroup = true;
        draggableObjects.push(this.group);
      }

      if (this.group.children.length === 0) {
        this.lfDragControls.transformGroup = false;
        draggableObjects.push(...this.objects);
      }
    }

    // this.render();
    // renderer.render(scene, camera);
  }

  private renderSceneLighting() {
    // ambient
    this.scene.add(new THREE.AmbientLight(0x444444));

    // light
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 0, 500);
    this.scene.add(light);
  }

  private renderGridBackground() {
    // axes
    this.scene.add(new THREE.AxesHelper(40));

    // grid
    const geometryGrid = new THREE.PlaneGeometry(this.canvasSize.width * 2, this.canvasSize.height * 2, this.canvasSize.width / 10, this.canvasSize.height / 10);
    const materialGrid = new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.4, transparent: true, color: 0xffffff });
    const grid = new THREE.Mesh(geometryGrid, materialGrid);
    grid.position.set(0, 0, -1);
    this.scene.add(grid);

    // 3D Box Background - to help navigate 3d space when we need to
    const geometryBox = new THREE.BoxGeometry(this.canvasSize.width, this.canvasSize.height, 50);
    const materialBox = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometryBox, materialBox);
    mesh.position.set(0, 0, -50);
    this.scene.add(mesh);
  }

  private onControlUpdate(renderer: THREE.Renderer, scene: THREE.Scene, camera: THREE.OrthographicCamera) {
    console.log('onControlUpdate');
    renderer.render(scene, camera);
  }

  private addMaskShape() {
    this.log.debug('addMaskShape');
    if (!this.maskPath?.length) {
      return;
    }

    this.maskPathShape = new THREE.ShapePath();
    this.maskPath.map((pointXY, index: number) => {
      const x = mapValue(pointXY[0], 0, 1000, -this.canvasSize.width / 2, this.canvasSize.width / 2);
      const y = mapValue(pointXY[1], 0, 1000, -this.canvasSize.height / 2, this.canvasSize.height / 2);
      if (index === 0) {
        this.maskPathShape.moveTo(x, y);
      } else {
        this.maskPathShape.lineTo(x, y);
      }
    });

    const shapes = this.maskPathShape.toShapes(true);

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      const material = new THREE.MeshBasicMaterial({
        opacity: 0.8,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        color: 0x2c65ff,
      });

      const geometry = new THREE.ShapeBufferGeometry(shape);

      // the shape needs to be flipped over the X
      geometry.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1));

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 4);
      this.scene.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000ed4 }));
      line.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, 1));
      line.position.set(0, 0, 5);
      this.scene.add(line);
    }
  }

  private renderThreeJsImage(imgUrl: string, scale: number = 1) {
    this.log.debug('renderThreeJsImage');

    // Create a texture loader so we can load our image file

    if (!imgUrl) {
      console.log('No image url');
      return;
    }

    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshLambertMaterial({
      map: loader.load(imgUrl),
    });

    const geometry = new THREE.PlaneGeometry(this.canvasSize.width * scale, this.canvasSize.height * scale);
    this.scanImageMesh = new THREE.Mesh(geometry, material);
    this.scanImageMesh.position.set(0, 0, 0);
    this.scene.add(this.scanImageMesh);
  }

  private loadSVG(url: string) {
    this.log.info('loadSVG');

    const loader = new SVGLoader();
    this.svgOutlineObjectGroup = new THREE.Object3D();

    loader.load(url, data => {
      const paths = data.paths;

      const svgGroup = new THREE.Group();
      svgGroup.scale.multiplyScalar(0.05);
      svgGroup.position.x = -this.canvasSize.width / 4;
      svgGroup.position.y = -this.canvasSize.height / 4;

      const meshConfig = {
        drawFillShapes: true,
        fillShapesWireframe: false,
        drawStrokes: true,
        strokesWireframe: true,
      };

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];

        if (meshConfig.drawFillShapes) {
          const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setStyle('white'),
            opacity: 0.2,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            wireframe: meshConfig.fillShapesWireframe,
          });

          const shapes = path.toShapes(true);

          for (let j = 0; j < shapes.length; j++) {
            const shape = shapes[j];

            const geometry = new THREE.ShapeGeometry(shape);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = `SVG Shape Filling ${i}-${j}`;

            svgGroup.add(mesh);
            this.svgOutlineObjectGroup.add(mesh);
          }
        }

        if (meshConfig.drawStrokes) {
          const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setStyle('red'),
            opacity: 1,
            transparent: false,
            side: THREE.DoubleSide,
            depthWrite: true,
            wireframe: meshConfig.strokesWireframe,
            wireframeLinewidth: 10,
          });

          for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
            const subPath = path.subPaths[j];

            const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style);

            if (geometry) {
              const mesh = new THREE.Mesh(geometry, material);
              mesh.name = `SVG Outline ${i}-${j}`;
              svgGroup.add(mesh);
              this.svgOutlineObjectGroup.add(mesh);
            }
          }
        }
      }

      this.svgOutlineObject = svgGroup;
      this.svgOutlineObject.name = 'SVG Group';

      this.alignmentControlBox = new THREE.BoxHelper(svgGroup, 'blue');
      this.svgOutlineObjectGroup.add(this.alignmentControlBox);

      // this.svgOutlineObjectGroup.add(svgGroup);
      // this.svgOutlineObjectGroup.add(this.alignmentControlBox);

      this.objects.push(this.svgOutlineObjectGroup);
      this.scene.add(this.svgOutlineObjectGroup);
      console.log(this.svgOutlineObjectGroup);

      // this.scene.add(this.alignmentControlBox);

      // this.objects.push(this.svgOutlineObject);

      // this.svgOutlineObject.matrix.elements

      // bounding box
    });
  }

  private animate() {
    requestAnimationFrame(() => {
      this.animate();
    });

    this.renderer.render(this.scene, this.camera);
  }

  // ==== RENDERING SECTION =======================================================================
  // - -  render Implementation - Do Not Rename  - - - - - - - - - - - - - - - - - - - - - - - - -
  public render() {
    return (
      <div class={`lf-scene-alignment--container`}>
        <div ref={el => (this.threeCanvasElem = el as HTMLElement)} id="threejs-canvas-wrapper"></div>
      </div>
    );
  }
}

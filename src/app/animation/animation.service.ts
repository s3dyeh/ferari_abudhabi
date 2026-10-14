import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createRoadSigns, orientRoadSigns, signApproachSpeed } from './road-signs';
import { createTrackCurve, groundHeight } from './track';

import { approachDrivingSpeed, targetDrivingSpeed } from './vehicle-motion';

@Injectable()
export class AnimationService {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(43, 1, 0.1, 1400);
  private renderer?: THREE.WebGLRenderer;
  private canvas?: HTMLCanvasElement;
  private curve = createTrackCurve();
  private vehicle = new THREE.Group();
  private chassis = new THREE.Group();
  private speed = 0;
  private acceleration = 0;
  private turnCurvature = 0;
  private trackLength = this.curve.getLength();
  private pose = new THREE.Object3D();
  private roadSigns = new THREE.Group();
  private modelRequested = false;
  private fallbackCar = new THREE.Group();
  private night = false;
  private ambient = new THREE.HemisphereLight('#fff1d1', '#8c6642', 2.8);
  private sunlight = new THREE.DirectionalLight('#ffdfab', 3.5);
  private frame = 0;
  private lastTime = 0;
  private lastRenderTime = 0;
  private progress = 0.08;
  private paused = true;
  private disposed = false;
  private mode: 'overview' | 'ride' = 'overview';
  private pointer = new THREE.Vector2();
  private targetCamera = new THREE.Vector3();
  private targetLook = new THREE.Vector3();
  private currentLook = new THREE.Vector3(0, 30, 0);
  private fixedAccumulator = 0;

  async initialize(canvas: HTMLCanvasElement): Promise<void> {
    this.canvas = canvas;
    this.scene.background = new THREE.Color('#e8dfcd');
    this.scene.fog = new THREE.FogExp2('#e5d9c3', 0.0027);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, canvas.clientWidth < 700 ? 1.25 : 1.7),
    );
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Cache shadows until lighting or the camera-facing sign boards change.
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
    this.createLighting();
    await this.yieldToBrowser();
    if (this.disposed) return;
    this.createTerrain();
    await this.yieldToBrowser();
    if (this.disposed) return;
    this.createTrack();
    this.roadSigns = createRoadSigns(this.curve);
    this.scene.add(this.roadSigns);
    this.createVehicle();
    this.scene.add(this.vehicle);
    this.resize(false);
    this.positionVehicle();
    this.positionCamera(1, true);
    // Compile shaders asynchronously where parallel compilation is available.
    // The sun, clock, and portfolio remain responsive while the scene prepares.
    await this.renderer.compileAsync(this.scene, this.camera);
    if (this.disposed) return;
    this.render();
  }

  private yieldToBrowser(): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  setNight(night: boolean): void {
    if (this.night === night) return;
    this.night = night;
    this.scene.background = new THREE.Color(night ? '#171f2b' : '#e8dfcd');
    this.scene.fog = new THREE.FogExp2(night ? '#202a38' : '#e5d9c3', 0.0027);
    this.ambient.color.set(night ? '#a9c4ed' : '#fff1d1');
    this.ambient.groundColor.set(night ? '#303a50' : '#8c6642');
    this.ambient.intensity = night ? 1.2 : 2.8;
    this.sunlight.color.set(night ? '#b8d2ff' : '#ffdfab');
    this.sunlight.intensity = night ? 1.1 : 3.5;
    if (this.renderer) {
      this.renderer.toneMappingExposure = night ? 0.85 : 1.15;
      this.renderer.shadowMap.needsUpdate = true;
      this.render();
    }
  }

  private createLighting(): void {
    this.scene.add(this.ambient);
    const sun = this.sunlight;
    sun.position.set(100, 105, -80);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -120;
    sun.shadow.camera.right = 120;
    sun.shadow.camera.top = 120;
    sun.shadow.camera.bottom = -120;
    sun.shadow.camera.far = 400;
    sun.shadow.normalBias = 0.12;
    sun.shadow.bias = -0.0001;
    this.scene.add(sun);
  }

  private createTerrain(): void {
    const geometry = new THREE.PlaneGeometry(1500, 1500, 100, 100);
    geometry.rotateX(-Math.PI / 2);
    const positions = geometry.attributes['position'];
    const colors: number[] = [];
    const low = new THREE.Color('#b6946e');
    const high = new THREE.Color('#e1c298');
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i),
        z = positions.getZ(i);
      const height = groundHeight(x, z);
      positions.setY(i, height);
      const color = low.clone().lerp(high, THREE.MathUtils.clamp((height + 6) / 25, 0, 1));
      colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    const terrain = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
    );
    terrain.receiveShadow = true;
    this.scene.add(terrain);
  }

  private createTrack(): void {
    const red = new THREE.MeshStandardMaterial({
      color: '#9c3324',
      metalness: 0.42,
      roughness: 0.45,
    });
    const steel = new THREE.MeshStandardMaterial({
      color: '#746959',
      metalness: 0.45,
      roughness: 0.65,
    });
    const points = this.curve.getSpacedPoints(250);
    const left: THREE.Vector3[] = [],
      right: THREE.Vector3[] = [],
      spine: THREE.Vector3[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const t = i / (points.length - 1);
      const tangent = this.curve.getTangentAt(t, new THREE.Vector3());
      const side = new THREE.Vector3()
        .crossVectors(tangent, new THREE.Vector3(0, 1, 0))
        .normalize();
      left.push(points[i].clone().addScaledVector(side, 1.15));
      right.push(points[i].clone().addScaledVector(side, -1.15));
      spine.push(points[i].clone().add(new THREE.Vector3(0, -0.85, 0)));
    }
    for (const [index, railPoints] of [left, right, spine].entries()) {
      const path = new THREE.CatmullRomCurve3(railPoints, true);
      const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(path, 600, index === 2 ? 0.26 : 0.16, 6, true),
        red,
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
    const tieCount = 270;
    const ties = new THREE.InstancedMesh(new THREE.BoxGeometry(2.7, 0.15, 0.22), red, tieCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < tieCount; i++) {
      const t = i / tieCount;
      const point = this.curve.getPointAt(t, new THREE.Vector3());
      dummy.position.copy(point);
      dummy.lookAt(point.clone().add(this.curve.getTangentAt(t, new THREE.Vector3())));
      dummy.updateMatrix();
      ties.setMatrixAt(i, dummy.matrix);
    }
    ties.castShadow = true;
    this.scene.add(ties);
    const supportCount = 62;
    const supports = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.2, 0.3, 1, 7),
      steel,
      supportCount * 2,
    );
    const footings = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.8, 0.9, 0.35, 8),
      new THREE.MeshStandardMaterial({ color: '#b4a38a', roughness: 0.95 }),
      supportCount * 2,
    );
    for (let i = 0; i < supportCount; i++) {
      const t = i / supportCount;
      const point = this.curve.getPointAt(t, new THREE.Vector3());
      const side = new THREE.Vector3()
        .crossVectors(this.curve.getTangentAt(t), new THREE.Vector3(0, 1, 0))
        .normalize();
      for (let j = 0; j < 2; j++) {
        const p = point.clone().addScaledVector(side, j ? 1.05 : -1.05);
        const base = groundHeight(p.x, p.z);
        dummy.position.set(p.x, (p.y + base) / 2, p.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, p.y - base, 1);
        dummy.updateMatrix();
        supports.setMatrixAt(i * 2 + j, dummy.matrix);
        dummy.position.y = base + 0.15;
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        footings.setMatrixAt(i * 2 + j, dummy.matrix);
      }
    }
    supports.castShadow = true;
    this.scene.add(supports, footings);
  }

  private createVehicle(): void {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.65, 3.6),
      new THREE.MeshStandardMaterial({ color: '#b7271e', metalness: 0.6, roughness: 0.3 }),
    );
    body.position.y = 0.5;
    this.fallbackCar.add(body);
    const cockpit = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.45, 1.3),
      new THREE.MeshStandardMaterial({ color: '#242621', roughness: 0.35 }),
    );
    cockpit.position.set(0, 1, -0.25);
    this.fallbackCar.add(cockpit);
    this.chassis.add(this.fallbackCar);
    this.vehicle.add(this.chassis);
  }

  private loadModel(): void {
    new GLTFLoader().load(
      '/rb6.glb',
      (gltf) => {
        if (this.disposed) {
          this.disposeObject(gltf.scene);
          return;
        }
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3());
        const scale = 5.5 / Math.max(size.x, size.y, size.z);
        const center = box.getCenter(new THREE.Vector3());
        const wrapper = new THREE.Group();
        gltf.scene.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
        gltf.scene.scale.setScalar(scale);
        gltf.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = false;
            object.receiveShadow = true;
          }
        });
        wrapper.add(gltf.scene);
        wrapper.position.y = 0.15;
        this.chassis.remove(this.fallbackCar);
        this.disposeObject(this.fallbackCar);
        this.chassis.add(wrapper);
        this.render();
      },
      undefined,
      () => {
        // Keep the lightweight local car when the optional model cannot load.
      },
    );
  }

  setMode(mode: 'overview' | 'ride', immediate = false): void {
    if (!this.modelRequested && !this.disposed) {
      this.modelRequested = true;
      this.loadModel();
    }
    const changed = this.mode !== mode;
    this.mode = mode;
    this.roadSigns.visible = true;
    if (changed || immediate) {
      this.pointer.set(0, 0);
      if (immediate) {
        this.positionCamera(1, true);
        this.render();
      }
    }
  }

  setPaused(paused: boolean): void {
    if (this.disposed || this.paused === paused) return;
    this.paused = paused;
    if (paused) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    } else {
      this.lastTime = 0;
      this.lastRenderTime = 0;
      this.frame = requestAnimationFrame(this.animate);
    }
  }

  setPointer(x: number, y: number): void {
    const rect = this.canvas?.getBoundingClientRect();
    if (!rect) return;
    this.pointer.set(
      ((x - rect.left) / rect.width - 0.5) * 2,
      ((y - rect.top) / rect.height - 0.5) * 2,
    );
  }
  resetPointer(): void {
    this.pointer.set(0, 0);
  }

  resize(render = true): void {
    if (!this.canvas || !this.renderer || this.disposed) return;
    const width = this.canvas.clientWidth,
      height = this.canvas.clientHeight;
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.positionCamera(1, true);
    if (render) this.render();
  }

  private animate = (now: number): void => {
    if (this.paused || this.disposed) return;
    const interval = this.mode === 'overview' ? 1000 / 30 : 1000 / 60;
    if (now - this.lastRenderTime < interval - 0.5) {
      this.frame = requestAnimationFrame(this.animate);
      return;
    }
    this.lastRenderTime = now;
    const dt = this.lastTime ? Math.min((now - this.lastTime) / 1000, 0.05) : 0;
    this.lastTime = now;
    // Fixed simulation steps make the path independent of monitor refresh rate.
    this.fixedAccumulator += dt;
    while (this.fixedAccumulator >= 1 / 120) {
      this.advanceVehicle(1 / 120);
      this.fixedAccumulator -= 1 / 120;
    }
    this.positionVehicle(dt);
    this.positionCamera(dt);
    this.render();
    this.frame = requestAnimationFrame(this.animate);
  };

  private advanceVehicle(dt: number): void {
    const tangent = this.curve.getTangentAt(this.progress);
    const ahead = this.curve.getTangentAt((this.progress + 5 / this.trackLength) % 1);
    const turn = Math.atan2(tangent.z * ahead.x - tangent.x * ahead.z, tangent.x * ahead.x + tangent.z * ahead.z);
    this.turnCurvature = turn / 5;
    const desired = targetDrivingSpeed(this.turnCurvature, tangent.y,
      this.mode === 'ride' ? signApproachSpeed(this.progress) : 1);
    const previousSpeed = this.speed;
    this.speed = approachDrivingSpeed(this.speed, desired, dt);
    this.acceleration = (this.speed - previousSpeed) / dt;
    this.progress = (this.progress + this.speed * dt / this.trackLength) % 1;
  }

  private positionVehicle(dt = 0): void {
    const halfWheelbase = 1.6 / this.trackLength;
    const front = this.curve.getPointAt((this.progress + halfWheelbase) % 1);
    const rear = this.curve.getPointAt((this.progress - halfWheelbase + 1) % 1);
    this.vehicle.position.copy(front).add(rear).multiplyScalar(.5);
    this.pose.position.copy(this.vehicle.position);
    this.pose.lookAt(front);
    const steering = dt ? 1 - Math.exp(-dt * 16) : 1;
    this.vehicle.quaternion.slerp(this.pose.quaternion, steering);
    const suspension = dt ? 1 - Math.exp(-dt * 7) : 1;
    const roll = THREE.MathUtils.clamp(-this.turnCurvature * this.speed * this.speed * .012, -.045, .045);
    const pitch = THREE.MathUtils.clamp(-this.acceleration * .007, -.025, .025);
    this.chassis.rotation.z = THREE.MathUtils.lerp(this.chassis.rotation.z, roll, suspension);
    this.chassis.rotation.x = THREE.MathUtils.lerp(this.chassis.rotation.x, pitch, suspension);
  }

  private positionCamera(dt: number, immediate = false): void {
    if (this.mode === 'overview') {
      const portrait = this.camera.aspect < 1;
      this.targetCamera.set(portrait ? 160 : 143, portrait ? 140 : 100, portrait ? 215 : 175);
      this.targetCamera.x += this.pointer.x * 12;
      this.targetCamera.y += this.pointer.y * 5;
      this.targetLook.set(portrait ? -10 : -12, portrait ? 68 : 55, 0);
    } else {
      const point = this.curve.getPointAt(this.progress, new THREE.Vector3());
      // Follow the actual path behind the car instead of cutting across tight corners.
      this.targetCamera
        .copy(this.curve.getPointAt((this.progress - 9 / this.trackLength + 1) % 1))
        .add(new THREE.Vector3(this.pointer.x * 2, 4.2 + this.pointer.y, 0));
      this.targetCamera.y = Math.max(this.targetCamera.y, point.y + 2.5);
      this.targetLook
        .copy(this.curve.getPointAt((this.progress + (5 + this.speed * .35) / this.trackLength) % 1))
        .add(new THREE.Vector3(0, 1, 0));
    }
    const amount = immediate ? 1 : 1 - Math.exp(-dt * (this.mode === 'ride' ? 8 : 4));
    this.camera.position.lerp(this.targetCamera, amount);
    this.currentLook.lerp(this.targetLook, amount);
    this.camera.lookAt(this.currentLook);
  }

  private render(): void {
    if (!this.disposed) {
      const signsChanged = orientRoadSigns(this.roadSigns, this.mode === 'overview', this.camera.position);
      if (signsChanged && this.renderer) this.renderer.shadowMap.needsUpdate = true;
      this.renderer?.render(this.scene, this.camera);
    }
  }

  private disposeObject(root: THREE.Object3D): void {
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    root.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      geometries.add(object.geometry);
      const all = Array.isArray(object.material) ? object.material : [object.material];
      all.forEach((material) => {
        materials.add(material);
        Object.values(material).forEach((value) => {
          if (value instanceof THREE.Texture) textures.add(value);
        });
      });
      if (object instanceof THREE.InstancedMesh) object.dispose();
    });
    textures.forEach((texture) => texture.dispose());
    materials.forEach((material) => material.dispose());
    geometries.forEach((geometry) => geometry.dispose());
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.disposeObject(this.scene);
    this.scene.traverse((object) => {
      if (object instanceof THREE.Light && 'shadow' in object)
        (object as THREE.DirectionalLight).shadow?.dispose();
    });
    this.scene.clear();
    this.renderer?.dispose();
    this.renderer = undefined;
  }
}

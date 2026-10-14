import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { AnimationService } from './animation.service';

const renderState = vi.hoisted(() => ({
  render: vi.fn(),
  dispose: vi.fn(),
  modelLoaded: undefined as undefined | ((value: { scene: unknown }) => void),
}));
vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal<typeof import('three')>();
  return Object.assign({}, actual, {
    WebGLRenderer: class {
      shadowMap = {};
      setPixelRatio = vi.fn();
      setSize = vi.fn();
      compileAsync = vi.fn().mockResolvedValue(undefined);
      render = renderState.render;
      dispose = renderState.dispose;
    },
  });
});
vi.mock('three/examples/jsm/loaders/GLTFLoader.js', () => ({
  GLTFLoader: class {
    load(_url: string, loaded: (value: { scene: unknown }) => void) {
      renderState.modelLoaded = loaded;
    }
  },
}));

describe('Scene lifecycle', () => {
  let service: AnimationService;
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.stubGlobal('requestAnimationFrame', vi.fn().mockReturnValue(42));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    service = new AnimationService();
    const canvas = document.createElement('canvas');
    Object.defineProperties(canvas, { clientWidth: { value: 1440 }, clientHeight: { value: 900 } });
    await service.initialize(canvas);
    service.setMode('ride');
  });
  afterEach(() => {
    service.dispose();
    vi.unstubAllGlobals();
  });

  it('keeps road signs visible in both camera modes', () => {
    service.setMode('overview', true);
    const scene = renderState.render.mock.lastCall?.[0] as THREE.Scene;
    expect(scene.getObjectByName('road-signs')?.visible).toBe(true);
    service.setMode('ride', true);
    expect(scene.getObjectByName('road-signs')?.visible).toBe(true);
  });

  it('stops the frame loop while paused and restarts only once', () => {
    service.setPaused(false);
    service.setPaused(false);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    service.setPaused(true);
    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
    service.setPaused(false);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
  });

  it('disposes textures, materials, and geometry if a model arrives after teardown', () => {
    service.dispose();
    const geometry = new THREE.BoxGeometry();
    const texture = new THREE.Texture();
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const geometryDispose = vi.spyOn(geometry, 'dispose');
    const textureDispose = vi.spyOn(texture, 'dispose');
    const materialDispose = vi.spyOn(material, 'dispose');
    const group = new THREE.Group().add(new THREE.Mesh(geometry, material));
    renderState.modelLoaded?.({ scene: group });
    expect(geometryDispose).toHaveBeenCalledOnce();
    expect(textureDispose).toHaveBeenCalledOnce();
    expect(materialDispose).toHaveBeenCalledOnce();
    expect(renderState.dispose).toHaveBeenCalledOnce();
  });

  it('releases loaded model resources and the renderer on teardown', () => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial();
    const geometryDispose = vi.spyOn(geometry, 'dispose');
    const materialDispose = vi.spyOn(material, 'dispose');
    renderState.modelLoaded?.({ scene: new THREE.Group().add(new THREE.Mesh(geometry, material)) });
    service.dispose();
    expect(geometryDispose).toHaveBeenCalledOnce();
    expect(materialDispose).toHaveBeenCalledOnce();
    expect(renderState.dispose).toHaveBeenCalledOnce();
  });
});

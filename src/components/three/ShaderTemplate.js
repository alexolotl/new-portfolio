import * as THREE from 'three'

// TODO AEZ clean up this shader template

export default class World {

  constructor(domElement, vertex, fragment) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x000000);
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.uniforms = {};
    this.camera = null;
    domElement.appendChild(this.renderer.domElement);
    this.domElement = domElement;
    this.initCamera();

    this.addShader();

    this.vertex = vertex;
    this.fragment = fragment;

    this.resize();

    this.animationFrameId = null;

    requestAnimationFrame(this.render.bind(this));
    // window.addEventListener('resize', this.resize.bind(this));
  }

  update() {
    this.uniforms.time.value += 0.005;
  }

  onTexLoad(texture) {
    this.uniforms.textureSampler.value = texture;

    let plane = new THREE.PlaneBufferGeometry(2,2);

    let material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertex,
      fragmentShader: this.fragment
    });

    let shader = new THREE.Mesh( plane, material );
    this.scene.add(shader);

  };
  addShader() {

    this.uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
      mouse: { type: "v2", value: new THREE.Vector2() },
      drag: { type: "v2", value: new THREE.Vector2(0,0) },
      scale: { type: "f", value: 0.0 },
      textureSampler: { type: "t", value: null }
    };

    this.loader = new THREE.TextureLoader();
    this.loader.setCrossOrigin("anonymous");
    this.loader.load("https://s3.amazonaws.com/codepen-az/dino-2.jpg", this.onTexLoad.bind(this));
  }

  cleanupScene = () => {
    this.scene = null;
    this.projector = null;
    this.camera = null;
    this.controls = null;
    this.domElement.removeChild(this.renderer.domElement)
    cancelAnimationFrame( this.animationFrameId )
    this.renderer = null;
    // window.removeEventListener('resize', this.resize.bind(this))
  }

  render() {
    this.update();
    this.animationFrameId = requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 1;
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.uniforms.resolution.value.x = this.renderer.domElement.width;
		this.uniforms.resolution.value.y = this.renderer.domElement.height;
  }
}

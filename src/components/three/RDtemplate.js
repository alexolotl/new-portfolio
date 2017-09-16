import * as THREE from 'three'

const initFrag = `
    precision mediump float;
    uniform vec2 res;
		uniform highp sampler2D initTexture;

		void main() {
    	vec2 st = gl_FragCoord.xy / res.xy;

      //init with small circle at center
      float circle = step(.97,1.-length(st-.5));
      vec3 color = vec3(1.,circle,0.);

      color = texture2D(initTexture,st).xyz;

      gl_FragColor = vec4(color,0.);
		 }
`

const filterFrag = `
    precision mediump float;
    uniform vec2 res;
		uniform sampler2D bufferTexture;

    // This changes the colors of the output texture

		void main() {
    	vec2 st = gl_FragCoord.xy / res.xy;

      vec3 color = texture2D(bufferTexture, st).xyz;

      vec2 values = color.xy;

      vec3 col1 = vec3(1.);
      vec3 col2 = vec3(.0);

      vec3 outputCol = mix(col1,col2,values.y);
      outputCol = smoothstep(0.7,0.8,outputCol);

      gl_FragColor= vec4(outputCol,1.);
		 }
`

const feedbackShader = `
precision mediump float;
uniform vec2 res;
uniform sampler2D bufferTexture;
uniform float time;
uniform float timestep;
uniform float k;
uniform vec2 Diffusion;
uniform float F;

// Five point stencil Laplacian
vec4 laplacian5(sampler2D buf) {

  vec2 p = gl_FragCoord.xy,
   n = p + vec2(0.0, 1.0),
   e = p + vec2(1.0, 0.0),
   s = p + vec2(0.0, -1.0),
   w = p + vec2(-1.0, 0.0);

  return
  +  texture2D( buf, n / res)
  +  texture2D( buf, e / res)
  -  4.0 * texture2D( buf,  p / res )
  + texture2D( buf,  s / res )
  + texture2D( buf,  w / res );
}

// nine point stencil
vec4 laplacian9(sampler2D backbuffer, vec2 position) {

  vec2 pixelSize = 1.0/res;
  vec4 P = vec4(pixelSize, 0.0, -pixelSize.x);

  return
  0.5* texture2D( backbuffer,  position - P.xy )
  + texture2D( backbuffer,  position - P.zy )
  +  0.5* texture2D( backbuffer,  position - P.wy )
  +  texture2D( backbuffer,  position - P.xz)
  - 6.0* texture2D( backbuffer,  position )
  +   texture2D( backbuffer,  position + P.xz )
  +  0.5*texture2D( backbuffer,  position +P.wy)
  + texture2D( backbuffer,  position +P.zy )
  +   0.5*texture2D( backbuffer,  position + P.xy );
}

void main() {
  vec2 st = gl_FragCoord.xy / res;
  vec2 loopSt = fract(gl_FragCoord.xy/res);

  // time step for Gray-Scott system:
  vec2 val = texture2D(bufferTexture, st).xy;
  // vec2 laplacian = laplacian5(bufferTexture).xy; // laplacian5
  vec2 laplacian = laplacian9(bufferTexture, st).xy; // laplacian9
  float xyy = val.x*val.y*val.y;   // utility term
  vec2 dV = vec2( (.2*sin(st.x*12.+time/3.) + .8)*Diffusion.x * laplacian.x - xyy + F*(1.-val.x), (.2*sin(st.y*12.+time/3.) + .8)*Diffusion.y * laplacian.y + xyy - (F+k)*val.y);

  //vec2 dV = vec2( Diffusion.x * laplacian.x - xyy + F*(1.-val.x), Diffusion.y * laplacian.y + xyy - (F+k)*val.y);

  gl_FragColor = vec4(val + timestep*dV, 0., 0.);

}
`


export default class Scene {
  constructor(domElement, vertex, fragment) {
    this.scene = new THREE.Scene();
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    let width = this.canvasWidth;
    let height = this.canvasHeight;
    this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    this.camera.position.z = 2;
    this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
    this.renderer.setSize( this.canvasWidth, this.canvasHeight );
    domElement.appendChild( this.renderer.domElement );
    this.domElement = domElement;

    // this.stats = new Stats();
    // document.body.appendChild( this.stats.domElement );

    // this.geometries = {};
    // this.meshes = {};
    // this.materials = {};

    this.createInitBuffer();

    this.loadTextures();

    this.createBufferScene();

    this.setupGui();

    //window.addEventListener( 'resize', onWindowResize, false );
  };

  setupGui() {
    // this.gui = new dat.GUI();
    this.params = {iterations: 7};
    // this.gui.add(this.bufferMaterial.uniforms.timestep, 'value', 0, 2).name('timestep');
    // this.gui.add(this.bufferMaterial.uniforms.k, 'value', .005, .08).name('k');
    // this.gui.add(this.bufferMaterial.uniforms.F, 'value', 0.005, .08).name('F');
    // this.gui.add(this.bufferMaterial.uniforms.Diffusion.value, 'x', 0, .2).name('Dx');
    // this.gui.add(this.bufferMaterial.uniforms.Diffusion.value, 'y', 0, .2).name('Dy');
    // this.gui.add(this.params, 'iterations', 1,12).step(1).name('iterations');
  };

  createInitBuffer() {
    this.renderInit = true;
    this.planeGeo = new THREE.PlaneBufferGeometry( this.canvasWidth, this.canvasHeight );

    this.initScene = new THREE.Scene();
    this.initMaterial = new THREE.ShaderMaterial( {
      uniforms: {
        res : {type: 'v2',value:new THREE.Vector2(this.canvasWidth,this.canvasHeight)},
        initTexture: {type: "t", value: null}
      },
      fragmentShader: initFrag
    });
    this.initQuad = new THREE.Mesh(this.planeGeo, this.initMaterial);
    this.initScene.add(this.initQuad);
  };

  createBufferScene() {
    //Create buffer scene
    this.bufferScene = new THREE.Scene();
    //Create 2 buffer textures
    let filterType = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter};
    let filterType2 = {
      minFilter:THREE.NearestFilter,
      magFilter:THREE.NearestFilter,
      wrapS:THREE.ClampToEdgeWrapping,
      wrapT:THREE.ClampToEdgeWrapping,
      format:THREE.RGBAFormat,
      stencilBuffer:false,
      depthBuffer:false,
      needsUpdate:true,
      type:THREE.FloatType
    };
    this.textureA = new THREE.WebGLRenderTarget( this.canvasWidth, this.canvasHeight, filterType2 );
    this.textureB = new THREE.WebGLRenderTarget( this.canvasWidth, this.canvasHeight, filterType2 );
    //Pass textureA to shader
    this.bufferMaterial = new THREE.ShaderMaterial( {
      uniforms: {
        bufferTexture: { type: "t", value: this.textureA.texture },
        bufferPrev: { type: "t", value: this.textureB.texture },
        res : {type: 'v2',value:new THREE.Vector2(this.canvasWidth,this.canvasHeight)},//Keeps the resolution
        time: {type: "f", value: 0},
        timestep: {type: "f", value: .9},
        Diffusion: {type: "v2", value: new THREE.Vector2(.2,.1)},
        F: {type: 'f', value: .0545},
        k: {type: 'f', value: .062}
      },
      fragmentShader: feedbackShader
    } );
    this.bufferQuad = new THREE.Mesh( this.planeGeo, this.bufferMaterial );
    this.bufferScene.add(this.bufferQuad);

    //Draw textureB to screen
    this.outputMaterial = new THREE.ShaderMaterial( {
      uniforms: {
        bufferTexture: { type: "t", value: null },
        res : {type: 'v2',value: new THREE.Vector2(this.canvasWidth,this.canvasHeight)},
      },
      fragmentShader: filterFrag
    } );
    this.outputQuad = new THREE.Mesh( this.planeGeo, this.outputMaterial );
    this.scene.add( this.outputQuad );
  };

  render() {
    this.animationFrameId = requestAnimationFrame( this.render.bind(this) );

    if (this.renderInit) {
      this.renderer.render(this.initScene,this.camera,this.textureA,true);
      this.renderInit = false;
    }

    else {

      for (let i=0; i < this.params.iterations; i++)
      {
         //Draw to textureB
        this.renderer.render(this.bufferScene,this.camera,this.textureB,true);

        //Swap textureA and B
        let t = this.textureA;
        this.textureA = this.textureB;
        this.textureB = t;

        this.outputMaterial.uniforms.bufferTexture.value = this.textureA.texture;
        this.bufferMaterial.uniforms.bufferTexture.value = this.textureA.texture;
      }
    }

    this.bufferMaterial.uniforms.time.value += 0.05;
    // this.stats.update();

    this.renderer.render( this.scene, this.camera );
  };

  onTexLoad(texture) {
    console.log(texture);
    texture.minFilter = THREE.NearestFilter;
    console.log(this);
    this.initMaterial.uniforms.initTexture.value = texture;
    this.render();
  };

  loadTextures() {
    this.loader = new THREE.TextureLoader();
    this.loader.setCrossOrigin("anonymous");
    this.loader.load("https://s3.amazonaws.com/codepen-az/dino-2.jpg", this.onTexLoad.bind(this));
  };

  // makeScreenshot(event) {
  //   let imageURI = this.renderer.domElement.toDataURL("image/jpeg", 1.0);
  //
  //   this.renderer.domElement.toBlob((blob) => { // uses FileSaver.js
  //     saveAs(blob, 'shadercapture.jpg');
  //   }, "image/jpeg", 1.0);
  //
  //   // document.getElementById('imageLink').href = imageURI; simpler alternative - but only works for smallish images
  // };

  reset(event) {
    this.createInitBuffer();
    this.createBufferScene();
  };

  cleanupScene = () => {
    console.log('cleanup called')
    this.scene = null;
    this.projector = null;
    this.camera = null;
    this.controls = null;
    this.domElement.removeChild(this.renderer.domElement)
    cancelAnimationFrame( this.animationFrameId )
    this.renderer = null;

    this.initScene = null
    this.bufferScene = null
    this.initMaterial = null
    this.bufferMaterial = null
    this.initCamera = null

    // window.removeEventListener('resize', this.resize.bind(this))
  }

  onWindowResize(event) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.canvasWidth = w;
    this.canvasHeight = h;

    this.initMaterial.uniforms.res.value = new THREE.Vector2(w,h);
    this.bufferMaterial.uniforms.res.value = new THREE.Vector2(w,h);
    this.outputMaterial.uniforms.res.value = new THREE.Vector2(w,h);

    this.camera.aspect = w/h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( w, h );
  };

}

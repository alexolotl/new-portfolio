// TODO AEZ not ideal, I am requiring the image assets in this file since I couldnt with require in the component with a variable

export default {
  shaders: {
    type: 'SHADER',
    projects: [
        {
          name: 'Alien',
          path: 'alien',
          type: 'SIMPLESHADER',
          thumb: require('./assets/alien-preview.png'),
          three: true,
          threeFile: 'ShaderTemplate',
          fragment: `
          #define M_PI 3.1415926535897932384626433832795
              uniform vec2 resolution;
              uniform float time;
              uniform vec2 mouse;
              uniform sampler2D textureSampler;
              uniform vec2 drag;
              uniform float scale;

              float warp(vec2 p) {

                vec2 center = vec2(0.2,0.2);

                vec3 circle = smoothstep(.07,.15,vec3(length(p-center)));
                //circle = smoothstep(0.2,0.8,circle);
                //p = mix(p-center,(p-center)/10.,1.-circle.xy); //comment out
                //p *= 3.;

                vec2 p2 = p * 10.+.5*sin(7.0*p.y + time)*cos(5.0*p.x + time);
                p2 = p2 * 2.+.5*sin(4.0*p2.y + time/2.)*cos(3.0*p2.x + time/2.);
                p2 = p2 * 1.+.5*sin(4.0*p2.y + time/3.)*cos(3.0*p2.x + time/4.);
                p2 = p2 * 1.+.25*sin(4.0*p2.y + time/2.5)*cos(3.0*p2.x + time/2.);

                p2 += sin(4.*p.y+time/3.)*cos(6.*p.x+time/4.);

                p2 = fract(1.*p2);

                p2 = smoothstep(0., 0.5, p2) - smoothstep(0.5,1.,p2);

                float warped = length(p2);

                //return mix(warped,0.,1.-circle.x);
                return warped;

              }

           void main() {
              vec2 uv = (gl_FragCoord.xy / resolution.y + .25) / 1.75;

              float f = warp(uv);
              float delta = 0.001;

              float dx = (warp(vec2(uv.x + delta, uv.y)) - f) / delta;
              float dy = (warp(vec2(uv.x, uv.y + delta)) - f) / delta;

              vec3 screenNormal = vec3(0.,0.,-1.);
              float bump = .02;
              screenNormal = normalize( screenNormal + vec3(dx,dy,0.)*bump);

              // LIGHTING  // lighting code and comments from https://www.shadertoy.com/view/4l2XWK
            //
          // Determine the light direction vector, calculate its distance, then normalize it.
          vec3 lightPos = vec3(cos(time)*2.+.5,sin(time)*2.+.5,-1.);
          vec3 ld = lightPos - vec3(uv,0.);
          float lDist = max(length(ld), 0.001);
          ld /= lDist;

            // Light attenuation.
            //float atten = 1./(1.0 + lDist*lDist*0.15);
           float atten = min(1./(lDist*lDist*1.), 1.);

            // Using the bump function, "f," to darken the crevices. Completely optional, but I
            // find it gives extra depth.
            //atten *= f*.9 + .1;
            atten *= f*f*.7 + .3;
            atten *= pow(f, .75);



          // Diffuse value.
          float diff = max(dot(screenNormal, ld), 0.);
            // Enhancing the diffuse value a bit. Made up.
            diff = pow(diff, 4.)*0.66 + pow(diff, 8.)*0.34;
            // Specular highlighting.
            float spec = pow(max(dot( reflect(-ld, screenNormal), -vec3(uv,1.)), 0.), 12.);

            vec3 color = vec3(f,f+uv.x,1.);

            //vec3 texcolor = texture2D(textureSampler, reflect(normalize(vec3(uv,-5)), screenNormal).xz).rgb;
            vec3 texcolor = texture2D(textureSampler, uv+f*.1).rgb;
            color = mix(color, texcolor, 0.);
            color = (color + spec)*atten;

              gl_FragColor= vec4(color, 1.0);
            }
          `,
          vertex: `
            void main()	{

                gl_Position = vec4( position, 1.0 );

              }
          `,
        },
        {
          name: 'RD',
          path: 'rd',
          thumb: require('../services/assets/RD-preview.png'),
          type: 'FBSHADER',
          three: true,
          threeFile: 'RDtemplate'
        },
    ]
  },
  visuals: {
    type: '3D',
    projects: [
      {
        name: null,
        path: 'knob',
        src: require("./assets/01_BrickSpiralAndDoorknob2.jpg")
      },
      {
        name: null,
        path: 'scene',
        src: require("./assets/02_scene2_2.jpg"),
      },
      {
        name: null,
        path: 'coral',
        src: require("./assets/03_coralTree.jpg"),
      },
      {
        name: null,
        path: 'chair',
        src: require("./assets/ChairExp.jpg"),
      },
      {
        name: null,
        path: 'other',
        src: require("./assets/02_scene2.jpg"),
      },
      {
        name: null,
        path: 'straw',
        src: require("./assets/3Dstraw.png"),
      },{
        name: null,
        path: 'version',
        src: require("./assets/02_scene2.jpg"),
      },{
        name: null,
        path: 'bubble',
        src: require("./assets/BUBBLEBLOBSpurple.png"),
      },{
        name: null,
        path: 'slide',
        src: require("./assets/3Dwaterslide.jpg"),
      },{
        name: null,
        path: 'texture',
        src: require("./assets/06_textureMoving9.jpg"),
      },
      {
        name: null,
        path: 'thing',
        src: require("./assets/thing.png"),
      },
      {
        name: null,
        path: 'cube',
        src: require("./assets/swirlycube.jpg"),
      },
      {
        name: null,
        path: 'coils',
        src: require("./assets/3Dcoils.png"),
      },
      {
        name: null,
        path: 'splash',
        src: require("./assets/splash.jpg"),
      },
      {
        name: null,
        path: 'cloth',
        src: require("./assets/3Dcloth.jpg"),
      },
      {
        name: null,
        path: 'tex',
        src: require("./assets/textures-01.png"),
      },
      {
        name: null,
        path: 'boxes',
        src: require("./assets/boxes-01.jpg"),
      },
      {
        name: null,
        path: 'texx',
        src: require("./assets/TextureMin.jpg"),
      },

      {
        name: null,
        path: 'pattern',
        src: require("./assets/crazypattern-01.png"),
      },{
        name: null,
        path: 'mat',
        src: require("./assets/3Dbubblemat.jpg"),
      },
      {
        name: null,
        path: 'apple',
        src: require("./assets/apple11.jpg"),
      },
      {
        name: null,
        path: 'slime',
        src: require("./assets/slime.jpg"),
      },
      {
        name: null,
        path: 'whisps',
        src: require("./assets/smokywhisps4-01.png"),
      },
      {
        name: null,
        path: 'tribal',
        src: require("./assets/tribalMin.png"),
      },
      {
        name: null,
        path: 'grids',
        src: require("./assets/weirdgridsMin.png"),
      },

    ]
  }
}

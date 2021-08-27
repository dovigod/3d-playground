uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;
float testing(float a,float b){
    
    return a+b;
}

void main()
{
    
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    float elevation=sin(modelPosition.x*uFrequency.x+uTime)*.1;
    elevation+=sin(modelPosition.y*uFrequency.y+uTime)*.1;
    
    modelPosition.z+=elevation;
    
    // modelPosition.z+=sin(modelPosition.x*uFrequency.x+uTime)*.1;
    // modelPosition.z+=sin(modelPosition.y*uFrequency.y+uTime)*.1;
    // modelPosition.z+=aRandom*.1;
    
    // modelPosition.y+=uTime;
    // modelPosition.y*=.5;
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    
    gl_Position=projectedPosition;
    vRandom=aRandom;
    vUv=uv;
    vElevation=elevation;
    //     gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);
// }
}
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;

float testing(float a,float b){
    
    return a+b;
}

void main()
{
    //     float fooBar=.123;
    //     vec2 foo=vec2(1.,2.);
    //     foo.x=3.;
    //     foo.y=4.;
    //     foo*=2.;// ==> 6 ,8
    vec2 foo=vec2(1.,2.);
    vec3 bar=vec3(foo,3.);
    vec3 car=bar.xzy;//swizzle
    float result=testing(2.,3.);
    
    gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);
}
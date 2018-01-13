#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

precision mediump int;

uniform float _Width;
uniform float _Height;

uniform float _Time;

float saturate(float v){
	return clamp(v, 0.0, 1.0);
}

// https://github.com/keijiro/ShaderSketches/blob/master/Fragment/Waves.glsl

float wave(vec2 coord){
    float interval = _Width * 0.04;
    vec2 p = coord / interval;

    float py2t = 0.112 * sin(_Time * 0.378);
    float phase1 = dot(p, vec2(0.00, 1.00)) + _Time * 1.338;
    float phase2 = dot(p, vec2(0.09, py2t)) + _Time * 0.566;
    float phase3 = dot(p, vec2(0.08, 0.11)) + _Time * 0.666;

    float pt = phase1 + sin(phase2) * 3.0;
    pt = abs(fract(pt) - 0.5) * interval * 0.5;

    float lw = 2.3 + sin(phase3) * 1.9;
    return saturate(lw - pt);
}

void main(){
    gl_FragColor = vec4(vec3(wave(gl_FragCoord.xy)), 1.0);
}

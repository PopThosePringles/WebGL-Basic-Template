#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

precision mediump int;

uniform float _Width;
uniform float _Height;

uniform float _Time;

void main(){
	vec2 p = gl_FragCoord.xy / (_Width * 1.5);

	gl_FragColor = vec4(sin(p.x * _Time / 60.0), sin(p.y * _Time / 60.0), sin(p.x + 0.3 * _Time / 60.0), 1.0);
}

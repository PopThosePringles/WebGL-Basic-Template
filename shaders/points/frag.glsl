#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

precision mediump int;

void main(){
	gl_FragColor = vec4(0.3, 0.3, 0.3, 1.0);
}

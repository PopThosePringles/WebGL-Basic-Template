attribute vec2 _Position;

void main(){
	gl_Position = vec4(_Position, 0, 1);
}
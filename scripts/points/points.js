class WebGL_Points extends WebGL {

	draw_point(){
		let positions = new Float32Array([
			-.5, .5,
			-.5, -.5,
			.5, .5,
			.5, -.5
		]);

		this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

		let pos = this.gl.getAttribLocation(this.program, "_Position");

		this.gl.enableVertexAttribArray(pos);
		this.gl.vertexAttribPointer(pos, 2, this.gl.FLOAT, false, 0, 0);

		this.gl.drawArrays(this.gl.POINTS, 0, 4);
	}

	draw(){
		this.draw_point();
	}

}
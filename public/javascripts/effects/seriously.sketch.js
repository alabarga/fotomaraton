(function (window, undefined) {
"use strict";

window.Seriously = window.Seriously ||
	{ plugin: function (name, opt) { this[name] = opt; } };

/* inspired by http://lab.adjazent.com/2009/01/09/more-pixel-bender/ */
	
Seriously.plugin('sketch', {
	shader: function(inputs, shaderSource, utilities) {
		shaderSource.fragment = '#ifdef GL_ES\n\n' +
			'precision mediump float;\n\n' +
			'#endif\n\n' +
			'\n' +
			//todo: make adjust adjustable
			'const float adjust = 640.0;\n' +
			'const float n0 = 97.0 / adjust;\n' +
			'const float n1 = 15.0 / adjust;\n' +
			'const float n2 = 97.0 / adjust;\n' +
			'const float n3 = 9.7 / adjust;\n' +
			'const float total = n2 + ( 4.0 * n0 ) + ( 4.0 * n1 );\n' +
			'const vec3 div3 = vec3(1.0 / 3.0);\n' +
			'\n' +
			'varying vec2 vTexCoord;\n' +
			'varying vec4 vPosition;\n' +
			'\n' +
			'uniform sampler2D source;\n' +
			'\n' +
			'void main(void) {\n' +
			'	float offset, temp1, temp2;\n' +
			'	vec4 m, p0, p1, p2, p3, p4, p5, p6, p7, p8;\n' +
			'	offset = n3;\n' +

			'	p0=texture2D(source,vTexCoord);\n' +
			'	p1=texture2D(source,vTexCoord+vec2(-offset,-offset));\n' +
			'	p2=texture2D(source,vTexCoord+vec2( offset,-offset));\n' +
			'	p3=texture2D(source,vTexCoord+vec2( offset, offset));\n' +
			'	p4=texture2D(source,vTexCoord+vec2(-offset, offset));\n' +

			'	offset=n3*2.0;\n' +

			'	p5=texture2D(source,vTexCoord+vec2(-offset,-offset));\n' +
			'	p6=texture2D(source,vTexCoord+vec2( offset,-offset));\n' +
			'	p7=texture2D(source,vTexCoord+vec2( offset, offset));\n' +
			'	p8=texture2D(source,vTexCoord+vec2(-offset, offset));\n' +
			'	m = (p0 * n2 + (p1 + p2 + p3 + p4) * n0 + (p5 + p6 + p7 + p8) * n1) / total;\n' +

				//convert to b/w
			'	temp1 = dot(p0.rgb, div3);\n' +
			'	temp2 = dot(m.rgb, div3);\n' +

				//color dodge blend mode
			'	if (temp2 <= 0.0005) {\n' +
			'		gl_FragColor = vec4( 1.0, 1.0, 1.0, p0.a);\n' +
			'	} else {\n' +
			'		gl_FragColor = vec4( vec3(min(temp1 / temp2, 1.0)), p0.a);\n' +
			'	}\n' +
			'}\n';
		return shaderSource;
	},
	inPlace: true,
	inputs: {
		source: {
			type: 'image',
			uniform: 'source',
			shaderDirty: false
		}
	},
	title: 'Sketch',
	description: 'Pencil/charcoal sketch'
});

}(window))

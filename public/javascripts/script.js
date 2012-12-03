function setUpVideo(resources) {
	var seriously = new Seriously();
	var canvas = document.getElementById('canvas');
	var video = document.getElementById('video');
	var ch = document.getElementById('ch');
	var img = document.getElementById('peces');
	var target = seriously.target(canvas);

	var chroma = seriously.effect('chroma');
	chroma.weight = 1.32;
	chroma.balance = 0;
	chroma.screen = 'rgb(77, 239, 41)';
	chroma.clipWhite = 0.85;
	chroma.clipBlack = 0.5125;
	chroma.source = ch;

	var night = {
		blend: seriously.effect('blend')
	};
	
	night.blend.top = chroma;
	night.blend.bottom = img;
  target.source = night.blend;
	seriously.go();
	
}
setUpVideo();


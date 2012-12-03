/*! dmv - v0.3.0 - 8/20/2012
* https://github.com/rwldrn/dmv
* Copyright (c) 2012 Rick Waldron <waldron.rick@gmail.com>; Licensed MIT */

(function( window, navigator ) {

var  // Program initializers
    Operator, DMV;
  // ---- Program ---- //

  // Operator Constructor
  Operator = function( selector, socket ) {
    // Check to see if an Id exists in storage...
    var id = localStorage.getItem("dmv-id");

    // If not, then generate id for for newly initialized Operator
    // Store id locally to keep track of repeat visitors
    if ( !id ) {
      id = Operator.id();
      localStorage.setItem( "dmv-id", id );
    }

    // Set this operator's id
    this.id = id;
    
    // DOM container reference
    this.container = document.querySelector( selector );
    // This Operator's video
    this.media = this.fixture( "video", this.id );

    // This Operator's canvas
    // this.canvas = this.fixture( "canvas", this.id );
    // this.context = this.canvas.getContext("2d");

    // Socket referene
    this.socket = socket;

    // Store datauri's received from stream
    this.dataUri = "";


    navigator.getUserMedia({
      video: true
    }, function( raw ) {
      var stream;

      if ( raw.label && raw.readyState === 1 ) {
        stream = window.URL.createObjectURL( raw );
      }

      // Attach user media stream to video container source
      this.media.src = stream && stream || raw;
      this.media.play();

      // When video signals that it has loadedmetadata, begin "playing"
      this.media.addEventListener( "loadedmetadata", function() {

        this.media.play();
        console.log(this.media)
        this.seriously(this.media.videoHeight, this.media.videoWidth);
        // console.log(this.media.videoHeight); 

      }.bind(this), false);

      // On timeupdate events, draw the video frame to the canvas
      this.media.addEventListener( "timeupdate", function() {
        // this.draw();
      }.bind(this), false);

    }.bind(this),
    function() {
      // console.log(arguments);
    });
  };

  Operator.prototype.seriously = function(vheight, vwidth, foto, rgb){
    var canvas = document.getElementById('canvas');
    canvas.height = vheight;
    canvas.width = vwidth;
    canvas.style.width = vwidth + "px";
    if(typeof foto == "undefined"){
      var foto = document.getElementById('tr');
    }
    if(typeof rgb == "undefined"){
      rgb = 'rgb(108,163,103)';
    }else{
      // rgb = 'rgb(108,163,103)';
      rgb = 'rgb('+ rgb.r +', '+ rgb.g + ', ' +rgb.b +')';
    }
    var seriously = new Seriously();
    var video = this.media;
    var ch = document.getElementById('ch');
    var img = foto;
    var target = seriously.target(canvas);

    var chroma = seriously.effect('chroma');
    chroma.weight = 1.32;
    chroma.balance = 1;
    // chroma.screen = 'rgb(77, 239, 41)';
    // chroma.screen = 'rgb(206, 207, 208)';
    chroma.screen = rgb    // chroma.screen = 'rgb(116, 147, 167)';
    chroma.clipWhite = 0.85;
    chroma.clipBlack = 0.5125;
    chroma.source = video;

    var night = {
      blend: seriously.effect('blend'),
      nightvision :seriously.effect('nightvision')
    };
    // night.blend.destroy();
    night.blend.top = chroma;
    night.blend.bottom = img;
    target.source = night.blend;
    seriously.go();
  };


  Operator.prototype.draw = function() {
    // Draw current video frame to the canvas
    // this.context.drawImage( this.media, 0, 0, this.canvas.width, this.canvas.height );
  };


  Operator.prototype.capture = function( callback ) {
    // var capture = this.canvas.toDataURL();
    var canvas = document.getElementById('canvas');
    var capture = canvas.toDataURL();
    // Dispatch a "capture" event to the socket
    this.socket.emit( "capture", {
      id: this.id,
      captured: capture
    });
    callback( capture );
  };

  // Create an HTML element fixture
  Operator.prototype.fixture = function( nodeName, id ) {
    var node = document.createElement( nodeName ),
        other;

    node.id = nodeName[0] + "_" + id;

    // TODO: Refactor for scaling/resizing
    // node.style.width = window.innerWidth + "px";

    // TODO: make this definable
    if ( !this.container ) {
      this.container = document.body;
    }

    if ( nodeName === "canvas" ) {
      other = document.querySelector( "video[id$='" + id + "']" );
      // other = document.querySelector( "video[id$='" + id + "']" );

      setTimeout(function check() {
        if ( other.videoWidth > 0 ) {
          node.width = other.videoWidth;
          node.height = other.videoHeight;

          // node.style.visibility = "hidden";

          // set container width to center the video
          // margin: 0 auto
          this.container.style.width = other.videoWidth + "px";
        } else {
          setTimeout( check, 10 );
        }
      }, 10);
    }

    // this.container.appendChild( node );

    return node;
  };
  // Static Operator functions
  // Operator.id()
  // Returns a pretty damn unique id
  Operator.id = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function( chr ) {
      var rnd = Math.random() * 16 | 0;
      return ( chr === "x" ? rnd : (rnd & 0x3 | 0x8) ).toString( 16 );
    }).toUpperCase();
  };



  DMV = {

    socket: null,

    operator: null,

    // Entry point:
    //   creates new id,
    //   stores id,
    //   stores reference to socket
    //   sets up socket listeners
    //   emits "init" event to socket
    init: function( selector, socket ) {

      DMV.socket = socket;
      DMV.operator = new Operator( selector, socket );

      this.listen( DMV.operator.media );
    },
    listen: function( media ) {

      if ( !media ) {
        setTimeout(function() {
          DMV.listen(media);
        }, 10);
      } else {
        media.addEventListener( "click", DMV.operator.capture.bind( DMV.operator ), false );
      }
    }
  };

  window.DMV = DMV;
  window.Operator = Operator;


} (typeof window === "object" && window || this, this.navigator ) );

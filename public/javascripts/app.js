$(function() {
  var id,
      socket = io.connect('htt://localhost:4000'),
      // Cached DOM Queries
      $saved = $("#saved");
      $imgpeke = $("#imgpeke");
  // Bye Bye.
  if ( !window.unprefix.supported.getUserMedia ) {
    $("#obsolete").show();
    return;
  }

  //Disable menu contextual
  $(document)[0].oncontextmenu = function() {return false;}

  //Ajuestes
  $("#obsolete").hide();
  $('#container').hide();
  $('#xlInput').keyboard();
  $('video').hide();
  $('#colorpickerField2').ColorPicker({
    onSubmit: function(hsb, hex, rgb, el) {
      $(el).val(hex);
      $(el).ColorPickerHide();
    },
    onBeforeShow: function () {
      $(this).ColorPickerSetColor(this.value);
      }
    })
  .bind('keyup', function(){
    $(this).ColorPickerSetColor(this.value);
  });

 function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  } 

  // Show Photobooth inicialización
  DMV.init( "#container", socket );

  //botones fondos
  $('#peces').on("click", function(){
    var hexe = $('#colorpickerField2').val(); 
    var hexergb = hexToRgb(hexe);
    console.log(hexergb);
    $('#canvas').remove();
    var elem = $("<canvas id='canvas'>", {width:300, height:300});
    $('#concavas').append(elem);
    DMV.operator.seriously('480', '640', '#peces', hexergb);
  });

  $('#ub').on("click", function(){
    var hexe = $('#colorpickerField2').val(); 
    var hexergb = hexToRgb(hexe);
    $('#canvas').remove();
    var elem = $("<canvas id='canvas'>", {width:300, height:300});
    $('#concavas').append(elem);
    DMV.operator.seriously('480', '640', '#ub', hexergb);
  });
  
  $('#tr').on("click", function(){
    var hexe = $('#colorpickerField2').val(); 
    var hexergb = hexToRgb(hexe);
    $('#canvas').remove();
    var elem = $("<canvas id='canvas'>", {width:300, height:300});
    $('#concavas').append(elem);
    DMV.operator.seriously('480', '640', '#tr', hexergb);
  });


  $("#bontoncamara").on( "click", function() {
    DMV.operator.capture(function( dataURI ) {
      $saved.prepend(
        [
          "<li><a href='" + dataURI + "' target='_blank'>",
          "<img src='" + dataURI + "'></a></li>"
        ].join("")
      );
      $imgpeke.html(
        [
          "<img src='" + dataURI + "'></a></li>"
        ].join("")
      );
      $('a.btn.primary').on("click", function(){
        if($('#xlInput').val() === ''){
          $('#error').modal('show');
        }else{

          var ids = localStorage.getItem("dmv-id");
          socket.emit("correo", {
            correo: $('#xlInput').val(),
            id: ids
          });
          $('#windowTitleDialog').modal('hide'); 
        }
      });
    });
    $('#windowTitleDialog').modal('show');
    $('#xlInput').val('');
  });



$('a.close').on("click", function(){
  $('#windowTitleDialog').modal('hide'); 
});

$('a.btn.secondary').on("click", function(){
  $('#windowTitleDialog').modal('hide'); 
});

  // List Photos
  // `id` initialized at top of scope
  id = localStorage.getItem("dmv-id");

  socket.emit( "list:request", {
    id: id
  }).on( "list:response", function( data ) {
    var url;
    if ( data.files.length ) {
      data.files.forEach(function( file ) {
        // TODO: make some damn templates for this
        // TODO: be less sloppy about this DOM access
        url = data.path + file;
        $saved.children(":first").remove();
        $saved.prepend(
          [
            "<li><a href='" + url + "' target='_blank'>",
            "<img src='" + url + "'></a></li>"
          ].join("")
        );
      });
    }
  });
});

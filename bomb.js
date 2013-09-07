function Bomb(options) {
  var self=this;
  jaws.Sprite.call(this, options);
  var animation = new jaws.Animation({sprite_sheet: "bomb_7x8.bmp", frame_size: [7,8], frame_duration: 20, scale_image: 2});
  this.setImage( animation.frames[0] );
  this.vy = options.vy || -6;
  this.vx = options.vx || 0;
  this.start_vx = this.vx

  this.status = "active"
  setTimeout( explode, 3000 )


  this.update = function() {
    this.vx = this.start_vx
    self.setImage( animation.next() )
  }

  function explode() {
    self.status = "exploded"
  }
}


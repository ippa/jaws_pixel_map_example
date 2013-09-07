function Spider(options) {
  jaws.Sprite.call(this, options);
  var animation = new jaws.Animation({sprite_sheet: "spider_8x5.bmp", frame_size: [8,5], frame_duration: 20, scale_image: 2});
  this.setImage( animation.frames[0] );
  this.vy = 0;
  this.vx = 0;

  var self=this;

  this.update = function() {
    if(self.vy < 5) self.vx = -2;
    self.setImage( animation.next() )
  }
}


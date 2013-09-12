function Spider(options) {
  var self = this;
  jaws.Sprite.call(this, options);

  var animation = new jaws.Animation({sprite_sheet: "spider_8x5.bmp", frame_size: [8,5], frame_duration: 20, scale_image: 2});
  this.setImage( animation.frames[0] );
  this.vy = 0;
  this.vx = 0;
  this.static_vx = -2;

  changeDirection();

  function changeDirection() {
    self.static_vx = (self.static_vx < 0) ? 2 : -2
    setTimeout( changeDirection, Math.random() * 4000)
  }

  this.update = function() {
    if(self.vy < 3) self.vx = self.static_vx;
    self.setImage( animation.next() )
  }
}
Spider.prototype = jaws.Sprite.prototype;


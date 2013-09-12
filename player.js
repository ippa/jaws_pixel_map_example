function Player(options) {
  var self=this;
  if(options.anchor === undefined) options.anchor = "bottom_center";
  jaws.Sprite.call(this, options);

  var anim = new jaws.Animation({sprite_sheet: "droid_11x15.png", frame_duration: 100, scale_image: 2});
  var anim_rest = anim.slice(0,5);
  var anim_left = anim.slice(10,12);
  var anim_right = anim.slice(12,14);

  this.vy = 0;
  this.vx = 0;
  this.setImage( anim.frames[0] );

  this.update = function() {
    if(this.vx == 0)  this.setImage(anim_rest.next());
    if(this.vx > 0)   this.setImage(anim_right.next()); 
    if(this.vx < 0)   this.setImage(anim_left.next()); 
  }
}
Player.prototype = jaws.Sprite.prototype;


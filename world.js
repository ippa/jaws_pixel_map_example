function World(options) {
  var self = this
  this.pixel_map = new jaws.PixelMap({image: options.image, scale_image: 3});
  this.pixel_map.nameColor([0,0,0,255], "ground");

  /*
   * Call updatePhysics() on all provided sprites
   *
   * Give it an single-argument object, multi-argument objects, array or array of arrays
   */
  this.update = function() {
    var list = arguments;

    if(list.length == 1 && jaws.isArray(list[0])) list = list[0];
    for(var i=0; i < list.length; i++) {
      if(jaws.isArray(list[i])) this.update(list[i]);  
      else                      this.updatePhysics(list[i]);
    } 
  }

  this.updatePhysics = function(sprite) {
    sprite.vy += 0.3;
    if(sprite.vy > 5) sprite.vy = 5;

    /*
     * We need to:
     * - Step 1 pixel at the time checking for collisions
     * - Be able to step both forward (+) and backwards (-)
     * - Be able to tell if we collided while moving vertical or horizontal (see collided)
     */
    function notTouchingGround(sprite) { return !self.pixel_map.namedColorAtRect("ground", sprite.rect()) }
    var collided = sprite.stepWhile(sprite.vx, sprite.vy, notTouchingGround);

    /*
     * If we collided while moving vertically and had a vertical velocity, enable jumping again
     */
    if(collided.y) sprite.vy = 0;

    if(collided.x && sprite.vx != 0) {
      var saved_position = [sprite.x, sprite.y];
      var try_y = sprite.y - 5;
      var collided = sprite.stepToWhile(sprite.x + sprite.vx, try_y, function(sprite) {
        if(sprite.y != try_y) return true;
        return !self.pixel_map.namedColorAtRect("ground", sprite.rect())
      });

      if(collided.x || collided.y) { 
        sprite.moveTo(saved_position) 
      }
    }

    sprite.vx = 0;
  }

  this.explodeBomb = function(bomb) {
    var r = 30;

    self.pixel_map.context.save();
    self.pixel_map.context.beginPath();
    self.pixel_map.context.arc(bomb.x, bomb.y, r, 0, Math.PI*2, true);
    self.pixel_map.context.closePath();
    self.pixel_map.context.globalCompositeOperation = "destination-out";
    self.pixel_map.context.fill();
    self.pixel_map.context.restore();

    self.pixel_map.update(bomb.x - r, bomb.y - r, r*2, r*2);  // Update our raw data-array from the newly modified canvas context

    jaws.log("* BOOM!");
  }
}

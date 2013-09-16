function PixelMapExample() {
  var player = new jaws.Sprite({x:100, y:200, anchor: "bottom_center"});
  var pixel_map = new jaws.PixelMap({image: "map.bmp", scale_image: 3});
  pixel_map.nameColor([0,0,0,255], "ground");

  var anim = new jaws.Animation({sprite_sheet: "droid_11x15.png", frame_duration: 100, scale_image: 2});
  player.anim_rest = anim.slice(0,5);
  player.anim_left = anim.slice(10,12);
  player.anim_right = anim.slice(12,14);

  this.setup = function() {
    player.vx = player.vy = 0;
    jaws.preventDefaultKeys("up", "down", "left", "right", "space")
  }

  this.update = function() {
    player.setImage( player.anim_rest.next() );

    if(jaws.pressed("right d")) { 
      player.vx = 2; 
      player.setImage( player.anim_right.next() ); 
    }
    if(jaws.pressed("left a"))  { 
      player.vx = -2; 
      player.setImage( player.anim_left.next() ); 
    }
    if(jaws.pressedWithoutRepeat("up")) { player.vy = -7; }

    updatePhysics(player);
  }

  this.draw = function() {
    pixel_map.draw();
    player.draw();
  }

  function updatePhysics(sprite) {
    sprite.vy += 0.3;
    if(sprite.vy > 7) sprite.vy = 7;

    function notTouchingGround(sprite) { return !pixel_map.namedColorAtRect("ground", sprite.rect()) }
    /*
     * We need to:
     * - Step 1 pixel at the time checking for collisions, use sprite.stepToWhile()
     * - Be able to step both forward (+) and backwards (-)
     * - Be able to tell if we collided while moving vertical or horizontal (see returned collided-object)
     */

    var collided = sprite.stepWhile(sprite.vx, sprite.vy, notTouchingGround);

    if(collided.y) sprite.vy = 0; // We collided moving vertically

    /*
     * Enable player to automatically climb up 3 pixels
     */
    if(collided.x) {  // We collided moving horizontally
      var saved_position = [sprite.x, sprite.y];
      var min_y = sprite.y - 3
      var collided = sprite.stepWhile(sprite.vx, -3, function(sprite) {
        return !pixel_map.namedColorAtRect("ground", sprite.rect()) || sprite.y != min_y
      });

      if(collided.x || collided.y) {
        sprite.moveTo(saved_position) 
      }
    }
    sprite.vx = 0;
  }
}

jaws.assets.add("droid_11x15.png", "map.bmp");
jaws.start(PixelMapExample, {width: 900, height: 300})

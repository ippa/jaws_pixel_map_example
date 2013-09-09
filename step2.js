function PixelMapExample() {
  var anim = new jaws.Animation({sprite_sheet: "droid_11x15.png", frame_duration: 100, scale_image: 2});
  var player = new jaws.Sprite({x:100, y:200, anchor: "bottom_center"});
  var pixel_map = new jaws.PixelMap({image: "pixel_map_1.png", scale_image: 3});
  pixel_map.nameColor("ground", [0,0,0,255]);

  // anim.slice creates a new animation with the same settings, but only keep a subset of the frames
  player.anim_rest = anim.slice(0,5);
  player.anim_left = anim.slice(10,12);
  player.anim_right = anim.slice(12,14);

  this.setup = function() {
    player.vx = player.vy = 0;
    jaws.preventDefaultKeys("up", "down", "left", "right", "space");
  }

  this.update = function() {
    player.setImage(player.anim_rest.next());
    if(jaws.pressed("right d")) { 
      player.vx = 2; 
      player.setImage(player.anim_right.next()); 
    }
    if(jaws.pressed("left a"))  { 
      player.vx = -2; 
      player.setImage(player.anim_left.next()); 
    }
    if(jaws.pressedWithoutRepeat("up")) { player.vy = -7; }

    updatePhysics(player);
  }

  this.draw = function() {
    jaws.clear();
    pixel_map.draw();
    player.draw();
    player.rect().draw();
  }

  function updatePhysics(sprite) {
    sprite.vy += 0.3;
    if(sprite.vy > 5) sprite.vy = 5;

    /*
     * We need to:
     * - Step 1 pixel at the time checking for collisions
     * - Be able to step both forward (+) and backwards (-)
     *
     * We're still only checking 1 pixel at the 'feet' (see Sprite-argument anchor)
     */
    var collided = sprite.stepToWhile(sprite.x + sprite.vx, sprite.y + sprite.vy, function(sprite) {
      return !(pixel_map.namedColorAt(sprite.x, sprite.y) === "ground")
    });
    sprite.vx = 0;
  }
}

jaws.onload = function() {
  jaws.assets.add("droid_11x15.png", "pixel_map_1.png");
  jaws.start(PixelMapExample);
}


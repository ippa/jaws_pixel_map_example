function PixelMapExample() {
  var player = new jaws.Sprite({x:100, y:200, anchor: "bottom_center"});
  var pixel_map = new jaws.PixelMap({image: "map.bmp", scale_image: 3});
  pixel_map.nameColor([0,0,0,255], "ground"); 

  // Called once when gamestate isactivated
  this.setup = function() {
    player.vx = player.vy = 0;
    jaws.preventDefaultKeys("up", "down", "left", "right", "space")
  }

  // Called in combination with draw() each gametick as long as gamestate is active
  this.update = function() {
    if(jaws.pressed("right d")) { player.vx = 2 }
    if(jaws.pressed("left a"))  { player.vx = -2 }
    if(jaws.pressedWithoutRepeat("up")) { player.vy = -7 }

    updatePhysics(player);
  }

  this.draw = function() {
    pixel_map.draw();
    player.draw();
  }

  function updatePhysics(sprite) {
    sprite.vy += 0.3; // gravity

    sprite.y += sprite.vy;
    if(pixel_map.namedColorAt(player.x, player.y) === "ground") { sprite.y -= sprite.vy; sprite.vy = 0; }
    
    sprite.x += sprite.vx;
    if(pixel_map.namedColorAt(player.x, player.y) === "ground") { sprite.x -= sprite.vx }
 
    sprite.vx = 0;
  }
}

jaws.assets.add("map.bmp");   // LATER ON: jaws.assets.get("map.bmp")
jaws.start(PixelMapExample, {width: 900, height: 300});

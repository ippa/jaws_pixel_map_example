function PixelMapExample() {
  var player = new jaws.Sprite({x:100, y:200, anchor: "bottom_center"});
  var pixel_map = new jaws.PixelMap({image: "pixel_map_1.png", scale_image: 3});
  pixel_map.nameColor("ground", [0,0,0,255]); // Let's call R(0), G(0), B(0), A(255) "ground"

  this.setup = function() {
    player.vx = player.vy = 0;
    jaws.preventDefaultKeys("up", "down", "left", "right", "space")
  }

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
    // Apply velocity
    sprite.x += sprite.vx;
    sprite.y += sprite.vy;

    sprite.vy += 0.3; // Gravity

    // If players 'feet' hits 'ground', stop acceleration downards
    if(pixel_map.namedColorAt(player.x, player.y) === "ground") { sprite.vy = 0 }
    sprite.vx = 0;
  }
}

jaws.onload = function() {
  jaws.assets.add("pixel_map_1.png");
  jaws.start(PixelMapExample, {width: 900, height: 300});
}

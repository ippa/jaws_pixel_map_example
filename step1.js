function PixelMapExample() {
  var player = new jaws.Sprite({x:100, y:200, anchor: "bottom_center"});

  var pixel_map = new jaws.PixelMap({image: "pixel_map_1.png", scale_image: 3});
  
  pixel_map.nameColor("ground", [0,0,0,255]); 

  // Called once when activated
  this.setup = function() {
    player.vx = player.vy = 0;
    jaws.preventDefaultKeys("up", "down", "left", "right", "space")
  }

  // Called in combination with draw() from the jaws gameloop, forever.
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
    // Gravity!
    sprite.vy += 0.3;

    sprite.y += sprite.vy;
    if(pixel_map.namedColorAt(player.x, player.y) === "ground") { sprite.y -= sprite.vy; sprite.vy = 0; }
    
    sprite.x += sprite.vx;
    if(pixel_map.namedColorAt(player.x, player.y) === "ground") { sprite.x -= sprite.vx }
 
    sprite.vx = 0;
  }
}

jaws.assets.add("pixel_map_1.png");
/*
*  Other ways of using jaws.assets:
*
* jaws.assets.add("sprite.bmp")                // FUCHIA -> transparency
* jaws.assets.add("song.mp3", "song.ogg")      // Will only load supported formats, access with jaws.assets.get("song.*")
* jaws.assets.add("data.json")                 // jaws.assets.get("data.json") -> Object created from the JSON
*
*/

jaws.start(PixelMapExample, {width: 900, height: 300});

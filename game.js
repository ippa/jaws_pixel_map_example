function Game() {
  var player = new Player({x: 100, y: 200});
  var world = new World({image: "pixel_map_alpha.png"});
  var viewport = new jaws.Viewport({max_x: world.pixel_map.width, max_y: world.pixel_map.height});

  var bombs = [];
  var spiders = [];

  spiders.push( new Spider({x: 140, y: 10}) );
  spiders.push( new Spider({x: 440, y: 10}) );
  spiders.push( new Spider({x: 540, y: 10}) );

  this.setup = function() {
    player.vx = player.vy = 0;
    jaws.preventDefaultKeys("up", "down", "left", "right", "space")
  }

  this.update = function() {
    if(jaws.pressed("right d")) { player.vx = 2 }
    if(jaws.pressed("left a"))  { player.vx = -2 }
    if(jaws.pressedWithoutRepeat("up")) { player.vy = -7 }
    if(jaws.pressedWithoutRepeat("ctrl")) {
      bombs.push( new Bomb({x: player.x, y: player.y - player.height, vx: player.vx * 4, vy: -8 }) )
    }

    if(jaws.pressedWithoutRepeat("esc")) { 
      jaws.switchGameState( new jaws.game_states.Edit({constructors: [Spider], grid_size: [2,2], game_objects: spiders, url: "/game_objects"}) )
    }

    if(jaws.pressedWithoutRepeat("u")) {
      console.log("pixel_map.update();")
      world.pixel_map.update();
    }

    // Update animations and so on
    jaws.update(player, spiders, bombs);

    // Update sprites x/y according to objects vx/vy and the terrain
    world.update(player, spiders, bombs);

    jaws.log("bombs: " + bombs.length);
    for(var i = 0; i < bombs.length; i++) {
      if(bombs[i].status == "exploded") {
        world.explodeBomb(bombs[i]);
        bombs.splice(i, 1);
      }
    }
    //bombs = bombs.filter( function(bomb) { return bomb.status == "active" } )
  }

  this.draw = function() {
    jaws.fill("blue");                                    
    
    // Everything within viewport.apply is offseted correctly
    viewport.apply( function() {
      // Paint player first to put it behind grass/water
      jaws.draw(player, world.pixel_map, bombs, spiders)  
    });

    viewport.centerAround(player);
  }
}

// When all jaws-files and DOM is loaded, this is executed
jaws.onload = function() {
  Spider.prototype = jaws.Sprite.prototype;
  Player.prototype = jaws.Sprite.prototype;
  Bomb.prototype = jaws.Sprite.prototype;

  jaws.assets.add("droid_11x15.png", "pixel_map_alpha.png", "spider_8x5.bmp", "bomb_7x8.bmp");
  jaws.start(Game, {width: 900, height: 300})
}


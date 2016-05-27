// Basic game setup to display in HTML

var game_width = 160;
var game_height = 160;
var game_scale = 1;


var gameport = document.getElementById("gameport");
var renderer = new PIXI.autoDetectRenderer(game_width, game_height);
gameport.appendChild(renderer.view);


var stage = new PIXI.Container();
stage.scale.x = game_scale;
stage.scale.y = game_scale;

var player_view = new PIXI.Container();
stage.addChild(player_view);
player_view.scale.x = game_scale;
player_view.scale.y = game_scale;



var menus = new PIXI.Container();
stage.addChild(menus);

var lose_sc = new PIXI.Container();
stage.addChild(lose_sc);

menus.visible = true;
menus.interactive =true;

lose_sc.visible = false;
lose_sc.interactive = false;
player_view.visible = false;
player_view.interactive = false;


var player = {};
var wrold;
var lava_layer;
var entity_layer;	
var tu;

var sword_hilt;
var sword_guard;
var sword_blade;
var lose = {};

var monster_1 = {};

var parts_found = 0;

var move_left = 1;
var move_right = 2;
var move_up = 3;
var move_down = 4;
var move_none = 0;

var speed = 32;
var tween_speed = 200;

var dead_sound;



function move() {

	if (player.direction == move_none) {

		player.moving = false;
		//console.log(player.y);
		return;
	}



	player.moving = true;
	console.log("move");


	var next_right = player.position.x + speed;
	var next_left = player.position.x - speed;
	var next_up = player.position.y - speed;
	var next_down = player.position.y + speed;


/*
	Scrapped collision detection:

	//var hitLava0 = tu.hitTestTile(player, lava_layer, 0, world, 'every');
	var hitLava = tu.hitTestTile(player, lava_layer, 1, world, 'every');
	
	var hitGuard = tu.hitTestTile(player, entity_layerGID, 1, world, 'every');

	console.log(hitLava);
	//console.log(hitGuard);
	if(hitLava.hit){
		player.direction = move_none;
		death(player);
		move();
		return;
	}
	
	if(hitGuard){
		player.direction = move_none;
		swordFound(player, sword_guard);
		move()
		return;
	}
*/
	

	if (player.direction == move_left){
		if(collision(next_left, player.y)){
			player.moving = false;
			return;
		}

		else {
			createjs.Tween.get(player).to({x: player.x - speed}, tween_speed).call(move);
		}
	}

	else if (player.direction == move_right){
		if(collision(next_right, player.y)){
			player.moving = false;
			return;
		}

		else {
			createjs.Tween.get(player).to({x: player.x + speed}, tween_speed).call(move);
		}
	}

	else if (player.direction == move_up){
		if(collision(player.x, next_up)){
			player.moving = false;
			return;
		}

		else {
			createjs.Tween.get(player).to({y: player.y - speed}, tween_speed).call(move);
		}

	}


	else if (player.direction == move_down){
		if(collision(player.x, next_down)){
			player.moving = false;
			return;
		}

		else {
			createjs.Tween.get(player).to({y: player.y + speed}, tween_speed).call(move);
		}

	}
}


function collision(x, y){
	var outof_hardcoded_boxes = true;
	if (
		x < 0 || 
		x > 800 ||
		y < 0 ||
		y > 800) return true;


		// Lava boxes
		// Some of them are mis-placed :(
		if(
		// right hand side
		//Box one
		x < 640 && x > 480 && y < 768 && y > 640 ||
		// Box 2
		x < 768 && x > 448 && y < 640 && y > 480 ||
		// 3
		x < 640 && x > 544 && y < 480 && y > 256 ||
		// 4
		x < 768 && x > 544 && y < 256 && y > 160 ||
		//5
		x < 640 && x > 480 && y < 160 && y > 0 ||
		//6
		x < 800 && x > 627 && y < 256 && y > 160 ||

		//left hand side boxes
		//l1
		x < 320 && x > 64 && y < 736 && y > 800 ||
		//l 2
		x < 64 && x > 0 && y < 800 && y > 640 ||
		//l 3
		x < 160 && x > 0 && y < 640 && y > 608 ||
		//l 4
		x < 352 && x > 96 && y < 640 && y > 480 ||
		//l 5
		x < 352 && x > 192 && y < 672 && y > 544 ||
		//l 6
		x < 256 && x > 32 && y < 544 && y > 448 ||
		//l 7
		x < 256 && x > 160 && y < 448 && y > 0 ||
		//l 8
		x < 320 && x > 256 && y < 160 && y > 0 ||
		//l 9
		x < 352 && x > 256 && y < 256 && y > 160 ||
		//l 10
		x < 128 && x > 0 && y < 416 && y > 352 ||
		//l 11
		x < 128 && x > 32 && y < 320 && y > 224 ||
		// 12
		x < 128 && x > 32 && y < 320 && y > 224




		){
			murder(player);
		    return true;
		}
}

function murder(sprite){

	createjs.Tween.get(sprite.scale).to({x: 0, y: 0}, 2000);
	Object.freeze(sprite);
	dead_sound.play();
	window.setTimeout(toLosing, 1000);
}

function toLosing(){

	lose_sc.interactive = true;
	lose_sc.visible = true;
}

var to_overwrite = [65, 83, 87, 68];

//var previous_direction = 0;


function swordFound(sprite, sword_sprite){

	createjs.Tween.get(sword_sprite.scale).to({x: 1.3, y: 1.3}, 1000);
	createjs.Tween.get(sword_sprite.scale).to({x: .5, y: .5}, 1000);
	createjs.Tween.get(sword_sprite.position).to({x: 20, y: 20}, 1000);

}

window.addEventListener('keydown', function(e){

	if(to_overwrite.indexOf(e.keyCode) === -1) return true;

	if (!player) return;

	if (player.moving){ return;
		/*
		// Catches if the player wants to switch directions

		if (e.repeat == true) return;
		previous_direction = player.direction;
		player.direction = move_none

		if (e.keyCode == 87)
			player.direction = move_up;

		else if (e.keyCode == 83)
		    player.direction = move_down;
		else if (e.keyCode == 65)
			player.direction = move_left;
		else if (e.keyCode == 68)
			player.direction = move_right;
		if (e.repeat == true) return;*/
	};

	//if (!(player.moving)) {
		
		

		if (e.repeat == true) return;
		previous_direction = 0;

		player.direction = move_none;


		if (e.keyCode == 87)
			player.direction = move_up;

		else if (e.keyCode == 83)
		    player.direction = move_down;
		else if (e.keyCode == 65)
			player.direction = move_left;
		else if (e.keyCode == 68)
			player.direction = move_right;

	//};

	//console.log(e.keyCode);
	move();
	});

var directions_list = [move_up, move_down, move_left, move_right];
var keycode_list = [87, 83, 65, 68];


window.addEventListener('keyup', function onKeyUp (e) {

	//console.log(e.keyCode, to_overwrite.indexOf(e.keyCode));
	if(to_overwrite.indexOf(e.keyCode) === -1) return true;



	if (!player) return;
	
	player.direction = move_none;

	/* An attempt at a movement improvement,
		would have allowed the player to move using two
		imput keys (i.e. hitting w then a to switch to a's direction)


	if(previous_direction == 0){
		player.direction = move_none;
	}

	else{
		
		player.direction = previous_direction;
		previous_direction = 0;
		move()
	} */

	/*
	for(var i = 0; i < directions_list.length; i ++){

		if(e.keyCode == keycode_list[i]){
			if(player.direction == directions_list[i]) player.direction = move_none;
			else player.direction = directions_list[i];
			
		}
	

	}*/


     

});

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader.add('dead.wav').load(load_sound);

PIXI.loader
	.add('map_json', './tile_assets/map.json')
	.add('map_png', './tile_assets/tileset.png')
	.add('./object_assets/entities.json')
	.load(load_game);

PIXI.loader
	.add('./menu_assets/menus.json')
	.load(load_menus);


function load_sound(){

	dead_sound = PIXI.audioManager.getAudio('dead.wav');
}
function load_menus(){

	var title = new PIXI.Sprite(PIXI.Texture.fromFrame('title.png'));
	menus.addChild(title);
	title.interactive = true;
	title.on('mousedown', changeView.bind(null,player_view));


	lose = new PIXI.Sprite(PIXI.Texture.fromFrame('lose_screen.png'));
	lose_sc.addChild(lose);
	lose.interactive = true;
	lose.visible = true;
	lose.on('mousedown', refresh);

}


function refresh(){
	location.reload();
}




function load_game(){

	tu = new TileUtilities(PIXI);
	world = tu.makeTiledWorld('map_json', './tile_assets/tileset.png');
	player_view.addChild(world);

	var hero = world.getObject("hero");
	var hilt = world.getObject("hilt");
	var guard = world.getObject("guard");
	var blade = world.getObject("blade");

	sword_hilt = new PIXI.Sprite(PIXI.Texture.fromFrame('sword_hilt.png'));
	sword_guard = new PIXI.Sprite(PIXI.Texture.fromFrame('sword_guard.png'));
	sword_blade = new PIXI.Sprite(PIXI.Texture.fromFrame('sword_blade.png'));

	sword_hilt.x = hilt.x;
	sword_hilt.y = hilt.y;
	sword_hilt.anchor.x = 0.0;
	sword_hilt.anchor.y = 1.0;

	sword_guard.x = guard.x;
	sword_guard.y = guard.y;
	sword_guard.anchor.x = 0.0;
	sword_guard.anchor.y = 1.0;

	sword_blade.x = blade.x;
	sword_blade.y = blade.y;
	sword_blade.anchor.x = 0.0;
	sword_blade.anchor.y = 1.0;


/*
	var monster1 = world.getObject("monster1");
	var monster2 = world.getObject("monster2");
	var monster3 = world.getObject("monster3");


	//monster_1 = new PIXI.Sprite(PIXI.Texture.fromFrame('monster.png'));


	monster_1.x = monster1.x;
	monster_1.y = monster1.y;
	//monster_1.anchor.x = 0.5;
	//monster_1.anchor.y = 1.0;
*/


	player = new PIXI.Sprite(PIXI.Texture.fromFrame('hero_back.png'));

	player.x = hero.x;
	player.y = hero.y;
	player.anchor.x = 0.0;
	player.anchor.y = 1.0;


	//lava_layer = world.getObject('lava_layer').data;
	entity_layer = world.getObject("entities");
	
	entity_layer.addChild(player);
	entity_layer.addChild(sword_hilt);
	entity_layer.addChild(sword_guard);
	entity_layer.addChild(sword_blade);
	//entity_layer.addChild(monster_1);

	//entity_layerGID = entity_layer.data;
	



	

	player.direction = move_none;
	player.moving = false;
	animate();




}






// Generic animate function that draws the whole thing
function animate(timestamp){
	requestAnimationFrame(animate);
	update_camera();
	renderer.render(stage);


}

function update_camera(){

	player_view.x = -player.x * game_scale + game_width / 2 - player.width / 2 * game_scale;
	player_view.y = -player.y * game_scale + game_height / 2 + player.height / 2 * game_scale;

	player_view.x = -Math.max(0, Math.min(world.worldWidth*game_scale - game_width, -player_view.x));
	player_view.y = -Math.max(0, Math.min(world.worldHeight*game_scale - game_height, -player_view.y));


}



// Changes the current displaying container
function changeView(view){

	//blip.play();

	for(var i=0; i<stage.children.length; i++){
		stage.children[i].visible = false;
		stage.children[i].interactive = false;
	}

	view.visible = true;
	view.interactive = true;

	
}





// pass in collision checker every time pressed key


//actual collision detection
// console 

// default value is false if out of bounds return true

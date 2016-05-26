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



var menus = new PIXI.Container()
stage.addChild(menus);


menus.visible = true;
menus.interactive =true;

player_view.visible = false;
player_view.interactive = false;


var player = {};
var wrold;
var lava_layer;
var tu;

var sword_hilt;
var sword_guard;
var sword_blade;

var monster_1 = {};

var move_left = 1;
var move_right = 2;
var move_up = 3;
var move_down = 4;
var move_none = 0;

var speed = 32;
var tween_speed = 200;

function move() {

	if (player.direction == move_none) {

		player.moving = false;
		console.log(player.y);
		return;
	}



	player.moving = true;
	console.log("move");


	//var hitLava0 = tu.hitTestTile(player, lava_layer, 0, world, 'every');
	var hitLava1 = tu.hitTestTile(player, lava_layer, 1, world, 'every');
	var hitLava2 = tu.hitTestTile(player, lava_layer, 2, world, 'every');
	var hitLava3 = tu.hitTestTile(player, lava_layer, 3, world, 'every');


	console.log(hitLava1);
	if(hitLava1.hit || hitLava2.hit || hitLava3.hit){
		player.direction = move_none;
		death(player);
		move();
		return;
	}


	if (player.direction == move_left){
		createjs.Tween.get(player).to({x: player.x - speed}, tween_speed).call(move);
	}

	else if (player.direction == move_right){
		createjs.Tween.get(player).to({x: player.x + speed}, tween_speed).call(move);
	}

	else if (player.direction == move_up){
		createjs.Tween.get(player).to({y: player.y - speed}, tween_speed).call(move);
	}

	else if (player.direction == move_down){
		createjs.Tween.get(player).to({y: player.y + speed}, tween_speed).call(move);
	}
}


function death(sprite){

	createjs.Tween.get(sprite.scale).to({x: 0, y: 0}, 2000);
}

var to_overwrite = [65, 83, 87, 68];

var previous_direction = 0;

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

	console.log(e.keyCode);
	move();
	});

var directions_list = [move_up, move_down, move_left, move_right];
var keycode_list = [87, 83, 65, 68];


window.addEventListener('keyup', function onKeyUp (e) {

	console.log(e.keyCode, to_overwrite.indexOf(e.keyCode));
	if(to_overwrite.indexOf(e.keyCode) === -1) return true;



	if (!player) return;
	
	player.direction = move_none;

	/*
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

PIXI.loader
	.add('map_json', './tile_assets/map.json')
	.add('map_png', './tile_assets/tileset.png')
	.add('./object_assets/entities.json')
	.load(load_game);

PIXI.loader
	.add('./menu_assets/menus.json')
	.load(load_menus);


function load_menus(){

	var title = new PIXI.Sprite(PIXI.Texture.fromFrame('title.png'));
	menus.addChild(title);
	title.interactive = true;
	title.on('mousedown', changeView.bind(null,player_view));
}





function load_game(){

	tu = new TileUtilities(PIXI);
	world = tu.makeTiledWorld('map_json', './tile_assets/tileset.png');
	player_view.addChild(world);

	var hero = world.getObject("hero")
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



	var monster1 = world.getObject("monster1");
	var monster2 = world.getObject("monster2");
	var monster3 = world.getObject("monster3");

	monster_1 = new PIXI.Sprite(PIXI.Texture.fromFrame('monster.png'));


	monster_1.x = monster1.x;
	monster_1.y = monster1.y;
	monster_1.anchor.x = 0.5;
	monster_1.anchor.y = 1.0;


	player = new PIXI.Sprite(PIXI.Texture.fromFrame('hero.png'));

	player.x = hero.x;
	player.y = hero.y;
	player.anchor.x = 0.0;
	player.anchor.y = 1.0;


	lava_layer = world.getObject('lava_layer').data;

	var entity_layer = world.getObject("entities");
	entity_layer.addChild(player);
	entity_layer.addChild(sword_hilt);
	entity_layer.addChild(sword_guard);
	entity_layer.addChild(sword_blade);
	entity_layer.addChild(monster_1);
	



	

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

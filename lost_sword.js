// Basic game setup to display in HTML
var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(800, 800);
gameport.appendChild(renderer.view);


var stage = new PIXI.Container();


var player;
var wrold;

PIXI.loader
	.add('map_json', './tile_assets/map.json')
	.add('map_png', './tile_assets/tileset.png')
	.add('./object_assets/entities.json')
	.load(load_game);



function load_game(){

	var tu = new TileUtilities(PIXI);
	world = tu.makeTiledWorld('map_json', './tile_assets/tileset.png');
	stage.addChild(world);

	var hero = world.getObject("hero")

	player = new PIXI.Sprite(PIXI.Texture.fromFrame('hero.png'));

	player.x = hero.x;
	player.y = hero.y;
	player.anchor.x = 0.0;
	player.anchor.y = 1.0;



	var entity_layer = world.getObject("entities");
	entity_layer.addChild(player);

	player.direction = false;
	player.moving = false;
	animate();




}






// Generic animate function that draws the whole thing
function animate(){
	requestAnimationFrame(animate);
	renderer.render(stage);


}

animate();
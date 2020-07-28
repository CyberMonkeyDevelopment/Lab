// Import the ajs CORE
import defaultExport from "./ajs.js";
// Load basic UI components
import { Stage } from "./ui/stage.js";
import { Frame, MovieClip } from "./ui/movieClip.js";
import { BitMap } from "./ui/bitMap.js";
import { TextField } from "./ui/textField.js";
import { Button } from "./ui/button.js";
/*
	Set up a Stage object. This will manage all other ajs objects
*/
window.Main = {
	is_playing: false,
	score: 0,
	time: 120,
	stage: null,
	tank: null,
	base_speed: 12,
	base_fr: 24, // 24 frames per second
	health: 10,
	health_bar: null,
	score_txt: null,
	time_txt: null,
	ground: null,
	background: null,
	blaster: { // All properties for the blaster
		speed: 20,
		cool_down: 24,
		heat: 0,
		targets: []
	},
	pick_ups: {
		rapid_fire: 0
	},
	sceen1: { // The intro screen
		init: function()
		{
			Main.stage = new Stage({
				frame_rate: Main.base_fr,
				parent: "stage_wrap",
				color: "#500"
			});
			let mid_x = (Main.stage.width * 0.5);
			let bg_monkey = new BitMap("./images/monkey_intro.png", {
				x: 600,
				y: 240,
				width: 400
			});
			let ttl_txt = new TextField({
				text: "Mad Monkey and the Tunderdome",
				x:  mid_x - 400,
				y: 100,
				width: 800,
				"font-family": "Impact, Arial Black, Arial, sans-serif",
				"text-align": "center",
				"font-size": 42
			});
			let intro_txt = new TextField({
				text: "Use the keyboard to steer the monkey tank and blast away objects. Look for power-ups to help along the way.",
				x: mid_x - 250,
				y: 200,
				width: 500,
				"font-size": 18
			});
			let btn_font_fam = "Impact, Arial Black, Arial, sans-serif";
			let btn_font_size = "32px";
			let start_btn = new Button({
				x: mid_x - 50,
				y: 280,
				width: 100,
				states: {
					up: "<span style='color: #900; font-size: " + btn_font_size + "; font-family: " + btn_font_fam + ";'>Start</span>",
					over: "<span style='color: #990; font-size: " + btn_font_size + "; font-family: " + btn_font_fam + ";'>Start</span>",
					focus: "<span style='color: #990; font-size: " + btn_font_size + "; font-family: " + btn_font_fam + ";'>Start</span>",
					hit: "<span style='color: #000; font-size: " + btn_font_size + "; font-family: " + btn_font_fam + ";'>Start</span>"
				}
			});
			
			start_btn.addEventListener("click", (function(){
				Main.stage.destroy();
				Main.sceen2.init();
			}));
			
			Main.stage.add(bg_monkey);
			Main.stage.add(ttl_txt);
			Main.stage.add(intro_txt);
			Main.stage.add(start_btn);
			
		}
	},	// End of sceen1 
	sceen2: {
		init: function()
		{
			Main.stage = new Stage({
				frame_rate: Main.base_fr,
				parent: "stage_wrap",
				color: "linear-gradient(to bottom, #066dab  0%, #8abbd7 31%, #c5deea 100%);"
			});
			// Build the tank monkey MovieClip
			Main.tank = new MovieClip({
				x: (Main.stage.width * 0.5) - 140,
				y: (Main.stage.height * 0.5) - 110,
				z: 100,
				width: 135,
				height: 115,
				hit_area: {
					x: 20,
					y: 40,
					width: 80,
					height: 60
				}
			});
			// Add the frames for the monkey tank
			for( let a =1; a < 20; a++)
			{
				let f = new Frame();
				let b = Math.ceil(a / 5);
				f.add(new BitMap("./images/tank_monkey_" + b + ".png"));
				Main.tank.addFrame(f);
			}
			let last_tf = Main.tank.frames[Main.tank.frames.length - 1];
			last_tf.label = "rove_end";
			// Add the hurt frames
			for( let a =0; a < 4; a++)
			{
				let f = new Frame();
				if(a == 0)
					f.label = "hit";
				f.add(new BitMap("./images/tank_monkey_hurt.png"));
				Main.tank.addFrame(f);
			}
			last_tf = Main.tank.frames[Main.tank.frames.length - 1];
			last_tf.label = "hit_end";
			let f = new Frame({
				label: "wreck"
			});
			f.add(new BitMap("./images/tank_monkey_wreck.png"));
			Main.tank.addFrame(f);
			// tank.speed is how fast the tank moves on key press
			Main.tank.health = 10;
			Main.tank.speed = 14;
			// Add the health bar MovieClip
			Main.health_bar = new MovieClip({
				x: 10,
				y: 10,
				width: 25,
				height: 100,
				z: 1000
			});
			let a = 1, b = 12;
			for( a; a < b; a++)
			{
				let f = new Frame();
				f.add(new BitMap("./images/health_bar_" + a + ".png"));
				Main.health_bar.addFrame(f);
			}
			// Add score text fields
			var score_txt_lbl = new TextField({
				text: "Score: ",
				x: 40,
				y: 10,
				z: 1100
			});
			Main.stage.add(score_txt_lbl);
			Main.score_txt = new TextField({
				text: Main.score,
				color: "#33f",
				x: 100,
				y: 10,
				z: 1100,
				"font-size": 21,
				"font-weight": 900
			});
			Main.stage.add(Main.score_txt);
			// Add time TextField(s)
			var time_txt_lbl = new TextField({
				text: "Time: ",
				x: 40,
				y: 50,
				z: 1100
			});
			Main.stage.add(time_txt_lbl);
			Main.time_txt = new TextField({
				text: Main.time,
				x: 100,
				y: 50,
				z: 1100,
				color: "#33f",
				"font-size": 21,
				"font-weight": 900
			});
			Main.stage.add(Main.time_txt);
			// Add the moving ground MovieClip
			Main.ground = new MovieClip({
				x: 0,
				y: 200,
				z: 20,
				width: 2400,
				height: 400
			});
			let gf1 = new Frame();
			gf1.add(new BitMap("./images/ground_1.png"));
			Main.ground.addFrame(gf1);
			// Add the background mountains MovieClip
			Main.background = new MovieClip({
				x: 0,
				y: 0,
				z: 10,
				width: 2000,
				height: 200
			});
			let mf1 = new Frame();
			mf1.add(new BitMap("./images/back_drop_1.png"));
			Main.background.addFrame(mf1);
			
			Main.stage.add(Main.tank);
			Main.stage.add(Main.health_bar);
			Main.stage.add(Main.ground);
			Main.stage.add(Main.background);
			
			Main.stage.addEventListener(ajs.event.ENTER_FRAME, Main.sceen2.stageEnterFrame);
			Main.tank.addEventListener(ajs.event.ENTER_FRAME, Main.tankEnterFrame);
			Main.health_bar.addEventListener(ajs.event.ENTER_FRAME, Main.healthEnterFrame);
			Main.is_playing = true;
			
		}, // End sceen2.init
		stageEnterFrame: function(e)
		{
			// Manage stage stuff here
			// Move the background
			if(!Main.is_playing)
				return false;
			Main.score_txt.text = Main.score;
			if((Main.score >= 3000) || (Main.time <= 0))
			{ // WIN!
				Main.sceen2.win();
				Main.is_playing = false;
				return false;
			}
			if(Main.stage.frames_played % Main.stage.frame_rate == 0)
			{
				Main.time--;
				Main.time_txt.text = Main.time;
			}
			if(Main.pick_ups.rapid_fire > 0)
			{
				Main.pick_ups.rapid_fire--;
				Main.blaster.heat -= 2;
			}
			if(Main.time <= 0)
			{
				Main.sceen2.lose();
				Main.is_playing = false;
				return false;
			}
			if(Main.tank.health <= 0)
			{
				Main.sceen2.lose();
				Main.tank.goTo("wreck", "stop");
				Main.is_playing = false;
				return false;
			}
			Main.ground.x -= Main.base_speed;
			if(Main.ground.x < - 1140)
				Main.ground.x = 0;
			Main.background.x -= 1;
			if(Main.background.x < -1030)
				Main.background.x = 0;
			// Check for blaster
			if(key_state.space)
				Main.fireBlast();
			if(Main.blaster.heat > 0)
				Main.blaster.heat--;
			else if(Main.blaster.heat < 0)
				Main.blaster.heat = 0;
			// Add random cactus
			let cac_ran = (Math.random() + (Main.score * 0.00001));
			if(cac_ran > 0.95)
				Main.generateCactus();
			// Add random pick ups
			let pu_ran = (Math.random());
			if(pu_ran > 0.995)
				Main.generatePickUpRF();
		},
		win: function()
		{
			let screen = new MovieClip({
				z: 2000
			});
			let screen_frame = new Frame();
			let screen_bm = new BitMap("./images/screen_backdrop.png");
			screen_frame.add(screen_bm);
			screen.addFrame(screen_frame);
			let congrats = new TextField({
				text: "Congratulations!",
				"font-size": 32,
				"font-weight": 900,
				"text-align": "center",
				x: Main.stage.width * 0.5 - 150,
				y: 100,
				z: 2100,
				width: 300,
				color: "#f93"
			});
			let stg1_comp_txt = new TextField({
				text: "Stage 1 complete",
				"font-size": 21,
				"text-align": "center",
				x: Main.stage.width * 0.5 - 150,
				y: 140,
				z: 2100,
				width: 300,
				color: "#f93"
			});
			let score = new TextField({
				text: "Score: " + Main.score,
				x: Main.stage.width * 0.5 - 150,
				y: 220,
				z: 2100,
				width: 300,
				color: "#55f",
				"font-size": 21,
				"font-weight": 900,
				"text-align": "center"
			});
			let time_bonus = Math.round(Main.time * 10);
			let tb_txt = new TextField({
				text: "Time Bonus: " + time_bonus,
				x: Main.stage.width * 0.5 - 150,
				y: 260,
				z: 2100,
				width: 300,
				color: "#55f",
				"font-size": 21,
				"font-weight": 900,
				"text-align": "center"
			});
			let health_bonus = Math.round(Main.tank.health * 100);
			let hb_txt = new TextField({
				text: "Health Bonus: " + health_bonus,
				x: Main.stage.width * 0.5 - 150,
				y: 300,
				z: 2100,
				width: 300,
				color: "#55f",
				"font-size": 21,
				"font-weight": 900,
				"text-align": "center"
			});
			let total_score = Math.round(Main.score + time_bonus + health_bonus);
			let ts_txt = new TextField({
				text: "Total Score: " + total_score,
				x: Main.stage.width * 0.5 - 150,
				y: 380,
				z: 2100,
				width: 300,
				color: "#ff3",
				"font-size": 28,
				"font-weight": 900,
				"text-align": "center"
			});
			Main.stage.add(screen);
			Main.stage.add(congrats);
			Main.stage.add(stg1_comp_txt);
			Main.stage.add(score);
			Main.stage.add(tb_txt);
			Main.stage.add(hb_txt);
			Main.stage.add(ts_txt);
		},
		lose: function()
		{
			let screen = new MovieClip({
				z: 2000
			});
			let screen_frame = new Frame();
			let screen_bm = new BitMap("./images/screen_backdrop.png");
			screen_frame.add(screen_bm);
			screen.addFrame(screen_frame);
			let sorry = new TextField({
				text: "You've Lost...",
				"font-size": 32,
				"font-weight": 900,
				"text-align": "center",
				x: Main.stage.width * 0.5 - 150,
				y: 100,
				z: 2100,
				width: 300,
				color: "#c3c"
			});
			let stg1_comp_txt = new TextField({
				text: "Stage 1 failed",
				"font-size": 21,
				"text-align": "center",
				x: Main.stage.width * 0.5 - 150,
				y: 140,
				z: 2100,
				width: 300,
				color: "#c3c"
			});
			let score = new TextField({
				text: "Score: " + Main.score,
				x: Main.stage.width * 0.5 - 150,
				y: 220,
				z: 2100,
				width: 300,
				color: "#55f",
				"font-size": 21,
				"font-weight": 900,
				"text-align": "center"
			});
			let time_bonus = 0; //Math.round(Main.time * 10);
			let tb_txt = new TextField({
				text: "Time Bonus: " + time_bonus,
				x: Main.stage.width * 0.5 - 150,
				y: 260,
				z: 2100,
				width: 300,
				color: "#55f",
				"font-size": 21,
				"font-weight": 900,
				"text-align": "center"
			});
			let health_bonus = Math.round(Main.tank.health * 100);
			let hb_txt = new TextField({
				text: "Health Bonus: " + health_bonus,
				x: Main.stage.width * 0.5 - 150,
				y: 300,
				z: 2100,
				width: 300,
				color: "#55f",
				"font-size": 21,
				"font-weight": 900,
				"text-align": "center"
			});
			let total_score = Math.round(Main.score + time_bonus + health_bonus);
			let ts_txt = new TextField({
				text: "Total Score: " + total_score,
				x: Main.stage.width * 0.5 - 150,
				y: 380,
				z: 2100,
				width: 300,
				color: "#ff3",
				"font-size": 28,
				"font-weight": 900,
				"text-align": "center"
			});
			Main.stage.add(screen);
			Main.stage.add(sorry);
			Main.stage.add(stg1_comp_txt);
			Main.stage.add(score);
			Main.stage.add(tb_txt);
			Main.stage.add(hb_txt);
			Main.stage.add(ts_txt);
			
		}
	}, // End sceen2 stuff
	tankEnterFrame: function(e)
	{
		let tank = e.target.instance; // Pointer to tank MovieClip
		let cur_frame = tank.frames[tank.current_frame - 1];	
		if(cur_frame.label == "rove_end" || cur_frame.label == "hit_end")
			tank.goTo(1);
		if(!Main.is_playing)
			return false;
		if(key_state.up && (tank.y > 120))
			tank.y -= tank.speed;
		if(key_state.down && (tank.y < Main.stage.height - tank.height))
			tank.y += tank.speed;
		if(key_state.left && (tank.x > - 40))
			tank.x -= tank.speed;
		if(key_state.right && (tank.x < Main.stage.width - tank.width))
			tank.x += tank.speed;
	},
	healthEnterFrame: function(e)
	{
		let health_bar = e.target.instance; // Pointer to health MovieClip
		switch(Main.tank.health)
		{
			case 10:
				health_bar.goTo(1, "stop");
				break;
			case 9:
				health_bar.goTo(2, "stop");
				break;
			case 8:
				health_bar.goTo(3, "stop");
				break;
			case 7:
				health_bar.goTo(4, "stop");
				break;
			case 6:
				health_bar.goTo(5, "stop");
				break;
			case 5:
				health_bar.goTo(6, "stop");
				break;
			case 4:
				health_bar.goTo(7, "stop");
				break;
			case 3:
				health_bar.goTo(8, "stop");
				break;
			case 2:
				health_bar.goTo(9, "stop");
				break;
			case 1:
				health_bar.goTo(10, "stop");
				break;
			default:
				health_bar.goTo(11, "stop");
				break;
				
		}
	},
	fireBlast: function()
	{
		if(Main.blaster.heat > 0)
			return false;
		Main.blaster.heat = Main.blaster.cool_down;
		// Build the blast ball MovieClip
		let blast = new MovieClip({
			x: Main.tank.x + 105,
			y: Main.tank.y + 45,
			width: 50,
			height: 50,
			z: 200,
			hit_area: {
				x: 10,
				y: 10,
				width: 30,
				height: 30
			}
		});
		for( let a = 1; a < 10; a++)
		{
			let f = new Frame();
			let b = Math.ceil(a / 5);
			f.add(new BitMap("./images/blast_" + b + ".png"));
			blast.addFrame(f);
		}
		blast.addEventListener(ajs.event.ENTER_FRAME, Main.moveBlast);
		Main.stage.add(blast);
	},
	moveBlast: function(e)
	{
		let blast = e.target.instance;
		blast.x += Main.blaster.speed;
		if(blast.x > Main.stage.width)
			Main.stage.remove(blast);
		let a = 0, b = Main.blaster.targets.length; //blast_targets.length;
		for( a; a < b; a++)
		{
			let trg = Main.blaster.targets[a];
			if(typeof trg != "object")
				continue;
			if(ajs.hitTest(blast, trg))
			{
				if(trg.points)
					Main.score += trg.points;
				else
					Main.score += 10;
				Main.stage.remove(blast);
				Main.stage.remove(trg);  
				let trg_idx = Main.blaster.targets.indexOf(trg);
				if(trg_idx > -1)
					Main.blaster.targets.splice(trg_idx, 1);
			}
		}
	},
	generateCactus: function()
	{
		let cactus = new MovieClip({
			x: Main.stage.width + 200,
			y: (Math.random() * 400) + 150,
			z: 60,
			width: 50,
			height: 100
		});
		cactus.points = 100;
		let cf1 = new Frame();
		cf1.add(new BitMap("./images/cactus_1.png"));
		cactus.addFrame(cf1);
		Main.stage.add(cactus);
		Main.blaster.targets.push(cactus);
		cactus.addEventListener(ajs.event.ENTER_FRAME, Main.moveCactus);
	},
	moveCactus: function(e)
	{
		if(!Main.is_playing)
			return false;
		let cactus = e.target.instance;
		cactus.x -= Main.base_speed;
		if(cactus.x < -cactus.width)
			Main.stage.remove(cactus);
		// Check for hit with tank
		if(ajs.hitTest(Main.tank, cactus))
		{
			Main.stage.remove(cactus);
			Main.tank.goTo("hit");
			Main.tank.health--;
			Main.showExplosion(Main.tank.x + 100, Main.tank.y + 50);
		} 
	},
	generatePickUpRF()
	{
		let pu = new MovieClip({
			x: Main.stage.width + 200,
			y: (Math.random() * 400) + 200,
			z: 70,
			width: 50,
			height: 30
		});
		let puf1 = new Frame(),
			puf2 = new Frame(),
			puf3 = new Frame(),
			puf4 = new Frame();
		puf1.add(new BitMap("./images/pick_ups_rapid_1.png"));
		puf2.add(new BitMap("./images/pick_ups_rapid_2.png"));
		puf3.add(new BitMap("./images/pick_ups_rapid_3.png"));
		puf4.add(new BitMap("./images/pick_ups_rapid_2.png"));
		pu.addFrame(puf1);
		pu.addFrame(puf2);
		pu.addFrame(puf3);
		pu.addFrame(puf4);
		Main.stage.add(pu);
		//console.log(pu);
		pu.addEventListener(ajs.event.ENTER_FRAME, Main.movePickUpRF);
	},
	movePickUpRF: function(e)
	{
		if(!Main.is_playing)
			return false;
		let pu = e.target.instance;
		pu.x -= Main.base_speed;
		if(pu.x < -pu.x)
			Main.stage.remove(pu);
		if(ajs.hitTest(Main.tank, pu))
		{
			Main.stage.remove(pu);
			Main.pick_ups.rapid_fire = Main.base_fr * 5; // 5 seconds worth of rapid_fire
		}
	},
	showExplosion: function(_x, _y)
	{
		let exp = new MovieClip({
			x: (typeof _x === "number") ? _x : 0,
			y: (typeof _y === "number") ? _y : 0,
			z: 300,
			width: 40,
			height: 40
			
		});
		let b1 = new BitMap("./images/explosion_1.png");
		let b2 = new BitMap("./images/explosion_2.png");
		let a = 0, b = 10;
		for( a; a < b; a++)
		{
			let f = new Frame(), i;
			if(a % 2 == 0)
				i = new BitMap("./images/explosion_1.png");
			else
				i = new BitMap("./images/explosion_2.png");
			f.add(i);
			exp.addFrame(f);
		}
		Main.stage.add(exp);
		exp.addEventListener(ajs.event.ENTER_FRAME, Main.checkExplosion);
	},
	checkExplosion: function(e)
	{
		var exp = e.target.instance;
		exp.x -= 12;
		if((exp.x < -exp.width) || (exp.current_frame >= exp.frames.length -1))
			Main.stage.remove(exp);
	}
} // End Main
/*
	No need to bind keys to Main
*/
var key_state = {
	up: false,
	down: false,
	left: false,
	right: false,
	space: false,
	enter: false
}
var key_bind = {
	up: 38,
	down: 40,
	left: 37,
	right: 39,
	space: 32,
	enter: 13
}
function keyDownHandler(e)
{
	//console.log(e.keyCode);
	switch(e.keyCode)
	{
		case key_bind.up:
			key_state.up = true;
			break;
		case key_bind.down:
			key_state.down = true;
			break;
		case key_bind.left:
			key_state.left = true;
			break;
		case key_bind.right:
			key_state.right = true;
			break;
		case key_bind.space:
			key_state.space = true;
			break;
		case key_state.enter:
			key_state.enter = false;
			break;
	}
}
function keyUpHandler(e)
{
	//console.log(e.keyCode);
	switch(e.keyCode)
	{
		case key_bind.up:
			key_state.up = false;
			break;
		case key_bind.down:
			key_state.down = false;
			break;
		case key_bind.left:
			key_state.left = false;
			break;
		case key_bind.right:
			key_state.right = false;
			break;
		case key_bind.space:
			key_state.space = false;
			break;
		case key_state.enter:
			key_state.enter = false;
			break;
	}
}
document.body.addEventListener("keydown", keyDownHandler);
document.body.addEventListener("keyup", keyUpHandler);
Main.sceen1.init();

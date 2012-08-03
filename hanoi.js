
var GAME_ARRAY = [];//new Array();
// 难度靠这个, 位置还是需要重新计算的
var GAME_STACK = 3;
var PIE_SELECT = -1;
var TABLE_SELECT = -1;
var GAME_OVER = false;

function debug(pa){
    try{
	console.dir(pa);
    } catch(e) {}
}

function get_style(){
    var styles = Array("rgba(0, 0, 200, 0.5)", "rgba(200, 200, 0, 0.5)", "rgba(100, 100, 100, 0.5)");
    Math.round((Math.random() * 1000) % styles.length) - 1;
    return styles[Math.round((Math.random() * 1000) % styles.length) - 1];
}

function draw_background() {
    $(".hanoi").css({'height': '1px', 'width' :  '1000px'});//, 'background-image' : "url('bg.jpg')", 'z-index' : -99999});
}



function roundRectanglePath(context, rect, radius)
{
    context.beginPath();
    context.moveTo(rect.getX() + radius, rect.getY());
    context.lineTo(rect.getRight()-radius,rect.getY());
    context.arc( rect.getRight()-radius,rect.getY() + radius, radius, 3*Math.PI/2,2*Math.PI, false);
    context.lineTo( rect.getRight(),rect.getBottom()-radius);
    context.arc( rect.getRight()-radius,rect.getBottom()-radius, radius, 0, Math.PI/2, false);
    context.lineTo( rect.getX()+radius,rect.getBottom() );
    context.arc( rect.getX()+radius,rect.getBottom()-radius, radius, Math.PI/2, Math.PI, false);
    context.lineTo( rect.getX(),rect.getY()+radius);
    context.arc( rect.getX()+radius,rect.getY()+radius, radius,Math.PI, 3*Math.PI/2, false);
    context.closePath();
}


function draw_round_rect(row, line){
    // 非贴图
    var canvas = document.createElement("canvas");
    canvas.id = 'c_' + row + "_" + line;
    $('.hanoi').append(canvas);
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(192, 80, 77)";
    ctx.strokeStyle = "rgb(192, 80, 77)";

    var _rect = new Rect(0, 0, 100, 49);
    roundRectanglePath(ctx, _rect, 2);
    ctx.stroke();
}

function draw_table(line){
    $(".hanoi").append("<div id='table_" + line + "' tid=" + line + "></div>");
    var canvas = document.createElement("canvas");
    canvas.id = 't_' + line;
    canvas.width = 300;
    canvas.height = 500;
    $('#table_' + line).append(canvas);
    $('#table_' + line).css({'display' : 'block', 'float': 'left', 'border' : '1px solid', 'z-index' : '99999'});
    var _rect = new Rect(0, 420, 300, 12);
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(192, 80, 77)";
    ctx.strokeStyle = "rgb(192, 80, 77)";
    roundRectanglePath(ctx, _rect, 2);
    ctx.fill();
    var _lrect = new Rect(150, 30, 10, 390);
    roundRectanglePath(ctx, _lrect, 2);
    ctx.fill();
    ctx.stroke();
}


function draw_pie(size){
    $("body").append("<div id='pie_" + size+ "'></div>");
    var canvas = document.createElement("canvas");
    canvas.id = 'p_' + size;
    var h = 15;// + (3 - size) * 10;
    //var h = 15 + (3 - size) * 10;
    canvas.width = 200 + 25 * size;
    canvas.height = h
    $('#pie_' + size).append(canvas);
    $("#pie_" + size).css({'height': '500px', 'width' :  '1000px', 'float':'left', 'position':'absolute','left':'0','top':'0', 'z-index' : -9989});
    $('#p_' + size).css({'margin-top' : (435 - h - (GAME_STACK - size) * h) + 'px'});
    var _rect = new Rect(34 * (GAME_STACK - size) + 50, 0, 300, h);
    var ctx = canvas.getContext("2d");
    roundRectanglePath(ctx, _rect, 2);
    ctx.fillStyle = get_style();
    ctx.strokeStyle = get_style();
    ctx.fill();
    //ctx.stroke();
}

function init_map(){
    // 画托盘
    draw_table(0);
    draw_table(1);
    draw_table(2);

    $('canvas').css({'margin-left':'6px', 'margin-top' : '6px'});

    // 动态添加三个pie的div
    for(i = GAME_STACK; i > 0; i--){
	draw_pie(i);
    }
    GAME_ARRAY[0] = [];
    for(i = GAME_STACK; i > 0; i--){
	GAME_ARRAY[0].unshift(i);
    }
    // 这里其实只有2组剩余，不过多点也没啥坏处，因此就这么实现吧.
    for(i = 1; i < GAME_STACK; i++){
        GAME_ARRAY[i] = [];
    }
}


function draw_border(){
}

function show_select_status(){
    debug("SELECT_TABLE:" + TABLE_SELECT + ", PIE_SELECT: " + PIE_SELECT);
}


function drop_able(pie, table){
    console.log("drop_able:" + table);
    console.log(GAME_ARRAY[table]);
    if(GAME_ARRAY[table].length == 0){
	return true;
    }
    return pie > GAME_ARRAY[table][0] ? false : true;
}

function select_table(table){
    if(GAME_ARRAY[table][0] != undefined){
	PIE_SELECT = GAME_ARRAY[table].shift();
	TABLE_SELECT = table;
	var new_top = 70;
	$('#p_' + PIE_SELECT).css({'margin-top' : new_top + "px"});

    }
}

function drop_table(table){
    console.log(table);
    if(drop_able(PIE_SELECT, table)){
	var new_top = 420 - (GAME_ARRAY[table].length) * 15;
	$('#p_' + PIE_SELECT).css({'margin-top' : new_top + "px"});
	$('#pie_' + PIE_SELECT).css({'margin-left' : 305 * table + "px"});
	GAME_ARRAY[table].unshift(PIE_SELECT);
	PIE_SELECT = -1;
	TABLE_SELECT = -1;
    }
}
function check_success(){
    // 因为只有三根棍子，因此这里的索引是2
    return GAME_ARRAY[2].length == GAME_STACK ? true : false;
}
function init_logic(){
    $('.hanoi').children().each(function(item){
        var i = $(this)[0];
        $(this).click(function(){
	    if(GAME_OVER) return;
	    var tid = $(this).attr('tid');
	    console.log("Check:" + tid);
	    if(TABLE_SELECT > -1){
		drop_table(tid);
	    } else  {
		select_table(tid);
	    }
	    if(check_success()){
		GAME_OVER = true;
		alert("游戏结束");
	    };
        });
    });
}


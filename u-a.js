//logo generator for U - A Umanesimo Artificiale
//author: Luca Ucciero



//bug test
//***************************
function debug() {
  var bmt = [
    [0, 2, 0, 0, 2, 0, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 2, 2, 0, 0, 0],
    [0, 0, 2, 2, 2, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0],
    [0, 2, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 0]
  ];
  return bmt;
}
//***************************

//define the random integer function
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//add the event listener to the dom
document.addEventListener("DOMContentLoaded", function() {




  //sliders & controls
  //creSlider -> slider to add cells
  //emoSlider -> slider connected to emotions, add grayscale
  //effSlider -> slider to swap cells into 0, 1 graphically
  var creSlider = document.getElementById('creSlider'),
      emoSlider = document.getElementById('emoSlider'),
      effSlider = document.getElementById('effSlider'),
      alcSlider = document.getElementById('alcSlider'),
      zerSlider = document.getElementById('zerSlider'),
      saveButton= document.getElementById('save'),
      nameInput = document.getElementById('name');

  //I'll use it to get a click/tap event on the canvas
  var matContainer = document.getElementById('sketch-holder');

  var holder = document.getElementById('sketch-holder');
  var cont = document.getElementById('sketch-container');
  var main = document.getElementById('main-container');

  var focus;
  if (window.innerWidth < 991 ) {
    nameInput.onblur = function() {
      focus = false
      holder.style.cssText = "top: 16px;";
      cont.style.cssText = "top: 0px;";
    };
    nameInput.onfocus = function() {
      focus = true;
      holder.style.cssText = "top: -40vh;";
      cont.style.cssText = "top: -40vh;";
    };
  }

  //some beauty to the page
  window.addEventListener("scroll", function(){
    var downArrow = document.getElementById('down-arrow');
    downArrow.classList.remove("supermario");
    downArrow.classList.add("ghost");
  });

  main.addEventListener("touchstart", function(){
    if (focus = true) {
      nameInput.blur();
      focus = false;
    }
  })


  //define the cells

  //18 var cells = [0, 0, 0 ,1 ,1 ,1 ,0 ,0 ,0 , 0, 0, 0, 0, 0, 0, 0, 0, 0];
  //9  var cells = [0, 0, 0 ,1 ,1 ,1 ,0 ,0 ,0];
  //27 var cells = [0, 0, 0 ,1 ,1 ,1 ,0 ,0 ,0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,1 ,1 ,1 ,0 ,0 ,0];
  var cells = [0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 , 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0];

  var matrix = [];

  //from "Tables of Cellular Automaton Properties" paper, 1986
  var rulesList = [
    ['rule_150', [1, 0, 0, 1, 0, 1, 1, 0]],
    ['rule_110', [0, 1, 1, 0, 1, 1, 1, 0]],
    ['rule_73',  [0, 1, 0, 0, 1, 0, 0, 1]],
    ['rule_105', [0, 1, 1, 0, 1, 0, 0, 1]],
    ['rule_43',  [0, 0, 1, 0, 1 ,0, 1, 1]],
    ['rule_1',   [0, 0, 0, 0, 0, 0, 0, 1]],
    ['rule_11',  [0, 0, 0, 0, 1, 0, 1, 1]],
    ['rule_18',  [0, 0, 0, 1, 0, 0, 1, 0]],
    ['rule_19',  [0, 0, 0, 1, 0, 0, 1, 1]]
  ];

  var currentRule = 4;
  //var w = 16;
  var canvasWidth = (matContainer.clientWidth);
  var w = Math.round(canvasWidth/cells.length);
  if(w*cells.length > canvasWidth){
    w = Math.round((canvasWidth/cells.length)-0.6);
  }
  canvasWidth = w*cells.length;

  //adding colors:
  //write outside the draw() a function to add colors.
  //if there is a parameter different from 0 on the emoSlider then add colors.


  //generate a blank all 0s matrix
  function generateMatrix(){
    //create a row filled with zeros, we'll mutate them after
    var row = [];
    for (var c = 0; c < cells.length; c++){
      row.push(0)
    }
    for (var i = 0; i < cells.length; i++){
      //push the row into the matrix
      matrix.push(row.slice());
    }
  }
  generateMatrix();

  function wolfRamize(cells, matrix){
    //take the existing matrix
    //and then apply the wolfram cellular automaton
    //cellular automaton based on Shiffman's book The Nature of Code http://natureofcode.com/

    wolfMatrix = matrix.slice();
    var ruleset = rulesList[currentRule][1];

    for (var i = 0; i < wolfMatrix[0].length; i++){
      wolfMatrix[0][i] = cells[i]
    }
    //for every row, start from the 1 row not 0
    for (var i = 1; i < wolfMatrix.length -1; i++){
      //For every spot, determine new state by examing current state, and neighbor states
      //Ignore edges that only have one neighor
      for (var j = 1; j < wolfMatrix[0].length-1; j++) {
        var left   = wolfMatrix[i-1][j-1];   // Left neighbor state
        var me     = wolfMatrix[i-1][j];     // Current state
        var right  = wolfMatrix[i-1][j+1];   // Right neighbor state
        //update the wolfMatrix state with wolframized cells
        wolfMatrix[i][j] = rules(left, me, right);
      }
    }

    function rules(a, b, c) {
      if (a == 1 && b == 1 && c == 1) return ruleset[0];
      if (a == 1 && b == 1 && c === 0) return ruleset[1];
      if (a == 1 && b === 0 && c == 1) return ruleset[2];
      if (a == 1 && b === 0 && c === 0) return ruleset[3];
      if (a === 0 && b == 1 && c == 1) return ruleset[4];
      if (a === 0 && b == 1 && c === 0) return ruleset[5];
      if (a === 0 && b === 0 && c == 1) return ruleset[6];
      if (a === 0 && b === 0 && c === 0) return ruleset[7];
      return 0;
    };

    return wolfMatrix;
  }

  //what to draw

  //p5.js main. In instance mode
  //https://github.com/processing/p5.js/wiki/Global-and-instance-mode
  //that's why a use that "weird" p  before p5.js methods
  var s = function( p ) {


    var creArt = [];
    var nasa;
    p.preload = function(){
    //creativity images array holder

    var maximgs = 20;
    var allimgs = 70;
      for (var i = 1; i <= maximgs; i++) {
        creArt[i] = p.loadImage('img/cre/'+(getRandomInt(70)+1)+'.jpg');
      }
      nasa = p.loadImage('img/amb/'+(getRandomInt(70)+1)+'.jpg');
    }


    //about loop & noLoop: https://p5js.org/reference/#/p5/noLoop
    // I used them to stop and restart the draw fuction
    //otherwise it will loop continuosly as defined in the p5.js library

    // -------o------- sliders change callback function:

    //generation zero slider
    creSlider.addEventListener("input", function(){
        if (cells[creSlider.value] === 0 ) {
          cells[creSlider.value] = 1
        } else {
          cells[creSlider.value] = 0
        }
      console.log(cells);
      p.loop();
    });
    //creative
    //new one
    // change ruleset on slide
    zerSlider.addEventListener("input", function(){
        //get the actual rule applied
        // go to the next one if the value is > than current index
      if (zerSlider.value > currentRule && currentRule >= 0 && currentRule < rulesList.length ) {
        currentRule = currentRule + 1
        console.log(rulesList[currentRule][0]);
        // otherwise if the value is < than current index go to the previous
      } else if (zerSlider.value < currentRule && currentRule > 0 && currentRule <= rulesList.length ) {
          currentRule = currentRule - 1
          console.log(rulesList[currentRule][0]);
      } else {
        console.log('you should not see this');
      }
      p.loop();
    });

    //emotion
    emoSlider.addEventListener("input", function(){
      p.loop();
    });
    //efficiency
    effSlider.addEventListener("input", function(){
      p.loop();
    });
    //immortality
    alcSlider.addEventListener("input", function(){
      p.loop();
    });

    //save the Logo
    saveButton.addEventListener("click", function(){
      p.saveCanvas();
    });

    //get the inserted text string
    var nameInitial = '';
    nameInput.addEventListener("input", function(){
      var value = nameInput.value.toString();
       if (value.match(/[a-z]/i)) {
        // alphabet letters found && is made of two letters
          nameInitial = value;
          console.log('ok to pass to p5');
          p.loop();
        }
    });


    //create polygon fuction
    function polygon(x, y, radius, slidevalue) {
      console.log('slidevalue' + slidevalue);
      if (slidevalue == 1 || slidevalue == 2 ){
        var npoints = 4;
      } else if (slidevalue == 3 || slidevalue == 4 ){
        var npoints = 4+2;
      } else if (slidevalue == 5 || slidevalue == 6 ){
        var npoints = 4+4;
      } else if (slidevalue == 7 || slidevalue == 8 ){
        var npoints = 4+8;
      } else {
        var npoints = 4+30;
      }

      console.log('npoint' + npoints);
      var angle = p.TWO_PI / npoints;
      p.beginShape();
      for (var a = 0; a < p.TWO_PI; a += angle) {
        var sx = x + p.cos(a) * radius;
        var sy = y + p.sin(a) * radius;
        p.vertex(sx, sy);
      }
      p.endShape(p.CLOSE);
    }

    //create initial big square
    function letteringSquare(x,y,dimension,initial){
      var initial = initial.toUpperCase();
      p.push();
      p.fill(255);
      p.rect(x,y,dimension,dimension);
      p.fill(0)
      p.rect(x+w,y+w,dimension-w*2,dimension-w*2);
      p.fill(255);
      p.rect(x+w*2,y+w*2,dimension-w*4,dimension-w*4);
      p.fill(0);
      p.rect(x+w*3,y+w*3,dimension-w*6,dimension-w*6);
      p.fill(255)
      if (initial !== 'LOGO') {
        p.textSize(w*2);
        p.textFont('Space Mono');
        p.textAlign(p.CENTER, p.CENTER);
        p.text(' '+initial, x, y+w/6, dimension, dimension);
        p.pop()
      } else {
        p.textSize(w);
        p.textFont('Space Mono');
        p.textAlign(p.LEFT, p.TOP);
        p.text('U/',x+w*3+w/6,y+w*3+w/6,dimension-w*6,dimension-w*6);
        p.text('A',x+w*3+w/6,y+w*3+w,dimension-w*6,dimension-w*6);
      }
    }

    //what to display in the draw function
    function display(matrix) {
      console.log('display');
      console.log(matrix);
      //draw the matrix
      // i like it with inverted colors
      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[0].length; j++){
          //if 1 = white square (inverted)
          if (matrix[i][j] === 1) {
            //add ones efficiency
            if (getRandomInt(32)+1 <= effSlider.value) {
              p.fill(255)
              p.noStroke();
              p.rect(j*w, i*w, w, w);
              p.fill(0);
              p.textSize(w*0.5);
              p.textFont('Space Mono');
              p.textAlign(p.CENTER, p.CENTER);
              p.text(' 1', j*w, i*w, w, w);
              //add polygon immortality
            } else if (getRandomInt(16) < alcSlider.value) {
              p.fill(0)
              p.noStroke();
              p.rect(j*w, i*w, w, w);
              p.push()
              p.noStroke();
              p.fill(255);
              polygon((j*w)+(w/2), (i*w)+(w/2), w*0.5, alcSlider.value);
              p.pop();
              //add normal white squares
            } else {
              p.fill(255)
              p.noStroke();
              p.rect(j*w, i*w, w, w);
            }
            //if 0 = black square (inverted)
          } else {
            //add greyscale or color emotion
              if (getRandomInt(16)+1 <= emoSlider.value && i > 1 && i < matrix.length - 2){

                //add image from NASA APOD
                p.fill(125)
                p.noStroke();
                p.rect(j*w, i*w, w, w);
                p.image(nasa,j*w+w/2, i*w+w/2, w, w);
                //add art
              } else if (getRandomInt(48)+1 <= creSlider.value) {
                p.fill(0)
                p.noStroke();
                p.image(creArt[getRandomInt(18)+1],j*w+w/2, i*w+w/2, w, w);

                //add zeros efficiency
              } else if (getRandomInt(32)+1 <= effSlider.value) {
                p.fill(255)
                p.noStroke();
                p.rect(j*w, i*w, w, w);
                p.fill(0);
                p.textSize(w*0.5);
                p.textFont('Space Mono');
                p.textAlign(p.CENTER, p.CENTER);
                p.text(' 0', j*w, i*w, w, w);
                //add normal black square
              } else  {
                p.fill(0)
                p.noStroke();
                p.rect(j*w, i*w, w, w);
              }
          }
        }
      }
      //add the initials
      console.log(nameInitial);
      if (nameInitial.length === 2) {
        //letteringSquare parameters x,y,dimension,initial
        var first = nameInitial.slice(0,1);
        var second = nameInitial.slice(1,2);
        letteringSquare(0,0,w*8,first);
        letteringSquare((w*cells.length)-(w*8),0,w*8,second);
        letteringSquare(0,(w*cells.length)-(w*8),w*8,'logo');
      }
      p.noLoop()
    };

  p.setup = function() {
    p.createCanvas(canvasWidth, canvasWidth);
    p.stroke(255);
    p.noFill();
    p.imageMode(p.CENTER);
    //p.noLoop(); //draw doesn't loop
  };

  p.draw = function() {
    p.clear();
    //pass deubg() to test
    //else
    //pass wolfRamize(cells, matrix)
    display(wolfRamize(cells, matrix));
    //brand typography
    //top & bottom text with blend mode difference
    /*
    p.push()
    p.fill(255)
    p.blendMode(p.DIFFERENCE);
    p.textSize(w*4.3);
    p.textFont('Work Sans');
    p.textAlign(p.LEFT, p.CENTER);
    p.text('UMANESIMO', 0, 0, w*(cells.length+1), w*6);
    p.text('ARTIFICIALE', 0, w*(cells.length-6), w*(cells.length+1), w*6);
    p.pop()
    */



  };
};
var myp5 = new p5(s, 'sketch-holder');

});

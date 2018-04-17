var jimp;

require(['foo'], function (foo) {
    jimp = foo;
});

// imGenerator takes the userInput string
// and generate an image based on the input
function imGenerator (userInput){
	console.log("start");
	
	
	// uncomment to get html content
	//var textField = document.getElementById(e);
	//var userInput = textField.value;
	var jimps = [];

	// all chars and their image path
	var charToPath = {
		'א' : "../Images/alef/alef_",
		'ב' : "../Images/bet/bet_",
		'ג' : "../Images/gimel/gimel_",
		'ד' : "../Images/dalet/dalet_",
		'ה' : "../Images/hey/hey_",
		'ו' : "../Images/vav/vav_",
		'ז' : "../Images/zain/zain_",
		'ח' : "../Images/het/het_",
		'ט' : "../Images/tet/tet_",
		'י' : "../Images/yud/yud_",
		'כ' : "../Images/chaf/chaf_",
		'ך' : "../Images/chaf_sofit/chaf_sofit_",
		'ל' : "../Images/lamed/lamed_",
		'מ' : "../Images/mem/mem_",
		'ם' : "../Images/mem_sofit/mem_sofit_",
		'נ' : "../Images/nun/nun_",
		'ן' : "../Images/nun_sofit/nun_sofit_00000",
		'ס' : "../Images/samech/samech_",
		'ע' : "../Images/ayin/ayin_",
		'פ' : "../Images/pei/pei_",
		'צ' : "../Images/tsadik/tsadik_",
		'ץ' : "../Images/tsadik_sofit/tsadik_sofit_",
		'ק' : "../Images/kof/kof_",
		'ר' : "../Images/resh/resh_",
		'ש' : "../Images/shin/shin_",
		'ת' : "../Images/taf/taf_",
		'space' : "../Images/space/space.png",
	};


	// letters size
	const srcImWidth = 275;
	const srcImHeight = 275;  // delete this one if symetric

	// Background size
	const bgWidth = 1920;

	//imPath contains the full path to be added
	// just an example, need to parse the string 
	// into a relevant map
	// background in index 0, all images will be on top of it
	var allImages = ["../Images/floor_bg.png"];
	var lineStart = bgWidth - srcImWidth;

	var currX = lineStart;
	var currY = 0;
	var imSrc = '';

	// this need to be similar to the number
	// of letters fit inside textArea in html
	var lettersInLine = Math.floor(bgWidth/srcImWidth);
	console.log("lettersInLine = " , lettersInLine);		

	var currWord = [];		// used to collect a complete word and calculate its position
	var currWordLen = 0;

	// for loop to initilize allImages variable
	// looking for \n \0 or ' ' to make a word
	// calculate the 
	for (var i = 0; i < userInput.length ; i++){
		//console.log("enter for..");
		//console.log("currX: ", currX, ", currY: ", currY, ", src: ", srcPaths[i]);

		// cases for \n \0 and ' '
		// this will be expanded
		
		//example for path: "Images/g-letter.jpg"
		

		// in this case currWord contain a complete
		// word and needed to insert to allImages
		if (userInput.charAt(i) === '\n' || userInput.charAt(i) === ' ' || userInput.charAt(i) === '\0'){
			
			// check if the word fits to the current row
			if (bgWidth - currWordLen  >= 0){
				if(userInput.charAt(i) === ' '){
					imSrc = charToPath['space'];
					allImages.push(setLetterInfo(imSrc, currX, currY));
					currX = currX - srcImWidth;
					currWordLen = 0;
					if (currX < 0){
						currX = lineStart;
						currY = currY + srcImHeight;
					}
				}
				else
					allImages = pushWord(allImages, currWord);
			}
				
			// need to break this scenario to \n, \0 and space
			// maybe adding functionality to rescale images??	
			else{
				// TODO: deal with long words, throw error etc..
				if (currWordLen > lettersInLine){
					console.log("word too long!!");
				}
				// word fits to new line
				else{
					// enter key case
					if (userInput.charAt(i) === '\n'){
						//console.log("Enter_key found")
						allImages = fillLine(allImages, charToPath[' '] , currX, currY);  //  TODO: implement
						currX = lineStart;
						currY = currY + srcImHeight;
					}
					// space key entered
					else if(userInput.charAt(i) === ' '){
						imSrc = charToPath['space'];
						allImages.push(setLetterInfo(imSrc, currX, currY));
						currX = currX - srcImWidth;
						if (currX < 0){
							currX = lineStart;
							currY = currY + srcImHeight;
						}
					}

					// end of userInput
					else if(userInput.charAt(i) === '\0'){
						allImages = pushWord(allImages, currWord);
						currWord = [];
						currWordLen = 0;
						// TODO: finish
					}
				}//End of word fits
			}
		} //End if complete word

		// build a word
		else{
			// checking for valid word length
			if(currWordLen < lettersInLine){
	
				imSrc = charToPath[userInput.charAt(i)]; // takes the character path
				imSrc = imSrc + '000.png';
				currWord.push({src: imSrc, x: currX, y: currY});
	
				currWordLen++;
				currX = currX - srcImWidth;
			}
			else{
				console.log("Trying to insert too long word!");
			}
		} // end of word build
	} // end of for loop
	console.log(allImages);
	
	allImages = pushWord(allImages, currWord); // push the last word

	// read the background
	jimps.push(jimp.read(allImages[0]));
	// jimp read the images to promises

	for (var i = 1; i < allImages.length; i++){
		jimps.push(jimp.read(allImages[i].src));
	}


	Promise.all(jimps).then(function(data){
		return Promise.all(jimps);
	}).then(function(data){     //top left cords is 0,0
		for(var i = 1; i < allImages.length; i++){
			data[0].composite(data[i], allImages[i].x , allImages[i].y);	
		}
		

		data[0].write('../final-images/test.png', function(){
			console.log("wrote the image");
		});
	});

/*
	var canvas = document.getElementById('out-im'),
	context = canvas.getContext('2d');
	window.addEventListener('DOMContentLoaded', initImageLoader);
*/
}

/*
function initImageLoader(){
	var location = window.location.href.replace(/\/+$/, "");
	loadFile(location+'/js/final-images/test');
}


function loadFile(file){
	var tempIm = new Image();

	tempImageStore.onload = function(ev){
		canvas.height = ev.target.height;
		canvas.width = ev.target.width;

		context.drawImage(ev.target, 0, 0);
	}

	tempIm.src = file;
	return true;
}
*/

function setLetterInfo(pathName, xVal, yVal){
	var temp = {src: pathName, x: xVal, y: yVal};
	return temp;
}


// fills a line according to the remaining space left in it
function fillLine(allImages, pathName ,currX, currY){
	var temp = {src: pathName, x: currX, y: currY};
	
	for (var x = currX ; x >= 0 ; x = x - srcImWidth){
		temp.x = x;
		allImages.push(temp);
	}
	return allImages;
}

// allImages and currWord is array of maps
function pushWord (allImages, currWord){
	for(var i = 0; i < currWord.length ; i++){
		allImages.push(currWord[i]);
	}
	return allImages;
}

// update the new parametes of the elements
// in currWord
function nextLineUpdate (currWord, currY){
	for(var i = 0; i < currWord.length ; i++){
		currWord[i].x = bgWidth - (srcImWidth * i) - srcImWidth;
		currWord[i].y = currY;
	}
	return currWord;
}


// check the text area for correct input
// i.e. ת-א  or 0-9 or ?!., '\n'
// otherwise cleans the last one
function cleanTA(e){
  var textfield = document.getElementById(e);
  var regex = /[^א-ת \n]/gi;

  if (textfield.value.search(regex) > -1){
    document.getElementById('status').innerHTML = "ניתן לכתוב תוים מהצורה [א-ת 'רווח' 'אנטר']";
    textfield.value = textfield.value.replace(regex, "");
  }
}


userIn = "בדיקה";
imGenerator(userIn);
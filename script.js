//document.addEventListener("DOMContentLoaded", () => {
  var phase2;
  init();
  createSquares();
  const defaultSquareColor = getComputedStyle(document.querySelector(".square"))['border-color'];;
  //capture initial state on load
  const initialPageState = document.body.innerHTML;
  
  function convertToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
  }
  
  
  
  //adding key listeners for keyboard input; this only needs to be done once
  document.addEventListener("keydown", (e) => {
    if(phase2.hidden) return;
    let char = e.key.toLowerCase();
    if(char === "backspace"){
      getKey("del").click();
    }else if(char === "enter"){
      getKey("enter").click();
    }else if(/^[a-z]+$/i.test(char)){
      let key = getKey(char);
      if(key) key.click();
    }
  });
  
  function convertFromHex(hex) {
    var hex = hex.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }
  //checking for a custom shared link
  let queryDict = {};
  location.search.substr(1).split("&").forEach(function(item)    {queryDict[item.split("=")[0]] = item.split("=")[1]});
  sentword = queryDict['qbert']; //undefined or value
  if(sentword || undefined){
    sentword = convertFromHex(sentword);
    startPhase2(sentword, "Invalid link!");
  }
  const link = "http://wordlefortwo.com"
  
  
  
  function showWarning(text){
    text = text || "Must be a real five-letter word!";
    let warn = document.getElementById("warn");
    warn.textContent = text;
    warn.hidden = false;
  }
  
  var locked;
  
  function boardIsLocked(){
    return phase2.hidden || locked;
  }
  
  function getKey(key){
    return document.querySelector("[data-key='" + key + "']");
  }
  
  //returns an array of elements representing the five squares on the current row
  function getCurrentRow(){
    let elements = [];
    let initialPosition = (guessedWords.length - 1) * 5;
    for(let i = 1; i<=5; i++){
      elements.push(document.querySelector("[id='" + (initialPosition + i) + "']"));
    }
    return elements;
  }
  
  function colorCurrentRow(color){
    let currentRowSquares = getCurrentRow();
    for(let i = 0; i<currentRowSquares.length; i++){
      currentRowSquares[i].style.borderColor = color;
    }
  }
  
  function startPhase2(wordEntered, warn){
    warn = warn || "Must be a real five-letter word!";
    if (getWordList().includes(wordEntered) === false)
      {showWarning(warn);
      return;}
    if (wordEntered.length == 5) {
      if (/^[a-z]+$/i.test(wordEntered)) {    document.getElementById("phase1").hidden = true;
        phase2.hidden = false;
        word = wordEntered;
      } else {
        showWarning(warn);
      }
  
    }else if(wordEntered === "oppa gabriel style"){
      document.body.style.backgroundColor = "#797979";
      document.getElementById("p1header").style.color = "tomato";
      document.getElementById("header").style.color = "black";
      document.getElementById("warn").style.color = "tomato";
      let tiles = document.querySelectorAll(".square div");
      for(let i = 0; i<tiles.length; i++){
        tiles[i].borderColor = "cadetblue";
      }
    } else {
      showWarning(warn);
    }
  }
  
  
  function validateWord(wordEntered){ //only used for ingame validation
    if(wordEntered.length !== 5){
      return "Word must be 5 letters long!";
    }else if(getWordList().includes(wordEntered.toLowerCase())){
      return true;
    }else{
      return "Word not in list!"
    }
  }
  
  function getCurrentWordArr(){
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1]
  }
  
  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr()
    if(currentWordArr && currentWordArr.length < 5){
      currentWordArr.push(letter)
      const availableSpaceEl = document.getElementById(String(availableSpace));
      availableSpace = availableSpace+1;
      availableSpaceEl.textContent = letter;
      if(currentWordArr.length === 5){
        if(!getWordList().includes(currentWordArr.join(''))){
          colorCurrentRow("#fc3a14");
        }
      }
    }
  }
  
  const defaultKeyColor = getKey("a").style.backgroundColor;
  var keys;
  var gameBoard;
  var keyboard;
  var word;
  var guessedWords;
  var availableSpace;
  var guessedWordCount;
  
  function init(){
    gameBoard = document.getElementById("board");
    keyboard = document.getElementById("keyboard-container");
    keys = keyboard.querySelectorAll(".keyboard-row button");
    //adding click listeners for key buttons
    for (let i = 0; i < keys.length; i++) {
      keys[i].addEventListener("click", ({ target }) => {
        if(!boardIsLocked()){
          const letter = target.getAttribute("data-key");
          if(letter === 'enter')
            handleSubmitWord();
          if(letter !== 'enter' && letter !== 'del')
            updateGuessedWords(letter);
          if(letter === 'del')
            backspace();
        }
      });
    }
    
    word = undefined;
    guessedWords = [[]];
    availableSpace = 1;
    guessedWordCount = 0;
    phase2 = document.getElementById("phase2");
    locked = false;
    //adding share button functionality
    document.getElementById("sendlink").addEventListener("click", () => {
    let element = document.getElementById("word");
    let wordEntered = element.value.toLowerCase();
    if (!getWordList().includes(wordEntered))
      {showWarning();
      return;}
    if (wordEntered.length == 5) {
      if (/^[a-z]+$/i.test(wordEntered)) {
        qbert = convertToHex(wordEntered);
        newlink = link + "/?qbert="+qbert;
        if (navigator.share) {
          showWarning(" ");
          navigator.share({
            title :'Choose how to share your Wordle!',
            url: newlink
          })
        } else {
        navigator.clipboard.writeText(newlink); 
        showWarning("Copied link to clipboard!");
        console.log(newlink);}
      } else {
        showWarning();
      }
    }
       
  });
  
    //"make my input look secret"
    document.getElementById("hideinput").onclick = ({target}) => {
      let other = document.getElementById("word");
      if(target.checked) other.type = "password";
      else other.type = "text";
    }
    //play button listener
    document.getElementById("wordentry").addEventListener("click", () => {
      let element = document.getElementById("word");
      let wordEntered = element.value.toLowerCase();
      startPhase2(wordEntered);
    });
    
  
   if(document.getElementById("hideinput").checked){
      document.getElementById("word").type = "password";
   }
  }
  
  
  
  function createSquares() {
    for (let i = 0; i < 30; i++) {
      let square = document.createElement("div");
      square.setAttribute("id", i + 1);
      square.setAttribute("class", "square");
      gameBoard.appendChild(square);
    }
  }
  
  function createPurple(index){
    let square = document.createElement("div");
    square.setAttribute("class", "square");
    square.style.backgroundColor = "violet";
    square.textContent = word.charAt(index);
    gameBoard.appendChild(square);
  }
  
  const interval = 300;
  
  function handleSubmitWord(){
    const currentWordArr = getCurrentWordArr();
    let validation = validateWord(currentWordArr.join(''));
    if(!(validation === true)){
      alert(validation);
    }else{
      colorCurrentRow(defaultSquareColor);
      const currentWord = currentWordArr.join('');
      if(currentWord === word){
        //lock immediately instead of after 'congrats' message
        locked = true;
      }
      let index = guessedWords.length * 5 - 4;
      let len = guessedWords.length;
      function setColor(){
        let element = document.getElementById(index);
        let str = element.textContent;
        let color = "darkgrey";
        let trueIndex = (index - 1) % 5;
        if(word.charAt(trueIndex) === str){
          color = "green";
        }else{
          let charsInCurrentWord = countCharacters(currentWord.substring(0, trueIndex), str);
          let charsInWord = countCharacters(word, str);
          for(let i = trueIndex + 1; i<currentWord.length; i++){
            if(word.charAt(i) === currentWord.charAt(i) && currentWord.charAt(i) === str){
              charsInCurrentWord++;
            }
          }
          if(charsInCurrentWord < charsInWord && word.includes(str)){
            color = "yellow";
          }
        }
        element.style.color = color;
        let key = getKey(str);
        if(key){
          if(color === "darkgrey"&& key.style.backgroundColor === defaultKeyColor){
            color = "rgb(56, 55, 50)";
            key.style.backgroundColor = color;
          }else if(color === "yellow" && key.style.backgroundColor === defaultKeyColor){
            color = "#EEBC1D";
            key.style.backgroundColor = color;
          }else if(color === "green"){
            key.style.backgroundColor = color;
          }
        }
        if(index % 5 !== 0){
          index++;
          setTimeout(setColor, interval);
        }else if(currentWord === word){
          addPlayAgain();
          alert("Congrats, Player 2! You guessed the word. Click the button to play again.");
        }else if(len === 6){
          keyboard.hidden = true;
          doEndSequence(0);
          locked = true;
        }
      }
      setTimeout(setColor, interval);
      if(len < 6) guessedWords.push([]);
    }
  }
  
  function doEndSequence(index){
    setTimeout(() => {
      createPurple(index);
      if(index < 4){
        index++;
        doEndSequence(index);
      }else{ 
        setTimeout(() => {
          addPlayAgain();
          alert("Sorry player 2, you lose! To play again, click the button.");
        }, interval * 2);
      }
    }, interval);
  }
  
  function addPlayAgain(){
    let header = document.getElementById("header");
    let element = document.createElement("button");
    element.onclick = ({target}) => {
      document.body.innerHTML = initialPageState;
      init();
    }
    element.innerHTML = "Play Again";
    insertAfter(header, element);
    insertAfter(header, document.createElement("br"));
    insertAfter(header, document.createElement("br"));
  }
  
  function insertAfter(referenceNode, newNode) {
    let sibling = referenceNode.nextSibling;
    referenceNode.parentNode.insertBefore(newNode, sibling);
    return sibling;
  }
  
  
  function getCurrentWordArray() {
    return guessedWords[guessedWords.length - 1];
  }
  
  function countCharacters(string, char){
    return (string.match(new RegExp(char, "g")) || []).length;
  }
  
  
  function backspace(){
    let currentWordArr = getCurrentWordArr();
    if(currentWordArr.length > 0){
      if(currentWordArr.length == 5 ){ //was the last letter of the row backspaced?
        //if so, recolor to row to default
        colorCurrentRow(defaultSquareColor);
      }
      currentWordArr.pop();
      availableSpace--;
      document.getElementById(String(availableSpace)).textContent = "";
    }
  }
//});



 
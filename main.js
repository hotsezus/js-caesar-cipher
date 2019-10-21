var alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
var fullAlphabet = alphabet + alphabet + alphabet + alphabet + alphabet;

var APIKey='dict.1.1.20190909T110321Z.5d1b1aafdec34ad5.4019a8a57e6caee08a9cacfbb05a5da6ab999cb1';
var lang='ru-ru';

async function decode(){
  for(let offset=-1*(alphabet.length + 1); offset<alphabet.length; offset++){
    let cipherText = $('#cypher').val();
    let inputText = $('#cypher').val();
    let inputWords = inputText.split(' ');

    let encodedText = runCipher(inputText, offset);
    let encodedWords = encodedText.split(' ');
  
    if(cipherText.length > 0){
      encodedWords.forEach(async (word, index) => {
        fetch(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${APIKey}&lang=${lang}&text=${word}`)
          .then((response)=>{
            return response.json();
          })
          .then((parsedJson)=>{
            if(parsedJson.def && parsedJson.def.length > 0){
              alert(`Найден ключ для слова ${inputWords[index]} [${offset}]. Расшифровка - "${runCipher(inputWords[index],offset)}"`);
            }
          });
      });
    }
  }
}

function runCipher(text, offset){
  offset = (offset % alphabet.length);
  let cipherFinish = '';

  for(i=0; i<text.length; i++){
     let letter = text[i];
     let upper = (letter == letter.toUpperCase());
     letter = letter.toLowerCase();
    
     let index = alphabet.indexOf(letter);
     if(index == -1){
       cipherFinish += letter;
     } else {
       index = ((index + offset) + alphabet.length);
       let nextLetter = fullAlphabet[index];
       if(upper) nextLetter = nextLetter.toUpperCase();
       cipherFinish += nextLetter;
     }
  }
  return cipherFinish;
}

$(document).ready(function() {
  $('#cypher').keyup(function(){
    let result = runCipher($('#cypher').val(), $('#offset').val());
    $('#result').val(result);
  });
  $('#cypher').blur(function(){
    let result = runCipher($('#cypher').val(), $('#offset').val());
    $('#result').val(result);
  });
  $('#offset').change(function(){
    let result = runCipher($('#cypher').val(), $('#offset').val());
    $('#result').val(result);
  });
  $('#decode').click(function(){
    decode();
  });
  
});
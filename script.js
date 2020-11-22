const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    sounds: null
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    layout: false,
    cursorPos: 0,
    keyValue: null,
    volume: true,
    voice: false
  },

  

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });

    
  },

  _removeKeys() {  
   this.close();   
   this.init();   
   this.open();  
     
  },

  _createKeys() {
    let fragment = document.createDocumentFragment();
    let keyLayout;
    
    let keyLayoutEn = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
      "done", "en", "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".",
      "voice", "sound", "space", "arrowleft", "arrowright", "?"
    ];

    let keyLayoutRu = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
      "done", "ru", "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "/",
      "voice", "sound", "space", "arrowleft", "arrowright"
    ];

    let keyLayoutEnShift = [
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
      "done", "en", "shift", "z", "x", "c", "v", "b", "n", "m", "<", ">", 
      "voice", "sound", "space", "arrowleft", "arrowright", "?"
    ];

    let keyLayoutRuShift = [
      "!", "\"", "№", ";", "%", ":", "&", "*", "(", ")", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
      "done", "ru", "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
      "voice", "sound", "space", "arrowleft", "arrowright"
    ];

    if(this.properties.layout) {
      keyLayout = keyLayoutRu;
      this.elements.sounds = {
        shift: './assets/sounds/ru/shift.wav',
        caps: './assets/sounds/ru/caps.wav',
        backspace: './assets/sounds/ru/backspace.wav',
        enter: './assets/sounds/ru/enter.wav',
        space: './assets/sounds/ru/space.wav',
        sounds: './assets/sounds/ru/sounds.wav',
        lang: './assets/sounds/ru/lang.wav',
        default: './assets/sounds/ru/default.wav'
      }
    } else {
      keyLayout = keyLayoutEn;
      this.elements.sounds = {
        shift: './assets/sounds/en/shift.wav',
        caps: './assets/sounds/en/caps.wav',
        backspace: './assets/sounds/en/backspace.wav',
        enter: './assets/sounds/en/enter.wav',
        space: './assets/sounds/en/space.wav',
        sounds: './assets/sounds/en/sounds.wav',
        lang: './assets/sounds/en/lang.wav',
        default: './assets/sounds/en/default.wav'
      }
    };


    if(this.properties.shift && this.properties.layout) {
      keyLayout = keyLayoutRuShift;
    } else if(this.properties.shift && !this.properties.layout) {
      keyLayout = keyLayoutEnShift;
    }

    this.properties.keyValue = keyLayout;
    
    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

   
    for (let sound in this.elements.sounds) {
      const element = document.createElement('audio');
      element.classList.add(`${sound}`)
      element.src = this.elements.sounds[sound];
      document.body.prepend(element);
    }


    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "p", "enter", "?", "ъ", "/", ".", ">"].indexOf(key) !== -1;

  


      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");
      
      
      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            this._playSound(document.querySelector('.backspace'));
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");
          if(this.properties.capsLock) keyElement.classList.add("keyboard__key--active", this.properties.shift);
          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            this._playSound(document.querySelector('.caps'));
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);            
          });

          break;


          case "shift":
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "shifted");
            keyElement.innerHTML = key.toLowerCase();
            if(this.properties.shift) keyElement.classList.toggle("keyboard__key--active", this.properties.shift);            
            keyElement.addEventListener("click", () => {                         
              this._toggleShift();              
              this._playSound(document.querySelector('.shift'));  
            });
  
            break;


        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this._playSound(document.querySelector('.enter'));
            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this._playSound(document.querySelector('.space'));
            this.properties.value += " ";
            this._triggerEvent("oninput");
          });

          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");
          
          keyElement.addEventListener("click", () => {
            this._playSound(document.querySelector('.default'));  
            document.querySelector(".keyboard").classList.add('keyboard--hidden');
            
          });
          break;

          case "sound":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          if (this.properties.volume) keyElement.classList.add("keyboard__key--active");
          keyElement.innerHTML = `<img src="./assets/sound.png" width="20" height="20">`;
          keyElement.addEventListener('click', (e) => {            
            this._playSound(document.querySelector('.sounds'));
            keyElement.classList.toggle("keyboard__key--active");
            this._toggleSound();            
          });
          break;

          case "voice":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "voice");
          if (this.properties.voice) keyElement.classList.add("keyboard__key--active");
          keyElement.innerHTML = `<img src="./assets/voice.png" width="10" height="20">`;
          keyElement.addEventListener('click', (e) => {           
            this._playSound(document.querySelector('.default'));            
            this._toggleVoice();
          });
          break;


          case "ru":
          case "en":
            keyElement.classList.add("keyboard__key");
            keyElement.textContent = key.toLowerCase();
  
            keyElement.addEventListener("click", () => {          
              this._toggleLayout();
              if(this.properties.voice) {
                this._toggleVoice();
                keyElement.classList.add("keyboard__key--active");
              }
              this._playSound(document.querySelector('.lang'));              
            });


              break;

              case "arrowleft":
                keyElement.classList.add("keyboard__key");
                keyElement.innerHTML = "&larr;";
               
                keyElement.addEventListener('click', () => {
                  this._playSound(document.querySelector('.default'));     
                  document.querySelector('.use-keyboard-input').focus();              
                  if(this.properties.cursorPos > 0) this.properties.cursorPos--;
                  document.querySelector('.use-keyboard-input').setSelectionRange(this.properties.cursorPos, this.properties.cursorPos);
                });
              break;

              case "arrowright":
                keyElement.classList.add("keyboard__key");
                keyElement.innerHTML = "&rarr;";
               
                keyElement.addEventListener('click', () => {  
                  this._playSound(document.querySelector('.default'));  
                  document.querySelector('.use-keyboard-input').focus();              
                  if(this.properties.cursorPos < this.properties.value.length) this.properties.cursorPos++;
                  document.querySelector('.use-keyboard-input').setSelectionRange(this.properties.cursorPos, this.properties.cursorPos);
                });
              break;

        default:
          keyElement.textContent = key.toLowerCase();
        
          keyElement.addEventListener("click", () => {
            this._playSound(document.querySelector('.default'));  
            if(this.properties.capsLock == true && this.properties.shift == true) this.properties.value += key.toLowerCase();
            if(this.properties.capsLock == true && this.properties.shift == false) this.properties.value += key.toUpperCase();
            if(this.properties.capsLock == false && this.properties.shift == true) this.properties.value += key.toUpperCase();
            if(this.properties.capsLock == false && this.properties.shift == false) this.properties.value += key.toLowerCase();
            this.properties.cursorPos++;            
            this._triggerEvent("oninput");
            document.querySelector('.use-keyboard-input').setSelectionRange(this.properties.cursorPos, this.properties.cursorPos);
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
    document.querySelector('.use-keyboard-input').focus();
  },

  _playSound(wav) {
      wav.currentTime = 0;
      wav.play();   
  },

  _toggleLayout() {
    this.properties.layout = !this.properties.layout;
    this._removeKeys();
    let audio = document.body.getElementsByTagName('audio');
    for(elem of audio) {
        elem.remove();     
    }
    
    this._createKeys();
  },

  _toggleSound() {
    this.properties.volume = !this.properties.volume;    
      let audio = document.body.getElementsByTagName('audio');
      for(elem of audio) {
          elem.muted = (elem.muted == false) ? true : false;      
      }   
  },


  recognition: null,

  _toggleVoice() {
    document.querySelector('.voice').classList.toggle("keyboard__key--active"); 
    this.properties.voice = !this.properties.voice;
    if(this.properties.voice) {    
    recognition = new webkitSpeechRecognition() || new SpeechRecognition();    
    if(this.properties.layout) recognition.lang = 'ru-RU';
    else recognition.lang = 'en-US';

  
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.start();  

  recognition.addEventListener("result", function(e) {
    let text = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');    
    document.querySelector('.use-keyboard-input').value = text;
});

    } 
    
    if(!this.properties.voice) {
      recognition.stop();

    }
  },
  


  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if(this.properties.capsLock == true && this.properties.shift == true) key.textContent = key.textContent.toLowerCase();
        if(this.properties.capsLock == true && this.properties.shift == false) key.textContent = key.textContent.toUpperCase();
        if(this.properties.capsLock == false && this.properties.shift == true) key.textContent = key.textContent.toUpperCase();
        if(this.properties.capsLock == false && this.properties.shift == false) key.textContent = key.textContent.toLowerCase();
      }
    }
  },

  _toggleShift() {
    document.querySelector(".shifted").classList.toggle("keyboard__key--active", this.properties.shift);
    this.properties.shift = !this.properties.shift;
    this._removeKeys();
    this._createKeys();
    
    if (this.properties.capsLock) this.properties.shift == !this.properties.shift;    

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if(this.properties.capsLock == true && this.properties.shift == true) key.textContent = key.textContent.toLowerCase();
        if(this.properties.capsLock == true && this.properties.shift == false) key.textContent = key.textContent.toUpperCase();
        if(this.properties.capsLock == false && this.properties.shift == true) key.textContent = key.textContent.toUpperCase();
        if(this.properties.capsLock == false && this.properties.shift == false) key.textContent = key.textContent.toLowerCase();
      }
    }   
  },

  _realKeyboard(e) {

    let letter;

    if (e.key !== undefined) {
      letter = e.key;
    } else if (e.keyIdentifier !== undefined) {
      letter = String.fromCharCode(e.keyIdentifier);
    } else if (e.keyCode !== undefined) {
      letter = String.fromCharCode(e.keyCode);
    }

    let key = letter.toLowerCase();
    key = key === 'capslock' ? 'caps' : key;
    key = key === ' ' ? 'space' : key;
    key = key === ' ' ? 'shift' : key;
    key = key === ' ' ? 'arrowleft' : key;
    key = key === ' ' ? 'arrowright' : key;

    let keyIndex = this.properties.keyValue.indexOf(key);
     document.querySelector('.use-keyboard-input').focus();
    if (keyIndex !== -1) {
      if (e.type === 'keydown') {
        if(key === 'caps' || key === 'capslock') {
          this.elements.keys[keyIndex].classList.toggle('keyboard__key--active');
          this._toggleCapsLock();
        }
        if(key === 'shift') {
          this.elements.keys[keyIndex].classList.toggle('keyboard__key--active');
          this._toggleShift();
        }
        if(key === 'arrowleft') this.properties.cursorPos > 0 ? this.properties.cursorPos-- : this.properties.cursorPos;
        if(key === 'arrowright') this.properties.cursorPos < this.properties.value.length ? this.properties.cursorPos++ : this.properties.cursorPos;
        
        this.elements.keys[keyIndex].classList.add(
          'keyboard__key--active-press'
        );
      } else if (e.type === 'keyup') {
        this.elements.keys[keyIndex].classList.remove(
          'keyboard__key--active-press'
        );
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
     
  let audio = document.getElementsByTagName('audio');
  for(elem of audio) {
    elem.remove();
  }    
    document.querySelectorAll('.keyboard')[0].remove();
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
  Keyboard.open();
  document.querySelector('.use-keyboard-input').focus();
});

document.querySelector(".use-keyboard-input").addEventListener('click', () => {
  document.querySelector(".keyboard").classList.remove('keyboard--hidden');
  let caretStart;
  let caretEnd;
  Keyboard.properties.cursorPos = document.querySelector(".use-keyboard-input").selectionStart;
});

document.addEventListener('keydown', (e) => {
  Keyboard._realKeyboard(e);
});

document.addEventListener('keyup', (e) => {
  Keyboard._realKeyboard(e);
  Keyboard.properties.value = e.target.value;
  Keyboard.properties.position = e.target.selectionStart;
});



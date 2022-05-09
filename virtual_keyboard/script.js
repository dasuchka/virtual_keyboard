const russianLayout=["lang", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace", "tab",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "del",
        "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
        "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю",",", ".", "?", "arrow_up", "Shift",
        "Ctrl", "Win", "Alt", "space", "Alt", "Ctrl", "arrow_left", "arrow_down", "arrow_right"
      ];

const englishLayout=["lang", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace", "tab",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "del",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
        "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "arrow_up", "Shift",
        "Ctrl", "Win", "Alt", "space", "Alt", "Ctrl", "arrow_left", "arrow_down", "arrow_right"
      ];

const Keyboard={
    elements:{
        main:null,
        keysContainer:null,
        keys:[]
    },

    eventHandlers: {
        oninput:null,
        onclose: null
    },

    properties:{
        value: '',
        capslock: false,
        language: "EN",
    },

    init() {
        //Create main elements
        this.elements.main= document.createElement("div");
        this.elements.keysContainer= document.createElement("div");

        //Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard-hidden");
        this.elements.keysContainer.classList.add("keyboard_keys");
        this.elements.keysContainer.id="keyboard_keys";
        this.elements.keysContainer.appendChild(this._createKeys())

        this.elements.keys =this.elements.keysContainer.querySelectorAll(".keyboard_key");
        //Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        //Automatically use keyboard


        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", ( )=>{
                this.open(element.value, currentValue =>{
                    element.value = currentValue;
                });
            });
        });

    },

    _createKeys(){
        const fragment= document.createDocumentFragment();
        let keyLayout;
        if (this.properties.language==="EN"){
            keyLayout=englishLayout;
        }
        if (this.properties.language==="RU"){
            keyLayout=russianLayout;
            console.log(keyLayout);
        }

        console.log(this.properties.language==="RU");

        //Create HTML for an icon
        const createIconHTML= (icon_name) =>{
            return `<i class="material-icons">${icon_name}</i>`;
        }

        keyLayout.forEach(key =>{
            const keyElement =document.createElement("button");
            const insertLineBreak = ["backspace", "del", "enter", "Shift"].indexOf(key)!==-1;

            //Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard_key");

            switch (key) {
                case "lang":
                    if (this.properties.language==="EN"){
                        keyElement.innerText="EN";
                    }else{
                        keyElement.innerText="RU";
                    }
                    keyElement.addEventListener("click", () =>{
                        this._clickLanguage();   
                    })
                    break;

                case "backspace":
                    keyElement.classList.add("keyboard_key--wide");
                    keyElement.innerText="Backspace";

                    keyElement.addEventListener("click", () =>{
                        this.properties.value =this.properties.value.substring(0, this.properties.value.length-1);
                        this._triggerEvent('oninput');
                    });
                    break;
                case "caps":
                    keyElement.classList.add("keyboard_key--wide", "keyboard_key--activatable");
                    keyElement.innerHTML=createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () =>{
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard_key--active", this.properties.capslock);
                    });
                    break;

                case "enter":
                    keyElement.classList.add("keyboard_key--wide");
                    keyElement.innerHTML=createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () =>{
                        this.properties.value += "\n";
                        keyElement.classList.toggle("keyboard_key--active", this.properties.capslock);
                        this._triggerEvent('oninput');
                    });
                    break;

                case "space":
                    keyElement.classList.add("keyboard_key--extra-wide");
                    keyElement.innerHTML=createIconHTML("space_bar");

                    keyElement.addEventListener("click", () =>{
                        this.properties.value += " ";
                        this._triggerEvent('oninput');
                    });
                    break;

                case "done":
                    keyElement.classList.add("keyboard_key--wide", "keyboard_key--dark");
                    keyElement.innerHTML=createIconHTML("check_circle");

                    keyElement.addEventListener("click", () =>{
                        this.close();
                        this._triggerEvent('onclose');
                    });
                    break;

                case "arrow_right":
                    
                    keyElement.innerHTML=createIconHTML("keyboard_arrow_right");
                    keyElement.addEventListener('click', console.log(""));
                    const textarea=document.getElementById('text-area');
                    break;

                case "arrow_left":
                    keyElement.innerHTML=createIconHTML("keyboard_arrow_left");
                    break;
                
                case "arrow_up":
                    keyElement.innerHTML=createIconHTML("keyboard_arrow_up");
                    break;

                case "arrow_down":
                    keyElement.innerHTML=createIconHTML("keyboard_arrow_down");
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () =>{
                        this.properties.value +=this.properties.capslock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent('oninput');
                    });
                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak){
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _clickLanguage(){
        if (this.properties.language==="EN"){
            this.properties.language="RU";
        }else{
            this.properties.language="EN";
        }
        this.elements.keys=[];
        let parent_keys=document.getElementById("keyboard_keys");
        console.log(parent_keys);
        parent_keys.innerHTML='';
        this.elements.keysContainer.appendChild(this._createKeys())
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName]== "function"){
            this.eventHandlers[handlerName](this.properties.value)
        }
    },

    _toggleCapsLock(){
        this.properties.capslock = !this.properties.capslock;

        for (const key of this.elements.keys) {
            if (key.childElementCount===0) {
                key.textContent =this.properties.capslock ? key.textContent.toUpperCase(): key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose){
        this.properties.value =initialValue || '';
        this.eventHandlers.oninput=oninput;
        this.eventHandlers.onclose=onclose;
        this.elements.main.classList.remove("keyboard-hidden");
    },

    close(){
        this.properties.value ="";
        this.eventHandlers.oninput =oninput;
        this.eventHandlers.onclose=onclose;
        this.elements.main.classList.add("keyboard-hidden");
    }
};

window.addEventListener("DOMContentLoaded", function (){
    Keyboard.init();
});
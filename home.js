// Wait for the entire HTML document to be loaded and ready.
document.addEventListener('DOMContentLoaded', () => {

    // --- SECTION 0: ALPHABET LOGIC ---
    const alphabetGridContainer = document.getElementById('alphabet-grid');
    const customTextInput = document.getElementById('custom-text');

    const alphabetData = [
        { letter: 'A', bangla: 'আ', pronunciation: 'Ah' }, { letter: 'B', bangla: 'বে', pronunciation: 'Bay' },
        { letter: 'C', bangla: 'সে', pronunciation: 'Tsey' }, { letter: 'D', bangla: 'ডে', pronunciation: 'Day' },
        { letter: 'E', bangla: 'এ', pronunciation: 'Ee' }, { letter: 'F', bangla: 'এফ', pronunciation: 'Eff' },
        { letter: 'G', bangla: 'গে', pronunciation: 'Gay' }, { letter: 'H', bangla: 'হা', pronunciation: 'Ha' },
        { letter: 'I', bangla: 'ই', pronunciation: 'I' }, { letter: 'J', bangla: 'ইয়ট', pronunciation: 'Jott' },
        { letter: 'K', bangla: 'কা', pronunciation: 'Ka' }, { letter: 'L', bangla: 'এল', pronunciation: 'El' },
        { letter: 'M', bangla: 'এম', pronunciation: 'm' }, { letter: 'N', bangla: 'এন', pronunciation: 'n' },
        { letter: 'O', bangla: 'ও', pronunciation: 'O' }, { letter: 'P', bangla: 'পে', pronunciation: 'Pey' },
        { letter: 'Q', bangla: 'কু', pronunciation: 'Qu' }, { letter: 'R', bangla: 'এ-আর', pronunciation: 'Ere' },
        { letter: 'S', bangla: 'এস', pronunciation: 'Es' }, { letter: 'T', bangla: 'টে', pronunciation: 'Tay' },
        { letter: 'U', bangla: 'উ', pronunciation: 'U' }, { letter: 'V', bangla: 'ফাও', pronunciation: 'Fau' },
        { letter: 'W', bangla: 'ভে', pronunciation: 'vay' }, { letter: 'X', bangla: 'ইক্স', pronunciation: 'Ix' },
        { letter: 'Y', bangla: 'উস্পিলন', pronunciation: 'Ypsilon' }, { letter: 'Z', bangla: 'চেট', pronunciation: 'Zet' },
        { letter: 'Ä', bangla: 'অ্যা', pronunciation: 'Ä' }, { letter: 'Ö', bangla: 'ও', pronunciation: 'Öh' },
        { letter: 'Ü', bangla: 'উ', pronunciation: 'Ü' }, { letter: 'ß', bangla: 'এস্সেট', pronunciation: 'Eszett' }
    ];
    
    // Function to render the alphabet grid on the page
    function renderAlphabetGrid() {
        alphabetData.forEach(item => {
            const keyBox = document.createElement('div');
            keyBox.className = 'alphabet-key-box';
            
            keyBox.innerHTML = `
                <button class="alpha-listen-btn" data-pronunciation="${item.pronunciation}">🔊</button>
                <span class="alpha-letter-main">${item.letter}</span>
                <span class="alpha-bangla-pron">${item.bangla}</span>
            `;
            alphabetGridContainer.appendChild(keyBox);
        });
    }

    // THIS IS THE KEY FIX: Using Event Delegation for all dynamically created buttons.
    document.querySelector('.container').addEventListener('click', (event) => {
        // Check if a listen button in the ALPHABET was clicked
        if (event.target.classList.contains('alpha-listen-btn')) {
            const textToSpeak = event.target.dataset.pronunciation;
            speak(textToSpeak);
        }
        // Check if a listen button in the VOCABULARY LIST was clicked
        if (event.target.classList.contains('listen-btn') && event.target.closest('.vocab-list')) {
            const wordToSpeak = event.target.previousElementSibling.textContent;
            speak(wordToSpeak);
        }
    });

    // --- SECTION 1: GENERAL TEXT-TO-SPEECH FUNCTION ---
    function speak(text) {
        if (!window.speechSynthesis) {
            alert("Sorry, your browser does not support text-to-speech.");
            return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.pitch = 1;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
    
    // --- SECTION 2: TRANSLATION LOGIC ---
    const pronounceButton = document.getElementById('pronounce-btn');
    const translationBox = document.getElementById('translation-result-box');
    const banglaTranslationElement = document.getElementById('bangla-translation');

    pronounceButton.addEventListener('click', () => {
        const textToTranslate = customTextInput.value;
        if (textToTranslate.trim() === '') {
            alert("Please type a word first.");
            return;
        }
        speak(textToTranslate);
        translateToBangla(textToTranslate);
    });

    async function translateToBangla(germanText) {
        translationBox.classList.remove('hidden');
        banglaTranslationElement.textContent = 'Translating...';
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(germanText)}&langpair=de|bn`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            banglaTranslationElement.textContent = data.responseData.translatedText || 'Translation not found.';
        } catch (error) {
            banglaTranslationElement.textContent = 'Translation failed.';
        }
    }

    // --- SECTION 3: CUSTOM KEYBOARD LOGIC ---
    const keyboardContainer = document.getElementById('custom-keyboard');
    const keySound = new Audio('https://assets.codepen.io/296057/click.mp3');
    let isCaps = false;
    const keyLayout = [
        ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'],
        ['caps', 'y', 'x', 'c', 'v', 'b', 'n', 'm', 'ß', 'backspace'],
        ['space']
    ];
    function renderKeyboard() {
        keyboardContainer.innerHTML = '';
        keyLayout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            row.forEach(key => {
                const keyBtn = document.createElement('button');
                keyBtn.className = 'keyboard-key';
                keyBtn.setAttribute('type', 'button');
                switch (key) {
                    case 'backspace':
                        keyBtn.innerHTML = '⌫'; keyBtn.classList.add('key-wide');
                        keyBtn.onclick = () => { customTextInput.value = customTextInput.value.slice(0, -1); playSound(); };
                        break;
                    case 'caps':
                        keyBtn.innerHTML = 'Caps'; keyBtn.classList.add('key-capslock');
                        if (isCaps) keyBtn.classList.add('active');
                        keyBtn.onclick = () => { isCaps = !isCaps; renderKeyboard(); playSound(); };
                        break;
                    case 'space':
                        keyBtn.innerHTML = 'Space'; keyBtn.classList.add('key-wide'); keyBtn.style.gridColumn = 'span 5';
                        keyBtn.onclick = () => { customTextInput.value += ' '; playSound(); };
                        break;
                    default:
                        keyBtn.textContent = isCaps ? key.toUpperCase() : key.toLowerCase();
                        keyBtn.onclick = () => { customTextInput.value += keyBtn.textContent; playSound(); };
                        break;
                }
                rowDiv.appendChild(keyBtn);
            });
            keyboardContainer.appendChild(rowDiv);
        });
    }
    function playSound() {
        keySound.currentTime = 0;
        keySound.play();
    }
    
    // --- THIS IS THE NEW PART FOR THE AUTO-GROWING TEXT BOX ---
    function autoResize() {
        customTextInput.style.height = 'auto'; // 1. Reset the height
        customTextInput.style.height = customTextInput.scrollHeight + 'px'; // 2. Set it to the content's height
    }
    // We add the 'input' event listener to watch for typing
    customTextInput.addEventListener('input', autoResize);

    // --- INITIALIZE THE PAGE ---
    renderAlphabetGrid();
    renderKeyboard();
});

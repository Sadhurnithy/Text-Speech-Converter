let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");
let isPaused = false;
let currentWordIndex = 0;
let textArray = [];

// Function to fetch and update voices
function updateVoices() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = "";

    voices.forEach((voice, i) => {
        voiceSelect.options[i] = new Option(voice.name, i);
    });

    speech.voice = voices[0];
}

// Getting Various Voices and Selection of Voices
window.speechSynthesis.onvoiceschanged = updateVoices;

// Changing event so that it works on selecting Voices
voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

// Creating the function to work as a Text-Voice Converter
document.querySelector("#convertButton").addEventListener("click", () => {
    // Clear any ongoing speech
    window.speechSynthesis.cancel();

    textArray = document.querySelector("textarea").value.split(/\s+/);
    currentWordIndex = 0;

    highlightCurrentWord();

    speech.text = document.querySelector("textarea").value;
    window.speechSynthesis.speak(speech);
});

// Creating the function to pause/resume the narration
document.getElementById("stopButton").addEventListener("click", () => {
    if (window.speechSynthesis.speaking) {
        if (isPaused) {
            // If already paused, resume
            window.speechSynthesis.resume();
            isPaused = false;
            document.getElementById("stopButton").innerHTML = '<img src="./Assets/stop.png" alt="">Pause';
        } else {
            // If not paused, pause
            window.speechSynthesis.pause();
            isPaused = true;
            document.getElementById("stopButton").innerHTML = '<img src="./Assets/play01.png" alt="">Resume';
        }
    }
});

// Update highlighting while speaking
speech.addEventListener('boundary', (event) => {
    currentWordIndex = event.charIndex;

    // Reset previous highlights
    document.querySelectorAll('.highlight').forEach((el) => {
        el.classList.remove('highlight');
    });

    // Highlight the current word
    highlightCurrentWord();
});

function highlightCurrentWord() {
    const textarea = document.querySelector("textarea");
    const textArray = textarea.value.split(/\s+/);
    const highlightedText = textArray
        .map((word, index) => (index === currentWordIndex ? `<span class="highlight">${word}</span>` : word))
        .join(' ');

    // Update the textarea with the highlighted words
    textarea.innerHTML = highlightedText;
}

// Call updateVoices initially to populate the voices
updateVoices();
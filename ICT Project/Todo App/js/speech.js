        // Check for browser support
document.addEventListener('DOMContentLoaded',()=>{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        const voiceInputButton = document.getElementById('voice-input-button');
        const todoInput = document.getElementById('todo-input');

        // Start speech recognition
        voiceInputButton.addEventListener('click', () => {
            recognition.start();
        });

        // Process speech input
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            todoInput.value = transcript; // Add the spoken text to the textarea
        };

        // Handle errors
        recognition.onerror = (event) => {
            console.error('Speech recognition error detected: ' + event.error);
        };
});
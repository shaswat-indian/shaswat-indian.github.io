$(document).ready(function() {
    const chatBox = $('#chat-box');
    const chatInput = $('#chat-input');
    const sendButton = $('#chat-send');

    // Replace with your actual backend API endpoints
    const API_BASE_URL = "https://shaswat-resume-ai-backend.onrender.com"; // for Render hosting
    // const API_BASE_URL = "http://localhost:3000";
    const CHATBOT_API_URL = `${API_BASE_URL}/chat`;
    const WAKEUP_API_URL = `${API_BASE_URL}/ping`;

    function addMessage(message, sender) {
        $('.typing-indicator').remove();
        const messageElement = $('<div></div>').addClass('chat-message').addClass(sender + '-message').text(message);
        chatBox.append(messageElement);
        chatBox.scrollTop(chatBox[0].scrollHeight);
    }

    function showTypingIndicator() {
        const typingElement = $('<div></div>').addClass('chat-message bot-message typing-indicator').html('<span>.</span><span>.</span><span>.</span>');
        chatBox.append(typingElement);
        chatBox.scrollTop(chatBox[0].scrollHeight);
    }

    async function getBotResponse(userInput) {
        try {
            const response = await fetch(CHATBOT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userInput })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // Assuming the API returns a JSON object with a 'reply' field
            return data.reply || "Sorry, I couldn't get a response.";
        } catch (error) {
            console.error('Error fetching bot response:', error);
            return "Sorry, I'm having trouble connecting. Please try again later.";
        }
    }

    async function handleUserInput() {
        const userInput = chatInput.val().trim();
        if (userInput) {
            addMessage(userInput, 'user');
            chatInput.val('');
            showTypingIndicator();
            const botResponse = await getBotResponse(userInput);
            addMessage(botResponse, 'bot');
        }
    }

    sendButton.on('click', handleUserInput);

    chatInput.on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            handleUserInput();
        }
    });

    async function wakeupBot() {
        addMessage("Hi! I'm Shas-bot. Waking up Shaswat, please wait a moment...", 'bot');
        try {
            await fetch(WAKEUP_API_URL);
            // Replace the waking up message with the ready message.
            chatBox.find('.bot-message').last().text("Hi! I'm Shaswat! Ask me anything.");
        } catch (error) {
            console.error('Error waking up bot:', error);
            // Replace the waking up message with an error message.
            chatBox.find('.bot-message').last().text("I'm having trouble waking up. Please try sending a message in a bit.");
        }
    }

    // Wake up the bot on page load
    wakeupBot();

});
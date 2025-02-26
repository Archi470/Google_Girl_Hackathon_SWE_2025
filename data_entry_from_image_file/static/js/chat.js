let messageHistory = [];

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    appendMessage('user', message);
    messageInput.value = '';
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        
        const data = await response.json();
        appendMessage('bot', data.response);
        
    } catch (error) {
        console.error('Error:', error);
        appendMessage('bot', 'Sorry, I encountered an error. Please try again.');
    }
}

function appendMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerHTML = `
        <div class="message-content ${sender === 'user' ? 'bg-primary' : 'bg-secondary'}">
            ${message}
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

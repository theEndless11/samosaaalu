document.addEventListener('DOMContentLoaded', () => {
    let username = '';
    const ably = new Ably.Realtime({ key: 'A2d_-A.1BaGMw:stl13eplJUOlO1UI5slUxDy9S17jg6FaoM9CsWQJYUk' });
    const chatChannel = ably.channels.get('chat-channel');

    // Function to display a message
    function displayMessage({ username, message, mediaUrl, timestamp }) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';

        const time = new Date(timestamp).toLocaleTimeString();
        messageElement.innerHTML = `
            <div class="msg-bubble ${username === 'you' ? 'user-msg' : 'bot-msg'}">
                <strong>${username}</strong> <span>(${time})</span><br>
                ${message || ''}
                ${mediaUrl ? `<br><img src="${mediaUrl}" alt="Media" style="max-width: 100%;">` : ''}
            </div>
        `;

        document.getElementById('messages-container').appendChild(messageElement);
        document.getElementById('messages-container').scrollTop = document.getElementById('messages-container').scrollHeight;
    }

    // Fetch messages on load
    async function fetchMessages() {
        try {
            const response = await fetch('/api/messages'); // Updated to use the serverless API route
            const messages = await response.json();
            messages.forEach(displayMessage);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    // Listen for new messages from Ably
    chatChannel.subscribe('new-message', (message) => {
        displayMessage(message.data);
    });

    // Handle message sending
    document.getElementById('send-message-btn').addEventListener('click', async () => {
        const messageInput = document.getElementById('user-message');
        const fileInput = document.getElementById('file-input');
        const message = messageInput.value.trim();

        if (!username) {
            alert("Please enter a username before sending a message.");
            return;
        }

        if (message || (fileInput && fileInput.files.length > 0)) {
            let mediaUrl = '';

            // Handle file upload
            if (fileInput && fileInput.files.length > 0) {
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);

                try {
                    const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData }); // Updated to serverless API
                    const { mediaUrl: uploadedMediaUrl } = await uploadResponse.json();
                    mediaUrl = uploadedMediaUrl;
                } catch (error) {
                    console.error('Error uploading file:', error);
                    alert('Failed to upload file.');
                    return;
                }
            }

            // Send message
            try {
                await fetch('/api/send-message', { // Updated to serverless API
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, message, mediaUrl })
                });
            } catch (error) {
                console.error('Error sending message:', error);
                alert('Failed to send message.');
            }

            messageInput.value = '';
            if (fileInput) fileInput.value = ''; // Clear the file input
        } else {
            alert("Message cannot be empty.");
        }
    });

    // Set username
    document.getElementById('username-input').addEventListener('input', (event) => {
        username = event.target.value.trim() || 'you';
    });

    // Clear chat
    document.getElementById('clear-chat-btn').addEventListener('click', async () => {
        try {
            await fetch('/api/messages', { method: 'DELETE' }); // Updated to serverless API
            document.getElementById('messages-container').innerHTML = '';
        } catch (error) {
            console.error('Error clearing chat:', error);
            alert('Failed to clear chat.');
        }
    });

    // Initial messages fetch
    fetchMessages();
});

// api/send-message.js
const mongoose = require('mongoose');
const Message = require('../../models/Message'); // Assuming you put your model in a separate file
const Ably = require('ably');

const ably = new Ably.Realtime({ key: process.env.ABLY_KEY });
const channel = ably.channels.get('chat-channel');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { username, message, mediaUrl } = req.body;

        if (!username || (!message && !mediaUrl)) {
            return res.status(400).json({ error: 'Username and either message or media are required' });
        }

        const newMessage = new Message({ username, message, mediaUrl });

        try {
            await newMessage.save();

            // Publish message to Ably
            channel.publish('new-message', { username, message, mediaUrl, timestamp: newMessage.timestamp });

            res.status(200).send('Message sent');
        } catch (error) {
            console.error('Error saving message:', error);
            res.status(500).json({ error: 'Error saving message' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

// api/messages.js
const mongoose = require('mongoose');
const Message = require('../../models/Message');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const messages = await Message.find().sort({ timestamp: 1 });
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: 'Error fetching messages' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

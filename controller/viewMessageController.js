const express = require('express');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

const viewMessageController = async function(req, res, next) {
    try {
        const data = await readFileAsync('json/message.json', 'utf8');
        
        if (!data.trim()) {
            console.log('No data found in the file.');
            return res.render('viewMessage', { messages: [] });
        }

        const messages = JSON.parse(data);

        // Check if the parsed data is an array and has content
        if (!Array.isArray(messages) || messages.length === 0) {
            console.log('No messages to display.');
            return res.render('viewMessage', { messages: [] });
        }

        messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        res.render('viewMessage', { messages });
    } catch (err) {
        // Handle specific error if the file does not exist
        if (err.code === 'ENOENT') {
            console.error('File not found:', err);
            return res.render('viewMessage', { messages: [] });
        }
        console.error('Error reading messages:', err);
        return next(err);
    }
};

module.exports = viewMessageController;

const express = require('express');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

const chatpageController = async (req, res, next) => {
    const filePath = path.join(__dirname, '../public', 'json', 'message.json');

    try {
        // Always attempt to read the existing messages first
        let messages;
        try {
            const fileContents = await readFileAsync(filePath, 'utf8');
            messages = JSON.parse(fileContents);
        } catch (err) {
            messages = [];
        }

        // Check if it is a POST request and process accordingly
        if (req.method === 'POST' && req.body.id && req.body.username && req.body.message) {
            const { id, username, message } = req.body;
            const timestamp = new Date().toISOString();
            const newMessage = { id, username, message, timestamp };
            messages.push(newMessage);

            // Write the updated messages array back to the file
            await writeFileAsync(filePath, JSON.stringify(messages, null, 2));
            console.log('Message appended to file successfully');
        }

        // Return the (possibly updated) array of messages
        res.json(messages);
    } catch (err) {
        console.error('Error processing chat message:', err);
        next(err); // Forward error to the error handling middleware
    }
};

module.exports = chatpageController;

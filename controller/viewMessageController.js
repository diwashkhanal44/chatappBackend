// viewMessageController.js
const fs = require('fs');
const util = require('util');
const path = require('path');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const messageFilePath = path.join(__dirname, '../public/json/message.json');

const viewMessageController = function(req, res) {
    const io = res.locals.io;

    io.once('connection', (socket) => {
        console.log('A user connected');

        socket.once('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('new_message', async (msg) => {
            try {
                const data = await readFileAsync(messageFilePath, 'utf8');
                const messages = data.trim() ? JSON.parse(data) : [];
                messages.push(msg);
                await writeFileAsync(messageFilePath, JSON.stringify(messages, null, 2), 'utf8');
                io.emit('receive_message', msg);
            } catch (err) {
                console.error('Failed to save message:', err);
                socket.emit('error_message', 'Failed to save message');
            }
        });

        // Send existing messages to just connected socket
        const sendExistingMessages = async () => {
            try {
                const data = await readFileAsync(messageFilePath, 'utf8');
                const messages = data.trim() ? JSON.parse(data) : [];
                socket.emit('existing_messages', messages);
            } catch (err) {
                console.error('Error reading messages:', err);
                socket.emit('error_message', 'Failed to load messages');
            }
        };

        sendExistingMessages();
    });

    res.render('viewMessage');
};

module.exports = viewMessageController;

const express=require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const groupListController = (req, res, next) => {
    const groupsListFilePath = path.join(__dirname, '../public/json/groupsList.json');

   
    if (!fs.existsSync(groupsListFilePath)) {
        fs.writeFileSync(groupsListFilePath, JSON.stringify([]));
    }

    fs.readFile(groupsListFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading groupsList.json file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (!data) {
            
            res.render('groups', { title: "from group Page Controller", groups: [] });
            return;
        }
        try {
            const groupsData = JSON.parse(data);
            
            res.render('groups', { title: "Groups ", groups: groupsData });
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            res.status(500).send('Internal Server Error');
        }
    });
};

const createGroupController = (req, res, next) => {
    const groupName = req.body.name; 
    console.log(groupName);
    const groupsListFilePath = path.join(__dirname, '../public/json/groupsList.json');
    const groupId = uuid.v4();
    
    fs.readFile(groupsListFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading groupsList.json file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        let groupsList = [];
        if (data) {
            try {
                groupsList = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing JSON data:', parseError);
                res.status(500).send('Internal Server Error');
                return;
            }
        }

        
        const newGroup = {
            id: groupId,
            name: groupName
        };


        groupsList.push(newGroup);

       
        fs.writeFile(groupsListFilePath, JSON.stringify(groupsList), (err) => {
            if (err) {
                console.error('Error writing to groupsList.json file:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            
            res.send('Group created successfully');
        });
    });
};

const deleteGroupController = (req, res, next) => {
    const groupId = req.params.groupid;
    const groupsListFilePath = path.join(__dirname, '../public/json/groupsList.json');

    fs.readFile(groupsListFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading groupsList.json file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        let groupsList = [];
        if (data) {
            try {
                groupsList = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing JSON data:', parseError);
                res.status(500).send('Internal Server Error');
                return;
            }
        }

        // Find index of group with specified groupId
        const index = groupsList.findIndex(group => group.id === groupId);
        if (index === -1) {
            res.status(404).send('Group not found');
            return;
        }

        // Remove group from the array
        groupsList.splice(index, 1);

        // Write updated array back to the file
        fs.writeFile(groupsListFilePath, JSON.stringify(groupsList), (err) => {
            if (err) {
                console.error('Error writing to groupsList.json file:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.send('Group deleted successfully');
        });
    });
};

const eachGroupMessageController = (req, res, next) => {
    const groupId = req.params.groupId;
    console.log(groupId);

    // Read group name from groupsList.json
    const groupsListFilePath = path.join(__dirname, '../public/json/groupsList.json');
    fs.readFile(groupsListFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading groupsList.json file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const groupsList = JSON.parse(data);
        const group = groupsList.find(group => group.id === groupId);
        const groupName = group ? group.name : '';

        // Read group messages from groupmessages.json
        const groupMessagesFilePath = path.join(__dirname, '../public/json/groupmessages.json');
        fs.readFile(groupMessagesFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading groupmessages.json file:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            let messages = [];
            if (data) {
                messages = JSON.parse(data);
            }

            // Check if messages array is empty
            if (messages.length === 0) {
                res.render('eachgroup', { groupId: groupId, groupName: groupName, messages: messages });
                return;
            }

            // Filter messages by groupId
            const filteredMessages = messages.filter(message => message.groupId === groupId);

            res.render('eachgroup', { groupId: groupId, groupName: groupName, messages: filteredMessages });
        });
    });
};

const addUserController = (req,res,next)=>{

}


module.exports = { 
    groupListController:groupListController,
    createGroupController:createGroupController,
    deleteGroupController:deleteGroupController,
    eachGroupMessageController:eachGroupMessageController,
    addUserController:addUserController,
    
};

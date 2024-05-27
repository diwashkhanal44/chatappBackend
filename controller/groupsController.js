const express=require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const moment = require('moment');

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
    const users = [];
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
            name: groupName,
            users: users
        };

        groupsList.push(newGroup);

        fs.writeFile(groupsListFilePath, JSON.stringify(groupsList, null, 2), (err) => {
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

            let messages = {};
            if (data) {
                messages = JSON.parse(data);
            }

            // Get messages for the specific groupId
            const filteredMessages = messages[groupId] || [];

            res.render('eachgroup', { groupId: groupId, groupName: groupName, messages: filteredMessages });
        });
    });
};


const addUserController = (req, res, next) => {
    console.log(req.body);

    const username = req.body.username;
    const groupId = req.body.groupId;

    const groupDataFilePath = path.join(__dirname, '../public/json/groupsList.json');

    fs.readFile(groupDataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading groupList.json file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        let groupList;
        if (data) {
            try {
                groupList = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing JSON data:', parseError);
                res.status(500).send('Internal Server Error');
                return;
            }
        } else {
            groupList = []; // Initialize empty array if no data exists
        }

        // Find the target group by ID instead of assuming it's the first element
        const targetGroupIndex = groupList.findIndex(group => group.id === groupId);

        if (targetGroupIndex === -1) {
            // Group not found, handle error or create a new group (optional)
            console.error('Group with ID:', groupId, 'not found.');
            res.status(404).send('Group not found.');
            return;
        }

        const targetGroup = groupList[targetGroupIndex];

        // Check for missing users array or empty user list
        if (!targetGroup.users) {
            targetGroup.users = []; // Initialize empty users array if missing
        }

        // Check if user already exists in the group
        const userExists = targetGroup.users.some(user => user.id === username);

        if (userExists) {
            // User already in the group, inform user
            console.log('User already exists in the group.');
            res.send('This user is already a member of the group.');
            return;
        }

        // User not found in the group, add it
        targetGroup.users.push({ id: username }); // Assuming username is the user ID here

        fs.writeFile(groupDataFilePath, JSON.stringify(groupList, null, 2), (err) => {
            if (err) {
                console.error('Error writing to groupList.json file:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.send('User successfully added to the group. However, functionality to grant access to group messages is not yet implemented.');
        });
    });
};

const getGroupMessagesController = (req, res, next) => {
    const groupId = req.params.groupid;

    const groupMessagesFilePath = path.join(__dirname, '../public/json/groupmessages.json');

    fs.readFile(groupMessagesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading groupmessages.json file:', err);
            return res.status(500).send('Internal Server Error');
        }

        let groupMessages;
        if (data) {
            try {
                groupMessages = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing JSON data:', parseError);
                return res.status(500).send('Internal Server Error');
            }
        } else {
            groupMessages = {}; // Initialize empty object if file is empty
        }

        const messages = groupMessages[groupId] || [];
        res.json(messages);
    });
};


const postGroupMessagesController = (req, res, next) => {
    const { groupId, username, message } = req.body;

    console.log(groupId,username,message)

    if (!groupId || !username || !message) {
      return res.status(400).send('Missing required fields: groupId, username, or message');
    }

    const messageData = {
      username,
      message,
      timestamp: new Date().toISOString(),
    };

    const groupMessagesFilePath = path.join(__dirname, '../public/json/groupmessages.json');

    fs.readFile(groupMessagesFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading groupmessages.json file:', err);
        return res.status(500).send('Internal Server Error');
      }

      let groupMessages = {};
      if (data) {
        try {
          groupMessages = JSON.parse(data);
        } catch (parseError) {
          console.error('Error parsing JSON data:', parseError);
          return res.status(500).send('Internal Server Error');
        }
      }

      if (!groupMessages[groupId]) {
        groupMessages[groupId] = [];
      }

      groupMessages[groupId].push(messageData);

      fs.writeFile(groupMessagesFilePath, JSON.stringify(groupMessages, null, 2), (err) => {
        if (err) {
          console.error('Error writing to groupmessages.json file:', err);
          return res.status(500).send('Internal Server Error');
        }
        res.send('Message successfully added.');
      });
    });
};


module.exports = { 
    
    groupListController:groupListController,
    createGroupController:createGroupController,
    deleteGroupController:deleteGroupController,
    eachGroupMessageController:eachGroupMessageController,
    addUserController:addUserController,
    getGroupMessagesController:getGroupMessagesController,
    postGroupMessagesController:postGroupMessagesController
    
};

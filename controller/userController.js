const express = require('express');
const fs = require('fs');
const path = require('path');

const usersController = (req,res,next) => {
  const userListFilePath = path.join(__dirname, '../public/json/userList.json');

  fs.readFile(userListFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading userList.json file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    try {
      const userList = JSON.parse(data);
      res.json(userList); // Send the parsed user list as response
    } catch (parseError) {
      console.error('Error parsing JSON data:', parseError);
      res.status(500).send('Internal Server Error');
    }
  });
};

// Export the function itself, not the return value of its execution
module.exports = usersController;

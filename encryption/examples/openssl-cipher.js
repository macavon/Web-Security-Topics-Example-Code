var crypto = require('crypto');

var passPhrase = 'a flock of swordfish';
var plainText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

var c = crypto.createCipher('aes-192-cbc', passPhrase);
var cipherText = c.update(plainText, 'utf8', 'base64') +
                 c.final('base64');

var d = crypto.createDecipher('aes-192-cbc', passPhrase);
var decipheredText = d.update(cipherText, 'base64', 'utf8') +
                     d.final('utf8');

process.stdout.write(cipherText);
process.stdout.write(decipheredText);


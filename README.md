# Hello Twitch: Check if a user is connected to a channels chat.
A small node js script that checks if a specific user is connected to a specific twitch channels chat.
It does not check every single user in bigger streams (just all vips, mods, the broadcaster and up to 100 chatters).

## Caution:
Don't over use it, you might get rate limited and/or banned from twitch.
This is intended for educational purposes only.

## Requirements:
- Node.js
- npm

## Usage:
1. Clone the repository
2. `cd hello-twitch` into the directory
3. Install the dependencies with `npm install`
4. Edit the `config` object inside `index.js` or use the `CLI` to suit your needs (see `node index.js --help` or `npm start -- --help` for more information; CLI options overwrite the config object)
5. Run the script with `node index.js [options]` or `npm start -- [options]`

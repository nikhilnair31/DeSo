import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';

// Database
export const db = GUN();

// Gun User
export const user = db.user().recall({sessionStorage: true});

// Current User's username
export let username = '';

user.get('alias').on(v => username = v)

db.on('auth', async(event) => {
    console.log('user: ', user, '- event: ', event);
    const alias = user.get('alias'); // username string
    console.log('alias: ', alias);
    username = alias;
    console.log(`signed in as ${username}`);
});
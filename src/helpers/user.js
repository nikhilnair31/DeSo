import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';

// Database
export const db = GUN();

// Gun User
export const user = db.user().recall({sessionStorage: true});

db.on('auth', async(event) => {
    let username = '';
    console.log('user: ', user, '- event: ', event);
    const alias = user.get('alias'); // username string
    console.log('alias: ', alias);
    username = alias;
    console.log(`signed in as ${username}`);
});
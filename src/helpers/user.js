import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';

// Database
export const db = GUN({
    peers: [
      'http://localhost:8765/gun'
    ]
});

// Gun User
export const user = db.user().recall({sessionStorage: true});

db.on('auth', async(event) => {
    db.user(user.is.pub).once(dat => {
        console.log('user: ', user);
    });
    // db.user(user.is.pub).once( dat => console.log('dat: ', dat));
});
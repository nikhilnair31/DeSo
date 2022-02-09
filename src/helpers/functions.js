// TIme diff
export var match = {
    // lexical queries are kind of like a limited RegEx or Glob.
    '.': {
    // property selector
    '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
    },
    '-': 1, // filter in reverse
};
// TIme diff
export let imagebasedomains = ['https://ipfs.io/ipfs/', 'https://gateway.pinata.cloud/ipfs']

// TIme diff
export const timeDifference = (utc) => {
    // dayjs(item.utc).format("YYYY-MM-DD")
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var now = Math.floor(Date.now())
    var elapsed = now - utc;
    // console.log(elapsed, '=', now, '-', utc);

    if (elapsed < msPerMinute) {
        return Math.round(elapsed/1000) + 's';   
    }
    else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + 'm';   
    }
    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + 'h';   
    }
    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + 'd';   
    }
    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + 'month';   
    }
    else {
        //return 'around ' + Math.round(elapsed/msPerYear ) + ' years ago'; 
        return Math.round(elapsed/msPerYear ) + 'year';   
    }
}
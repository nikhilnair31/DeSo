const axios = require('axios');
const FormData = require('form-data');

export const pinFileToIPFS = (file) => {
    let data = new FormData();
    data.append('file', file);

    return axios.post(`https://api.pinata.cloud/pinning/pinFileToIPFS`,
        data,
        {
            maxContentLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'pinata_api_key': '19c6af79dcf0558a1db6',
                'pinata_secret_api_key': '158763cd14beb46de4aa51d2af3dcbfdb8b8be030975dc53a8a1559c9fb7520a'
            }
        }
    )
    .then(function (response) {
        console.log('pinFileToIPFS response: ', response);
    })
    .catch(function (error) {
        console.log('pinFileToIPFS error: ', error);
    });
};
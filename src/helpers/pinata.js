const axios = require('axios');
const FormData = require('form-data');

export async function pinFileToIPFS (file) {
    try {
        let data = new FormData();
        data.append('file', file);

        const {data:response} = await axios.post(`https://api.pinata.cloud/pinning/pinFileToIPFS`,
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
        return response
    }
    catch (error) {
        console.log(error);
    }
};
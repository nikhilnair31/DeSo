const axios = require('axios');
const FormData = require('form-data');

export async function textToImage (posttext) {
    try {
        const response = await axios
        .get(`https://carbon-api-31.herokuapp.com/?code=${posttext}&theme=darcula&backgroundColor=rgba(255, 255, 255, 100)`, {
            responseType: 'arraybuffer'
        })
        // .then(response => {
        //     console.log('textToImage response: ', response);
        //     // let blob = new Blob(
        //     //     [response.data], 
        //     //     { type: response.headers['content-type'] }
        //     // )
        //     // console.log('textToImage blob: ', blob);
        //     // return blob
        // })
        return response
    }
    catch (error) {
        console.log(error);
    }
};
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
export async function pinJSONToIPFS (JSONBody) {
    try {
        const {data:response} = await axios.post(`https://api.pinata.cloud/pinning/pinJSONToIPFS`,
            JSONBody,
            {
                headers: {
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
export async function unpinFile (hashToUnpin) {
    try {
        const {data:response} = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${hashToUnpin}`,
            {
                headers: {
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
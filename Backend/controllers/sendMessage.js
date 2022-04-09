const axios = require('axios');
const FormData = require('form-data');

exports.sendOTPMessage = async (req, res, next) => {

    const {mobile} = req.body;

    const data = new FormData();
    data.append('mobile', '');
    data.append('message', `Hey customer, Your OTP code is {code}`);
    data.append('expiry','900');

    try{
        const resonse = await axios({
            method : 'POST',
            url : 'https://d7networks.com/api/verifier/send',
            headers: {
                Authorization : process.env.API_TOKEN,
                ...data.getHeaders(),
            },
            data : data
        });

        console.log("data => ", response?.data);
    }catch(error){
        console.log(error.message);
    }
    
}

import axios from "axios";
import key from "../../../assets/keyAdafruit.js";

function sendFanSpeedData (value)  {
    axios
        .post(
        'https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v12/data',{value: value,},{headers: {'X-AIO-Key': key, }, }  )
        .then(response => {
        // console.log(response.data);
        })
        .catch(error => {
        // console.log(error);
        });
};

function turnLight(value) {
    axios
        .post(
            'https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v10/data', { value: value, }, { headers: { 'X-AIO-Key': key, }, })
        .then(response => {
            // console.log(response.data);
        })
        .catch(error => {
            // console.log(error);
        });
};

export const turnOff = () =>{
    alert("Turning Off All Devices");
    turnLight('0');
    sendFanSpeedData(0);
};

export const turnOn = (value) =>{
    alert("Turning On All Devices")
    turnLight('1');
    sendFanSpeedData(value);
};



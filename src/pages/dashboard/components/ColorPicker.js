import React, { useState, useEffect } from "react"; 
import key from "../../../assets/keyAdafruit.js";
import {
    Col,
    Row,
    Progress,
    Button,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown
  } from "reactstrap";

//   #FF0000	Red
// #FFA500 	Orange
// #FFFF00	Yellow
// #00FF00	Green
// #0000FF	Blue
// #4B0082	Indigo
// #800080	Purple
import s from "../Dashboard.module.scss";
import { CirclePicker } from "react-color";
import { Switch } from "antd";
import axios from "axios";
const colors = ["White","Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Purple"];


export default function ColorPicker(status) {
  const [color, setColor] = useState("#000000");
  const [showPicker, setShowPicker] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [lastColor, setLastColor] = useState("Red");
  useEffect(() => {
      const interval = setInterval(() => {
      axios
        .get('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v10')
        .then(response => {
          if (response.data.last_value == 1) {
            setIsSwitchOn(true)
          }
          else setIsSwitchOn(false);
          // console.log(response.data.last_value)
        });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendData = async () => {
    const url = 'https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v10/data';
    const value = isSwitchOn ? '0' : '1';
    const data = { datum: { value } };
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-AIO-Key': key },
      body: JSON.stringify(data),
    };
    await fetch(url, options);
  };
    
  const sendColorData =  (value) => {
    axios.post('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v11/data', {
        value: value
      }, {
        headers: {
          'X-AIO-Key': key
        }
      })
      .then(response => {
        // console.log(response.data);
      })
      .catch(error => {
        // console.log(error);
      });
 
  };

  const handleColorChange = (selectedColor) => {
    setColor(selectedColor.hex);
    setLastColor(selectedColor.hex);
    sendColorData(selectedColor.hex)
    setShowPicker(false); 
  };

  const handleSwitchToggle = (checked) => {
    setIsSwitchOn(checked);
    sendData();
    setColor(checked ? lastColor : "#000000");
    console.log("Last color:", lastColor)
    if (checked) sendColorData (lastColor)
    else sendColorData ("#000000")
  };

  const handleCircleClick = () => {

    setShowPicker(true); 
    if (!isSwitchOn) {
        setIsSwitchOn(true) 
        sendData();
        sendColorData(lastColor)
        
    }

  };

  

  return (

    <div className={`mt-3 ${s.widgetBlock}`}>
    <div className={s.widgetBody}>
      <div className="d-flex">  
        <div className="d-flex flex-column">
          <p className="body-2" >Phòng khách </p>
          <p className="body-3 muted">Đèn chiếu</p>   
          
        </div>
        
      </div>
      <div className="checkbox checkbox-primary">
      {showPicker&&isSwitchOn ?< CirclePicker  className="checkbox checkbox-primary" colors={colors} onChange={handleColorChange} />:
        <div
        
        style={{
          width: "30px",
          height: "30px",
          backgroundColor: isSwitchOn ? lastColor : color,
          borderRadius: "50%",
          marginTop: "10px",
          cursor: "pointer"
        }}
        className="checkbox checkbox-primary"
        onClick={handleCircleClick}
      />}
      
        </div>
        <Switch checked={isSwitchOn} onChange={handleSwitchToggle} />
      </div>               
      
    </div>
  );
};







// import React, { useState, useEffect } from 'react';

// export function App(props) {
//   const [imageData, setImageData] = useState(null);

//   useEffect(() => {
//     async function fetchImage() {
//       const response = await fetch('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/image', {
//       });
//       const data = await response.json();
//       setImageData(data.last_value);
//     }
//     fetchImage();
//   }, []);

//   return (
//     <div>
//       {imageData && (
//         <img src={`data:image/jpeg;base64,${imageData}`} alt="Adafruit API image" />
//       )}
//     </div>
//   );
// }

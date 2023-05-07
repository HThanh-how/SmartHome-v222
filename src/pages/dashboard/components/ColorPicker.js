import React, { useState, useEffect } from "react"; 
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
import s from "../Dashboard.module.scss";
import { CirclePicker } from "react-color";
import { Switch } from "antd";
import axios from "axios";
const colors = ["#FFFFFF","#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#0000FF", "4B0082", "#800080"];


export default function ColorPicker(status) {
  const [color, setColor] = useState("#000000");
  const [showPicker, setShowPicker] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [lastColor, setLastColor] = useState("#FF0000");

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v11')
        .then(response => {
          if (response.data.last_value != "#000000") {
            setIsSwitchOn(true)
            setLastColor(response.data.last_value)
          }
          console.log(response.data.last_value)
        });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sendColorData =  (value) => {
    axios.post('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v11/data', {
        value: value
      }, {
        headers: {
          'X-AIO-Key': 'aio_XTyq67VDg7YwxsD9u99ZDGmCowiU'
        }
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
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
    setColor(checked ? lastColor : "#000000");
    if (checked) sendColorData (lastColor)
    else sendColorData ("#000000")
  };

  const handleCircleClick = () => {
    setShowPicker(true); 
    if (!isSwitchOn) {
        setIsSwitchOn(true) 
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



console.log('Hello console')
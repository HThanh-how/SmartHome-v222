import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Col,
  Row,
  Progress,
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from 'reactstrap';
import ColorPicker from './components/ColorPicker.js';
import Widget from '../../components/Widget/Widget.js';
import { Switch, Slider, Space } from 'antd';
import s from './Dashboard.module.scss';
import ApexLineChart from './components/ApexLineChart.js';

const Dashboard = () => {
  const [lightButton, setLightButton] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v10')
        .then(response => {
          if (response.data.last_value == 1) setLightButton(true);
          else setLightButton(false);
        });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  console.log(lightButton);
  const [tempSensorValue, setTempSensorValue] = useState();
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v1')
        .then(response => {
          setTempSensorValue(response.data.last_value);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [humidSensorValue, setHumidSensorValue] = useState();
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v2')
        .then(response => {
          setHumidSensorValue(response.data.last_value);
        });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const [lighSensorValue, setLightSensorValue] = useState();
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v3')
        .then(response => {
          setLightSensorValue(response.data.last_value);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [fanSpeed, setFanSpeed] = useState();
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v12')
        .then(response => {
          setFanSpeed(response.data.last_value);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sendFanSpeed = value => {
    setFanSpeed(value);
    sendFanSpeedData(value);
  };

  const sendFanSpeedData = value => {
    setFanSpeed(value);
    console.log(fanSpeed);
    if (muted) {
      setPreviousSpeed(value);
    }

    axios
      .post(
        'https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v12/data',
        {
          value: value,
        },
        {
          headers: {
            'X-AIO-Key': 'aio_XTyq67VDg7YwxsD9u99ZDGmCowiU',
          },
        }
      )
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const [AIreconizer, getDataAI] = useState();
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v14')
        .then(response => {
          getDataAI(response.data.last_value);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const [muted, setMuted] = useState(false);
  const [previousSpeed, setPreviousSpeed] = useState(fanSpeed);

  const handleMuteSwitch = checked => {
    setMuted(!checked);
    if (!checked) {
      setPreviousSpeed(fanSpeed);
      sendFanSpeed(0);
    } else {
      sendFanSpeed(previousSpeed);
    }
  };
  const handleTurnAll=() => {
    handleMuteSwitch(false)
    setMuted(true)
    ColorPicker(false)
    
    handleClick()

  }
  const sendData = async () => {
    const url = 'https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v10/data';
    const key = 'aio_XTyq67VDg7YwxsD9u99ZDGmCowiU';
    const value = lightButton ? '0' : '1';
    const data = { datum: { value } };
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-AIO-Key': key },
      body: JSON.stringify(data),
    };
    await fetch(url, options);
  };

  const handleClick = () => {
    setLightButton(!lightButton);
    sendData();
  };

  return (
    <div>
      <Row>
        <Col className='pr-grid-col' xs={12} lg={8}>
          <Row className='gutter mb-4'>
            <Col className='mb-4 mb-md-0' xs={12} md={12}>
              <Widget className='widget-p-md'>
                <div className='headline-2 mb-3'>Lịch sử nhiệt độ</div>
                <ApexLineChart />
              </Widget>
            </Col>
          </Row>

          <Row className='gutter'>
            <Col className='mb-4 mb-xl-0' xs={6} sm={6} xl={3}>
              <Widget className='widget-p-sm'>
                <div className={s.smallWidget}>
                  <div className='d-flex mb-4'>
                    <div className='d-flex flex-column'>
                      <p className='headline-3' style={{ color: 'red' }}>
                        Nhiệt độ phòng
                      </p>
                      <p
                        className='body-2'
                        style={{ fontSize: '40px', color: 'pink' }}
                      >
                        {tempSensorValue} °C
                        <span className='body-3 muted'></span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <Progress
                      color='secondary-red'
                      className={`progress-xs ${s.mutedPink}`}
                      value={tempSensorValue}
                    />
                  </div>
                </div>
              </Widget>
            </Col>
            <Col className='mb-4 mb-xl-0' xs={6} sm={6} xl={3}>
              <Widget className='widget-p-sm'>
                <div className={s.smallWidget}>
                  <div className='d-flex mb-4'>
                    <div className='d-flex flex-column'>
                      <p className='headline-3'>Độ ẩm</p>
                      <p
                        className='body-2'
                        style={{ fontSize: '40px', color: 'secondary-yellow' }}
                      >
                        {humidSensorValue}
                        <span className='body-3 muted'>%</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <Progress
                      color='secondary-yellow'
                      className={`progress-xs ${s.mutedYellow}`}
                      value={humidSensorValue}
                    />
                  </div>
                </div>
              </Widget>
            </Col>

            <Col xs={6} sm={6} xl={3}>
              <Widget className='widget-p-sm'>
                <div className={s.smallWidget}>
                  <div className='d-flex mb-4'>
                    <div className='d-flex flex-column'>
                      <p className='headline-3'>Độ sáng phòng</p>
                      <p
                        className='body-2'
                        style={{ fontSize: '40px', color: 'secondary-cyan' }}
                      >
                        {lighSensorValue}
                        <span className='body-3 muted'>lux</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <Progress
                      color='secondary-cyan'
                      className={`progress-xs ${s.mutedTeal}`}
                      value={lighSensorValue}
                    />
                  </div>
                </div>
              </Widget>
            </Col>
            <Col xs={6} sm={6} xl={3}>
              <Widget className='widget-p-sm'>
                <div className={s.smallWidget}>
                  <div className='d-flex mb-4'>
                    <div className='d-flex flex-column'>
                      <p className='headline-3'>AI</p>
                      <p
                        className='body-2'
                        style={{ fontSize: '30px', color: 'secondary-cyan' }}
                      >
                        {AIreconizer}
                        <span className='body-3 muted'> </span>
                      </p>
                    </div>
                  </div>
                  {/* <div>
                    <Progress color="violet" className={`progress-xs ${s.mutedViolet}`} value="50" />
                  </div> */}
                </div>
              </Widget>
            </Col>
          </Row>
        </Col>


        {/* xs, extra-small: 0px
sm, small: 600px
md, medium: 900px
lg, large: 1200px
xl, extra-large: 1536px */}
        
        <Col className='mt-4 mt-lg-0 pl-grid-col' xs={12} lg={4}>
       
        
          <Widget className='widget-p-lg'>
          <p className='headline-3'>Thông minh</p>
            <div className={`mt-3 ${s.widgetBlock}`}>
              <div className={s.widgetBody}>
                <div className='d-flex'>
                  <div className='d-flex flex-column'>
                    <p className='body-2'>Trợ lý</p>
                    <p className='body-3 muted'>Đèn trần</p>
                  </div>
                </div>
                <div className='checkbox checkbox-primary'>
                 
                </div>
              </div>
            </div>
            <p className='headline-3 mt-3'>Công tắt</p>
            <div className={`mt-3 ${s.widgetBlock}`}>
              <div className={s.widgetBody}>
                <div className='d-flex'>
                  <div className='d-flex flex-column'>
                    <p className='body-2'>Phòng khách</p>
                    <p className='body-3 muted'>Đèn trần</p>
                  </div>
                </div>
                <div className='checkbox checkbox-primary'>
                  <Switch
                    checked={lightButton}
                    style={{ cursor: 'pointer' }}
                    onClick={handleClick}
                  />
                </div>
              </div>
            </div>
            <div className={`mt-3 ${s.widgetBlock}`}>
              <div className={s.widgetBody}>
                <div className='d-flex'>
                  <div className='d-flex flex-column'>
                    <p className='body-2'>Phòng khách </p>
                    <p className='body-3 muted'>Quạt</p>
                  </div>
                </div>
                <div className='checkbox checkbox-primary'>
                  <Switch
                    checked={!muted}
                    onChange={handleMuteSwitch}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
              <Slider
                className='d-flex flex-column ml-3 mr-3'
                value={muted ? previousSpeed : fanSpeed}
                onChange={sendFanSpeed}
                disabled={muted}
              />
            </div>
            <ColorPicker />
            <a
              className={`btn-secondary-red ${s.statsBtn}`}
              role='button'
            >
              <div>
                <p className='headline-2' onClick={handleTurnAll}>Tắt tất cả</p>
              </div>
            </a>
          </Widget>
        </Col>

      </Row>
    </div>
  );
};

export default Dashboard;

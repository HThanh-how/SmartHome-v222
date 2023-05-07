import React from "react";
import {
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import s from "./ErrorPage.module.scss";

import errorImage from "../../assets/errorImage.svg"
import FooterIcon from "../../components/Icons/FooterIcon.js";

const ErrorPage = () => {
  return (
    <div className={s.pageContainer}>
      <div className={s.errorContainer}>
        <h1 className={s.errorCode}>404</h1>
        <p className={s.errorInfo}>
          Oops. Có vẻ bạn đang đi lạc đâu đây rồi!!!! 
        </p>
        <p className={s.errorHelp}>
          Chúng mình sẽ đưa bạn về an toàn thôi nè!!!
        </p>
        <Link to="/SmartHome/dashboard">
          <Button className={`${s.errorBtn} rounded-pill`} type="submit" color="secondary-red">
            Về thôi
          </Button>
        </Link>
      </div>
      <div className={s.imageContainer}>
        <img className={s.errorImage} src={errorImage} alt="Error page" width="80" />
      </div>
      <div className={s.footer}>
        <span className={s.footerLabel}>2022 &copy; Tel'net</span>
        <FooterIcon />
      </div>
    </div>
  );
}

export default ErrorPage;

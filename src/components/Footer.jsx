import React from 'react';
import './Footer.scss';

const Footer = (props) => (
    <div className="footer_wrapper" ref={props.refe}>
        <div className="footer">
            <h5>Copyrights © Nikhil Nair 2021. All Rights Reserved.</h5>
        </div>
    </div>
);

export default Footer;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const NotificationBar = ({ text = "Something went wrong" }) => {
    const [notificationText, setNotificationText] = useState(text);

    return (
        <motion.div className='absolute top-10 w-full h-9 bg-Error-grey text-Error-text content-center text-center' style={{maxWidth : 408, borderRadius: 25}}>
            <motion.p>
                {notificationText}
            </motion.p>
        </motion.div>
    );
};

NotificationBar.propTypes = {
    text: PropTypes.string,
};

export default NotificationBar;

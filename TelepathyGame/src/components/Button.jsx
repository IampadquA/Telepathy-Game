import React from 'react'
import PropTypes from "prop-types";
import {motion} from "framer-motion";

const Button = ({buttonText,className, primary, ...props}) => {
  
  const ButtonHoverEffect = (
    <>
        <div className={`h-14 border-borderRed ${className}`} style={{maxWidth: 408,borderWidth: 1}}>
        
        /* TODO LATER */
        </div>
    </>
  )
  
  return (<>
    <motion.button 
    whileHover={{ scale: 1.03 }}
    whileTap={{ backgroundColor: "#884449" }}
    className={`h-14 border-borderRed bg-bgblue bg-opacity-50 text-center text-white font-normal text-base ${className}`} style={{maxWidth: 408,borderWidth: 1}} {...props} >
        {buttonText}
    </motion.button>
    </>
  )
}

Button.propTypes = {
    buttonText : PropTypes.string,
    className : PropTypes.string,
    primary : PropTypes.bool
};

Button.defaultPorps = {
    primary : false,
}





export default Button
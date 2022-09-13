import React from 'react'
import classes from "./Button.module.css"

const Button = (props) => {
  return (
    <button disabled={props.disabled} className={`${classes.button} ${props.classes}`} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export default Button
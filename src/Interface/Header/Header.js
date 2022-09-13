import React from 'react'
import classes from "./Header.module.css"
import Navbar from "../Navbar/Navbar.js"

const Header = () => {
  return (
    <div className={classes.main}>
        <h1>Meal Planner</h1>
        <div className={classes.navContainer}>
          <Navbar />
        </div>  
    </div>
  )
}

export default Header
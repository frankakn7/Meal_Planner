import React from 'react'

import classes from "./Navbar.module.css"

import {Link} from 'react-router-dom'

const Navbar = () => {
  return (
    <div className={classes.main}>
        <nav className={classes.nav}>
            <Link to="/Editor">Editor</Link>
            <Link to="/Ingredients">Ingredients</Link>
            <Link to="/Recipes">Recipes</Link>
            <Link to="/Plans">Saved Plans</Link>
        </nav>
    </div>
  )
}

export default Navbar
import React from 'react'
import classes from "./Header.module.css";

function Header(props) {
  return (
    <div className={classes.container}>
        <h1>Threader</h1>
        <p>Current Balance: {props.balance}</p>
    </div>
  )
}

export default Header
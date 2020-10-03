import React, { Component } from 'react'
import styles from './NavBar.module.css'
export default class NavBar extends Component {
    render() {
        return (
            <div className={styles.container}>
                <ul className={styles.ul}>
                    <li className="active"><a href="#/main">Buy</a></li>
                    <li><a href="#">Home</a></li>
                    <li className={styles.logo}><a href="#">Crypto Estate</a></li>
                </ul>
            </div>
        )
    }
}
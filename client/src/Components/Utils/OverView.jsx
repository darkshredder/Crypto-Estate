import React, { Component } from 'react'
import styles from './OverView.module.css'
export default class NavBar extends Component {
    render() {
        return (
            <div className={styles.container}>
                <h3 className={styles.overh}>
                    What is Crpto Estate?
            </h3>
                <p className={styles.overp}>Crypto Estate is a first of it's kind block-chain based and IPFS-deployed solution to buying,<br></br>
                    selling and registering your real-estate property.<br></br>
                    We offer a visual overview of the properties which are for sale.<br></br>
                    Here only the smart contract owner can register their respective piece of land.<br></br>
                    And then anyone can buy and sell that particular piece of land on this platform.
                    <br></br><br></br>
                    To use Crypto-estate, you must have a portis wallet.
                    To buy property on Crypto Estate, you must have an account on the MATIC(Mumbai) network.
                    <br></br><br></br>
                    On the doughnut chart on the left, you can see the number of users on this platform who want to sell their property.
                </p>
            </div>
        )
    }
}
import React, { Component } from 'react'

import NavBar from '../Utils/NavBar'
import Stats from '../Utils//Stats'
import OverView from '../Utils//OverView'
import styles from './Home.module.css'
export default class Home extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className={styles.container}>
          <div className={styles.chart}><Stats />
          </div>
          <div className={styles.overview}>
            <OverView />
          </div>
        </div>
      </div>
    )
  }
}

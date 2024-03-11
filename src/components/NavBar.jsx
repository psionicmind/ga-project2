import React from 'react';
import styles from "./NavBar.module.css"
import { NavLink } from 'react-router-dom';

const NavBar = () => {
    return <header className={styles.navbar}>
        <nav>
            <ul>
                <li>
                    <NavLink className={(navData) => (navData.isActive ? styles.active : "")} to="/WhaleCatcher">WhaleCatcher</NavLink>
                </li>
                <li>
                    <NavLink className={(navData) => (navData.isActive ? styles.active : "")} to="/ContractAddress">ContractAddress</NavLink>
                </li>
                <li>
                    <NavLink className={(navData) => (navData.isActive ? styles.active : "")} to="/WalletAddress">WalletAddress</NavLink>
                </li>
            </ul>
        </nav>
    </header>
};

export default NavBar;
import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Home } from '../pages/Home'

export const Layout = () => {
    return (
        <div className="layout">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <Home />
            </div>
        </div>
    )
}

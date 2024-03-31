import React from 'react';
import Chat from '../chat'
import ContactList from '../contactList'
import './HomePageCss.css'

const HomePage = () => {
    return (
        <div className="container">
            <ContactList
            />
            <div className="dividerColumn" />
            <Chat />
        </div>
    );
}

export default HomePage;
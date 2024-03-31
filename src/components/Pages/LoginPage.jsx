import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PhoneAuth from './PhoneAuth';
import DetailsPage from './DetailsPage';
import HomePage from './HomePage'
import ContactList from '../contactList'
import BlankChat from '../blankChat'

const LoginPage = () => {
    return (
        <Switch>
            <Route exact path="/" component={PhoneAuth} />
            <Route exact path="/details-page/:uid" render={() => <DetailsPage />} />
            <Route exact path="/:uid" render={() =>
                <div className="container">
                    <ContactList
                    />
                    <div className="dividerColumn" />
                    <BlankChat/>
                </div>
            } />
            <Route exact path="/:uid/:chatId/:userId" render={() =>
                <HomePage />
            } />
            <Redirect to="/" />
        </Switch>
    );
}

export default LoginPage;
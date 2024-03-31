import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import firebase from "../firebase-Config";
import { AddIcCall } from '@material-ui/icons';

const UseStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));
const SearchedPersonCards = (props) => {
    const classes = UseStyles();
    const db = firebase.firestore();

    const [user, setUser] = useState([]);

    useEffect(() => {
        fetchUserDetails();
    }, []);
    const fetchUserDetails = async () => {
        db.collection("Users").doc(props.ChatPersonId).get()
            .then(snapshot => setUser(snapshot.data()));
    }
    const addNewChatRoom = () => {
        db.collection("chatRooms").doc(`${props.uid}_${props.ChatPersonId}`).set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(
            db.collection("Users").doc(props.uid).collection("Rooms").doc(props.ChatPersonId).set({
                chatId: `${props.uid}_${props.ChatPersonId}`,
                userId: `${props.ChatPersonId}`
            }).then(
                db.collection("Users").doc(props.ChatPersonId).collection("Rooms").doc(props.uid).set({
                    chatId: `${props.uid}_${props.ChatPersonId}`,
                    userId: `${props.uid}`
                }).then(addChatIdToUser)
            )
        )
    }

    const addChatIdToUser = () => {
        window.location.href = `https://whatsapp-clone-rishav.web.app/${props.uid}/${props.uid}_${props.ChatPersonId}/${props.ChatPersonId}`
    }
    return (
        <>
            <div className="contactCardsContainer">
                <div className="contactCard" onClick={addNewChatRoom}>
                    <Avatar className={classes.large} src={user.image} />
                    <div className="cardTexts">
                        <div>
                            <div className="cardHeading">
                                <div className="contactName">{user.name}</div>
                            </div>
                            <div className="contactText">Start Chatting</div>
                        </div>
                    </div>
                </div>
                <div className="dividerRow" />
            </div>
        </>
    );
};

export default SearchedPersonCards;
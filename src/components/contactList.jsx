import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import SearchIcon from '@material-ui/icons/Search';
import ContactCards from './contactCards';
import SearchedPersonCard from "./SearchedPersonCard"
import firebase from '../firebase-Config'
import { useParams } from 'react-router-dom';
import CancelIcon from '@material-ui/icons/Cancel';

const UseStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(5.5),
        height: theme.spacing(5.5),
    }
}));

const ContactList = (props) => {
    const { uid } = useParams();
    const classes = UseStyles();
    const [User, setUser] = useState([]);
    const [ChatRoom, setChatRooms] = useState([]);
    const [hideButton, setHideButton] = useState(false);
    const [showTextSearch, setShowTextSearch] = useState(false);
    const [showSearchedPerson,setShowSearchedPerson] = useState(false)
    const [searchedNumber, setSearchedNumber] = useState("");
    const [newChatPersonId, setNewChatPersonId] = useState([]);

    useEffect(() => {
        fetchUserDetails();
        fetchChatRooms();
        fetchNewChats();
    }, []);

    const db = firebase.firestore();
    const fetchUserDetails = async () => {
        db.collection("Users").doc(uid).get()
            .then(snapshot => setUser(snapshot.data()));

    }
    const fetchChatRooms = async () => {
        db.collection("Users").doc(uid).collection("Rooms").onSnapshot(function (querySnapshot) {
            setChatRooms(
                querySnapshot.docs.map((doc) => ({
                    chatId: doc.data().chatId,
                    userId: doc.data().userId,
                    timestamp: doc.data.timestamp
                })),
            );
        });
    }
    const fetchNewChats = async () => {

        db.collection("Users").get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    if (doc.data().phoneNumber === searchedNumber) {
                        setNewChatPersonId(doc.id)
                        setShowSearchedPerson(true);
                    }
                });
            });
    }
    const openChatFinder = () => {
        setHideButton(true);
        setShowTextSearch(true);
        setShowSearchedPerson(false);
    }
    const closeChatFinder = () => {
        setHideButton(false);
        setShowTextSearch(false);
        setShowSearchedPerson(false);
        setSearchedNumber("");
    }
    return (
        <div className="contactListContainer">
            <div className="topBar">
                <Avatar className={classes.small} src={User.image} />
                <div className="topIcons">
                    <DonutLargeIcon className="Icons margin-icon" style={{ fontSize: 24 }} />
                    <ChatIcon className="Icons margin-icon" style={{ fontSize: 24 }} />
                    <MoreVertIcon className="Icons margin-icon" style={{ fontSize: 24 }} />
                </div>
            </div>

            <div className="searchBar">
                <div className="search">
                    <SearchIcon className="Icons-search" style={{ fontSize: 18 }} />
                    <input type="text" placeholder="Search or start new chat" />
                </div>
            </div>

            <div className="dividerRow" />

            <div className="chatsList">
                {hideButton ?
                    null
                    : <div className="addNew">
                        <p onClick={openChatFinder}>Add a new Person</p>
                    </div>
                }
                {showTextSearch ?
                    <div className="searchBox">
                        <CancelIcon className="Icons" style={{ fontSize: 32, margin: "16px 0px 10px 10px" }} onClick={closeChatFinder} />
                        <div className="addNew searchPhoneNumber">
                            <input type="text" required="required" placeholder="Enter correct phone number" value={searchedNumber} onChange={(e) => setSearchedNumber(e.target.value)} />
                        </div>
                        <button className="buttonSearch" onClick={fetchNewChats}>Search</button>
                    </div>
                    : null
                }
                <div className="dividerRow" />
                {showSearchedPerson ?
                    <SearchedPersonCard
                    ChatPersonId={newChatPersonId}
                    uid={uid}
                    />
                    : null
                }
                {!showSearchedPerson? ChatRoom.map((chatRoom) => (
                    <ContactCards
                        userId={chatRoom.userId}
                        chatId={chatRoom.chatId}
                        uid={uid}
                    />
                )) : null}
            </div>
        </div>
    );
};

export default ContactList;
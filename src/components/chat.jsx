import React, {useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import { useParams } from 'react-router-dom';
import firebase from "../firebase-Config"
import Message from "./message"

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

const Chats = () => {
    const classes = UseStyles();
    const {uid,chatId,userId} = useParams();
    const db = firebase.firestore();

    const [Room,setRoom] = useState([]);
    const [user,setUser] = useState([]);


    const [message,setMessage] = useState("");
    const [sendBy,setSendBy] = useState("");
    
    useEffect(() => {
        fetchRoomDetails();
        fetchUserDetails();
    }, []);
    const fetchRoomDetails = async () => {
        db.collection("chatRooms").doc(chatId).collection("chats").orderBy("timestamp", "asc").onSnapshot(function (querySnapshot) {
            setRoom(
                querySnapshot.docs.map((doc) => ({
                    message: doc.data().message,
                    sendBy:doc.data().sendBy,
                    timestamp:doc.data.timestamp
                })),
            );
        });
    }
    
    const fetchUserDetails = async () => {
        db.collection("Users").doc(userId).get()
        .then(snapshot => setUser(snapshot.data()));
    }

    const sendMessage = (e) =>{
        e.preventDefault();
        console.log(message)
        db.collection("chatRooms").doc(chatId).collection("chats").add({
            message: message,
            sendBy: uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setMessage("");
    }
    return (
        <div className="chatsContainer">
            <div className="topBar">
                <div style={{ display: "flex" }}>
                    <Avatar className={classes.small} src={user.image} />
                    <div className="titleChat">{user.name}</div>
                </div>
                <div className="topIcons">
                    <SearchIcon className="Icons margin-icon" style={{ fontSize: "24px" }} />
                    <MoreVertIcon className="Icons margin-icon" style={{ fontSize: "24px" }} />
                </div>
            </div>
            <div className="chatsSection">
                {
                     Room.map((room) => (
                         <Message
                          message = {room.message}
                          sendBy = {room.sendBy}
                          currentUser = {uid}
                          timestamp = {room.timestamp}
                         />
                    ))}

            </div>
            <div class="bottomTextBox">
                <div className="boxIcon">
                    <InsertEmoticonIcon className="Icons margin-icon-chat" style={{ fontSize: "26px" }} />
                    <AttachFileIcon className="Icons margin-icon-chat" style={{ fontSize: "26px" }} />
                </div>
                <div className="TypeBox">
                    <input type="text" placeholder="Type a message" required="required" value={message} onChange={(e) => setMessage(e.target.value)}/>
                </div>
                <div className="boxIcon">
                    <SendIcon className="Icons margin-icon-chat" style={{ fontSize: "26px"}} onClick={sendMessage} />
                    <MicIcon className="Icons margin-icon-chat" style={{ fontSize: "26px", display: "none" }} />
                </div>
            </div>
        </div>
    );
};

export default Chats;
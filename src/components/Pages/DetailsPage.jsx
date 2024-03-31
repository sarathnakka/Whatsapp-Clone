import React, { useState } from 'react';
import './DetailsPageCss.css'
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import WhatsappLogo from "../../images/whatsapp-logo.png"
import firebase from '../../firebase-Config'
import { useParams } from 'react-router-dom';

const UseStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    }
}));
const DetailsPage = () => {
    const classes = UseStyles();
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    var imageUrl;
    const { uid } = useParams();

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }
    console.log(image)


    const login = (uid) => {
        window.location.href = `https://whatsapp-clone.web.app/${uid}`
    };
    const UploadDetails = (e) => {
        e.preventDefault();
        const uploadImageTask = firebase.storage().ref('profilePictures').child(uid).put(image);
        uploadImageTask.on(
            "state_changed",
            snapshot => { },
            error => {
                console.log(error);
            },
            () => {
                firebase.storage().ref('profilePictures')
                    .child(uid)
                    .getDownloadURL()
                    .then(url => {
                        //console.log(url)
                        imageUrl = url;
                        imageUrl = String(imageUrl);
                        console.log(imageUrl)
                        const db = firebase.firestore();
                        const user = firebase.auth().currentUser;
                        if (user) {
                            if (user.uid === uid) {
                                db.collection("Users").doc(user.uid).set({
                                    name: name,
                                    image: imageUrl,
                                    phoneNumber : user.phoneNumber
                                })
                                    .then(() => {
                                        console.log("Document successfully written!");
                                        login(user.uid);
                                    })
                                    .catch((error) => {
                                        alert("Error writing document: ", error);
                                    });
                            } else {
                                alert('Sorry No User Exist')
                                window.location.href = "https://Whatsapp-Clone.web.app/"
                            }
                        } else {
                            alert('please sign in first')
                            window.location.href = "https://Whatsapp-Clone.web.app/"
                        }
                    })
            }
        )
    }
    return (
        <>
            <div className="containerLogin">
                <img src={WhatsappLogo} className="Logo" />
                <div className="titelLogin">
                    Enter Your Details Below
                </div>
                <form className="form" onSubmit={UploadDetails}>
                    <div className="title">Profile Picture</div>
                    <div className="profilePic">
                        <div style={{ width: "120px" }}>
                            <Avatar className={classes.small} />
                            <input type="file" className="selectImage" onChange={handleChange} placeholder="Select Image" />
                        </div>
                    </div>
                    <input type="text" placeholder="Your Name" class="number" value={name} onChange={(e) => setName(e.target.value)} required="required" />
                    <button className="button" type="submit" >Next</button>
                </form>
            </div>
        </>
    );
}

export default DetailsPage;
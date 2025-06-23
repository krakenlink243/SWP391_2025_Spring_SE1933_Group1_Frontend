import axios from "axios";

function AddFriendTab() {

    const handleSendInvite = (friendId) => {
        axios.post(`https://localhost:8080/sendinvite/${friendId}`)
            .then((response) => { })
            .catch((err) => { console.log("Error sending invite: " + err) });
    }

    return (
        <div className="add-friend-tab">
            <div className="add-friend-box">
                <div className="title">
                    Add A Friend
                </div>
                <div className="user-code">

                </div>
                <div className="enter-friend-code">

                </div>
            </div>
        </div>
    );
};
export default AddFriendTab;
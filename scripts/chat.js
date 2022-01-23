class Chatroom {
  constructor(room, username) {
    this.username = username;
    this.room = room;
    this.chats = db.collection("chats");
    this.unsub;
  }
  //   add chat
  async addChat(message) {
    const now = new Date();
    const chat = {
      message: message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(now),
    };
    const response = await this.chats.add(chat);
    return response;
  }

  //   add realtime listener and get the data
  getChats(callback) {
    this.unsub = this.chats
      // query data base to retrieve only chats with specific room
      .where("room", "==", this.room)
      //   order chats based on created by
      .orderBy("created_at")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            // update UI
            callback(change.doc.data());
          }
        });
      });
  }

  // update username
  updateName(username) {
    this.username = username;
    localStorage.setItem("username", username);
  }

  // update room
  updateRoom(room) {
    this.room = room;
    if (this.unsub) {
      this.unsub();
    }
  }
}

// setTimeout(() => {
//   chatroom.updateRoom("gaming");
//   console.log("room updated");
//   chatroom.updateName("mahran");
//   chatroom.getChats((data) => {
//     console.log(data);
//   });
// }, 3000);

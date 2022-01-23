// dom queries
const chatList = document.querySelector(".chat-list");
const addChatForm = document.querySelector(".new-chat");
const updateNameForm = document.querySelector(".new-name");
const updateMsg = document.querySelector(".update-msg");
const chatRooms = document.querySelector(".chat-rooms");

// get username from localStoage if exist, if not set it to anonymous (anon)
// ternary operator
const username = localStorage.username ? localStorage.username : "anon";

// instances
const chatroom = new Chatroom("general", username);
const chatUI = new ChatUI(chatList);

// display the data on the page
chatroom.getChats((data) => {
  chatUI.render(data);
});

// add chat
addChatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = addChatForm.message.value.trim();
  chatroom.addChat(message).then(() => {
    addChatForm.reset();
  });
});

// update the name
updateNameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newName = updateNameForm.name.value.trim();
  // update name
  chatroom.updateName(newName);
  // show notification message
  updateMsg.innerText = `the name is updated to ${newName}`;
  //   reset form to cleat input field
  updateNameForm.reset();
  //   disappear the message after 3 second
  setTimeout(() => (updateMsg.innerText = ""), 3000);
});

// update chat list when clicking on one of rooms button
chatRooms.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    // clear the list
    chatUI.clear();
    // update the room
    chatroom.updateRoom(e.target.getAttribute("id"));
    // set listener to new room and retrieve the chats
    chatroom.getChats((chat) => chatUI.render(chat));
  }
});

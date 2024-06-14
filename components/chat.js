// components/chat.js

export const createChatForm = () => `
  <div class="chat-container">
    <div id="message-historique" class="message-historique"></div>
    <form id="chat-form">
      <div class="input-container">
        <input type="text" id="message-input" placeholder="Type your message here..." required>
      </div>
    </form>
  </div>
`;

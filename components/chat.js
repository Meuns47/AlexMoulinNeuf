// components/chat.js
import { createSendButton } from './sendButton.js';

export const createChatForm = () => `
  <div class="chat-container">
    <div id="message-historique" class="message-historique"></div>
    <form id="chat-form">
      <div class="input-container">
        <input type="text" id="message-input" placeholder="Type your message here..." required>
        ${createSendButton()}
        <button type="button" id="clean-button" class="clean-button">✖</button>
      </div>
    </form>
  </div>
`;

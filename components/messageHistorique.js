const saveMessagesToLocalStorage = (messages) => {
  try {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages to localStorage:', error);
  }
};

const getMessagesFromLocalStorage = () => {
  try {
    const messages = localStorage.getItem('chatMessages');
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error('Error getting messages from localStorage:', error);
    return [];
  }
};

export const addMessageToHistorique = (message, sender, bot) => {
  const messageHistorique = document.getElementById('message-historique');
  if (!messageHistorique) {
    console.error('Message historique element not found');
    return;
  }

  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(sender === 'user' ? 'user' : 'bot');

  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.innerHTML = `
    <p>${message}</p>
    <span class="timestamp">${new Date().toLocaleTimeString()}</span>
  `;

  if (bot) {
    const botImage = document.createElement('img');
    botImage.src = bot.image;
    botImage.alt = bot.displayName;
    botImage.classList.add('bot-image');
    messageElement.appendChild(botImage);
  }

  messageElement.appendChild(messageContent);
  messageHistorique.appendChild(messageElement);
  messageHistorique.scrollTop = messageHistorique.scrollHeight;

  // Save the message to localStorage
  const messages = getMessagesFromLocalStorage();
  messages.push({ message, sender, bot, timestamp: new Date().toLocaleTimeString() });
  saveMessagesToLocalStorage(messages);
};

export const loadMessagesFromLocalStorage = () => {
  const messages = getMessagesFromLocalStorage();
  if (messages.length === 0) {
    console.log('No messages in localStorage');
    return;
  }

  const messageHistorique = document.getElementById('message-historique');
  if (!messageHistorique) {
    console.error('Message historique element not found');
    return;
  }

  messages.forEach(msg => {
    const botInfo = msg.bot ? { displayName: msg.bot.displayName, image: msg.bot.image } : null;
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(msg.sender === 'user' ? 'user' : 'bot');

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.innerHTML = `
      <p>${msg.message}</p>
      <span class="timestamp">${msg.timestamp}</span>
    `;

    if (botInfo) {
      const botImage = document.createElement('img');
      botImage.src = botInfo.image;
      botImage.alt = botInfo.displayName;
      botImage.classList.add('bot-image');
      messageElement.appendChild(botImage);
    }

    messageElement.appendChild(messageContent);
    messageHistorique.appendChild(messageElement);
  });

  messageHistorique.scrollTop = messageHistorique.scrollHeight;
};

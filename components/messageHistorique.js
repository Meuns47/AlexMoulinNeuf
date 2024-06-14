export const addMessageToHistorique = (message, sender, bot) => {
  const messageHistorique = document.getElementById('message-historique');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(sender);

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
};

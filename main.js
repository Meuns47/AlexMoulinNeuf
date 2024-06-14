import { createChatForm } from './components/chat.js';
import { setupChatForm } from './api/fetchData.js';
import { createBotSelection } from './components/choixDuBot.js';

const bots = [
  { name: 'girlfriend', displayName: 'NathaGoat', image: '/images/NataliePortman.jpg' },
  { name: 'developer', displayName: 'Alex', image: '/images/AlexMoulin.jpg' },
  { name: 'ninja', displayName: 'Naruto', image: '/images/naruto.jpg' }
];

const init = () => {
  const app = document.getElementById('app');

  // Append chat form to the app container
  app.insertAdjacentHTML('beforeend', createChatForm());

  // Append bot selection to the app container
  app.insertAdjacentHTML('beforeend', createBotSelection());

  // Setup the chat form with bot data
  setupChatForm(bots);
};

document.addEventListener('DOMContentLoaded', () => {
  init();
});

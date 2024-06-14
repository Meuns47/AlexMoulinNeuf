export const setupCleanButton = () => {
    const cleanButton = document.getElementById('clean-button');
    if (!cleanButton) {
      console.error('Clean button element not found');
      return;
    }
  
    cleanButton.addEventListener('click', () => {
      localStorage.removeItem('chatMessages');
      const messageHistorique = document.getElementById('message-historique');
      if (messageHistorique) {
        messageHistorique.innerHTML = '';
      }
    });
  };
  
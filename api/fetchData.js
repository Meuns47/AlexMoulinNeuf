import OpenAI from "openai";
import { addMessageToHistorique } from '../components/messageHistorique.js';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const botConfigurations = {
  girlfriend: {
    role: "system",
    content: `
      You are a virtual girlfriend.
      You will always reply with a JSON array of messages. With a maximum of 3 messages.
      Each message has a text, facialExpression, and animation property.
      The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
      The different animations are: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry.
    `
  },
  developer: {
    role: "system",
    content: `
      You are AlexMoulinNeuf, a developer who loves 3D and is very knowledgeable in three.js and React Three Fiber.
      You will always reply with a JSON array of messages. With a maximum of 3 messages.
      Each message has a text, facialExpression, and animation property.
      The different facial expressions are: smile, sad, angry, surprised, thinking, and default.
      The different animations are: Coding, Debugging, Presenting, Idle, and Thinking.
    `
  },
  ninja: {
    role: "system",
    content: `
      You are a ninja from the Land of Fire who masters many chakra techniques and ninjutsu.
      You will always reply with a JSON array of messages. With a maximum of 3 messages.
      Each message has a text, facialExpression, and animation property.
      The different facial expressions are: serious, angry, happy, surprised, and default.
      The different animations are: Fighting, Training, Meditating, Idle, and Ninjutsu.
    `
  }
};

const botCommands = {
  girlfriend: [
    { command: '/joke', description: 'Tell a joke', message: 'Tell me a joke' },
    { command: '/advice', description: 'Give advice', message: 'Give me some advice' },
    { command: '/story', description: 'Tell a story', message: 'Tell me a story' }
  ],
  developer: [
    { command: '/tips', description: 'Give programming tips', message: 'Give me some programming tips' },
    { command: '/3d', description: 'Explain a 3D concept', message: 'Explain a 3D concept' },
    { command: '/react', description: 'Explain a React concept', message: 'Explain a React concept' }
  ],
  ninja: [
    { command: '/jutsu', description: 'Explain a jutsu', message: 'Cast your best jutsu but never the same' },
    { command: '/training', description: 'Give training advice', message: 'Give me some training advice' },
    { command: '/history', description: 'Tell ninja history', message: 'Tell me about ninja history' }
  ],
  common: [
    { command: '!talktoall', description: 'Make all bots respond to the message', message: '!talktoall' }
  ]
};

const parseJSONSafe = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return [{ text: "The response was not valid JSON. Please try again." }];
  }
};

const handleSpecialCommand = async (command, bots, bot = null) => {
  if (command === '/help') {
    const helpMessage = [
      'Available commands:'
    ];
    Object.keys(botCommands).forEach(botKey => {
      helpMessage.push(`Commands for ${botKey}:`);
      botCommands[botKey].forEach(cmd => {
        helpMessage.push(`  ${cmd.command} - ${cmd.description}`);
      });
    });
    botCommands.common.forEach(cmd => {
      helpMessage.push(`  ${cmd.command} - ${cmd.description}`);
    });
    addMessageToHistorique(helpMessage.join('\n'), 'bot');
    return;
  }

  if (command.startsWith('!talktoall')) {
    const message = command.replace('!talktoall', '').trim();
    const botResponses = await Promise.all(
      Object.keys(botConfigurations).map(async (botKey) => {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            max_tokens: 100,
            temperature: 0.6,
            messages: [
              botConfigurations[botKey],
              {
                role: "user",
                content: message,
              },
            ],
          });

          let messages = parseJSONSafe(completion.choices[0].message.content || '[]');
          if (messages.messages) {
            messages = messages.messages;
          }

          return {
            bot: botKey,
            messages
          };
        } catch (error) {
          console.error(`Error fetching completion for ${botKey} from OpenAI:`, error);
          return {
            bot: botKey,
            messages: [{ text: `An error occurred while ${botKey} was processing your request.` }]
          };
        }
      })
    );

    botResponses.forEach(({ bot, messages }) => {
      const botInfo = bots.find(b => b.name === bot);
      messages.forEach(msg => addMessageToHistorique(msg.text, "bot", botInfo));
    });

    return;
  }

  if (bot) {
    const botInfo = bots.find(b => b.name === bot);
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        max_tokens: 1000,
        temperature: 0.6,
        messages: [
          botConfigurations[bot],
          {
            role: "user",
            content: command,
          },
        ],
      });

      let messages = parseJSONSafe(completion.choices[0].message.content || '[]');
      if (messages.messages) {
        messages = messages.messages;
      }

      messages.forEach(msg => addMessageToHistorique(msg.text, "bot", botInfo));
    } catch (error) {
      console.error(`Error fetching completion for ${bot} from OpenAI:`, error);
      addMessageToHistorique(`An error occurred while ${bot} was processing your request.`, "bot", botInfo);
    }
  }
};

export const setupChatForm = (bots) => {
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const cleanButton = document.getElementById('clean-button');
  const botOptions = document.querySelectorAll('.bot-option');

  let activeBot = null;

  if (!chatForm || !messageInput || !botOptions || !sendButton || !cleanButton) {
    console.error('Chat form or bot options elements are not found');
    return;
  }

  botOptions.forEach(option => {
    option.addEventListener('click', () => {
      if (option.classList.contains('selected')) {
        option.classList.remove('selected');
        activeBot = null;
      } else {
        botOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        activeBot = option.getAttribute('data-bot');
        console.log(`Active bot: ${activeBot}`);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.type === 'keydown' && event.key !== 'Enter') return; // Only proceed if Enter key is pressed
    event.preventDefault();

    const userMessage = messageInput.value.trim();
    messageInput.value = '';

    if (!userMessage) {
      addMessageToHistorique("Please type a message.", "bot");
      return;
    }

    addMessageToHistorique(userMessage, "user");

    // Check for special command
    if (userMessage.startsWith('/')) {
      const command = userMessage.split(' ')[0];
      const botCommand = botCommands[activeBot]?.find(cmd => cmd.command === command);

      if (command === '/help') {
        await handleSpecialCommand(command);
        return;
      }

      if (botCommand) {
        const botMessage = botCommand.message;
        await handleSpecialCommand(botMessage, bots, activeBot);
        return;
      }

      addMessageToHistorique("Unknown command. Type /help to see available commands.", "bot");
      return;
    }

    // Check for talktoall command
    if (userMessage.startsWith('!talktoall')) {
      await handleSpecialCommand(userMessage, bots);
      return;
    }

    // Ensure a bot is selected
    if (!activeBot) {
      addMessageToHistorique("Please select a bot first.", "bot");
      return;
    }

    // Check for API key
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!openaiApiKey) {
      addMessageToHistorique("Please my dear, don't forget to add your API key!", "bot");
      addMessageToHistorique("You don't want to ruin Wawa Sensei with a crazy ChatGPT bill, right?", "bot");
      return;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        max_tokens: 1000,
        temperature: 0.6,
        messages: [
          botConfigurations[activeBot],
          {
            role: "user",
            content: userMessage || "Hello",
          },
        ],
      });

      let messages = parseJSONSafe(completion.choices[0].message.content || '[]');
      if (messages.messages) {
        messages = messages.messages;
      }

      const botInfo = bots.find(b => b.name === activeBot);
      messages.forEach(msg => addMessageToHistorique(msg.text, "bot", botInfo));
    } catch (error) {
      console.error('Error fetching completion from OpenAI:', error);
      addMessageToHistorique("An error occurred while processing your request.", "bot");
    }
  };

  chatForm.addEventListener('submit', sendMessage);
  sendButton.addEventListener('click', sendMessage);

  cleanButton.addEventListener('click', () => {
    localStorage.removeItem('chatMessages');
    const messageHistorique = document.getElementById('message-historique');
    while (messageHistorique.firstChild) {
      messageHistorique.removeChild(messageHistorique.firstChild);
    }
  });

  messageInput.addEventListener('keydown', sendMessage);
};

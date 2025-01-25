// Initialize syntax highlighting
document.addEventListener('DOMContentLoaded', () => {
  Prism.highlightAll();
  setupEventListeners();
});

function setupEventListeners() {
  const tryButtons = document.querySelectorAll('.try-it');
  tryButtons.forEach(button => {
    button.addEventListener('click', () => handleTryIt(button.dataset.example));
  });

  document.getElementById('sendRequest').addEventListener('click', handleCustomRequest);
}

async function handleTryIt(example) {
  const resultElement = document.getElementById(`${example}Result`);
  resultElement.style.display = 'block';
  resultElement.innerHTML = 'Loading...';

  try {
    let response;
    switch (example) {
      case 'basic':
        response = await makeBasicRequest();
        break;
      case 'structured':
        response = await makeStructuredRequest();
        break;
      case 'chat':
        response = await makeChatRequest();
        break;
    }
    
    resultElement.innerHTML = `<pre>${JSON.stringify(response, null, 2)}</pre>`;
  } catch (error) {
    resultElement.innerHTML = `Error: ${error.message}`;
  }
}

async function makeBasicRequest() {
  return await fetch('/api/ai_completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      prompt: 'Generate a short creative story.',
      data: ''
    })
  }).then(res => res.json());
}

async function makeStructuredRequest() {
  return await fetch('/api/ai_completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Generate a short story with tags.
      
      <typescript-interface>
      interface Response {
        title: string;
        content: string;
        tags: string[];
      }
      </typescript-interface>
      
      <example>
      {
        "title": "The Red Door",
        "content": "A mysterious door appeared...",
        "tags": ["mystery", "supernatural", "short"]
      }
      </example>`,
      data: ''
    })
  }).then(res => res.json());
}

async function makeChatRequest() {
  const messages = [
    { role: 'user', content: 'Hello! Can you help me understand how to use the API?' }
  ];
  
  return await fetch('/api/ai_completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Respond as a helpful assistant.
      
      <typescript-interface>
      interface Response {
        message: string;
        sentiment: "positive" | "neutral" | "negative";
      }
      </typescript-interface>
      
      <example>
      {
        "message": "I'd be happy to help you with that!",
        "sentiment": "positive"
      }
      </example>`,
      data: messages
    })
  }).then(res => res.json());
}

async function handleCustomRequest() {
  const promptInput = document.getElementById('promptInput').value;
  const dataInput = document.getElementById('dataInput').value;
  const responseOutput = document.getElementById('responseOutput');

  responseOutput.textContent = 'Loading...';

  try {
    const response = await fetch('/api/ai_completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        prompt: promptInput,
        data: dataInput || ''
      })
    });

    const data = await response.json();
    responseOutput.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    responseOutput.textContent = `Error: ${error.message}`;
  }
}
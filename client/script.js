// Function to send user message and display response
async function sendMessage() {
    // Get user input
    const userInput = document.getElementById("user-input").value;
  
    // Display user message in the chatbox
    displayMessage("You", userInput);
  
    try {
      // Send request to server-side endpoint
      const response = await fetch('https://serverbot-7nla.onrender.com/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userInput })
      });
  
      // Parse response and display bot response
      const data = await response.json();
      const botResponse = data.response;
      displayMessage("Chatbot", botResponse);
    } catch (error) {
      console.error('Error:', error);
      // Handle error gracefully (e.g., display error message to user)
    }
  
    // Clear user input field
    document.getElementById("user-input").value = "";
  }
  
  // Function to display messages in the chatbox (unchanged)
  function displayMessage(sender, message) {
    var chatbox = document.getElementById("chatbox");
    chatbox.innerHTML += "<p><strong>" + sender + ":</strong> " + message + "</p>";
    // Scroll to bottom of chatbox
    chatbox.scrollTop = chatbox.scrollHeight;
  }
  
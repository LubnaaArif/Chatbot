export default {
  async fetch(request, env) {

    // Handle AI Chat Request
    if (request.method === "POST") {

      const body = await request.json();

      const userMessage = body.message;

      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant."
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        }
      );

      return Response.json({
        reply: aiResponse.response
      });
    }

    // Frontend HTML
    return new Response(html, {
      headers: {
        "content-type": "text/html"
      }
    });
  }
};

const html = `
<!DOCTYPE html>
<html>

<head>
  <title>Lubna AI Chatbot</title>

  <style>

    body{
      margin:0;
      font-family:Arial;
      background:#0f172a;
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
      color:white;
    }

    .container{
      width:400px;
      background:#1e293b;
      padding:20px;
      border-radius:15px;
      box-shadow:0 0 20px rgba(0,0,0,0.4);
    }

    h2{
      text-align:center;
    }

    #chat{
      height:350px;
      overflow-y:auto;
      background:#334155;
      padding:10px;
      border-radius:10px;
      margin-bottom:10px;
    }

    .message{
      margin:10px 0;
      padding:10px;
      border-radius:10px;
    }

    .user{
      background:#2563eb;
    }

    .bot{
      background:#475569;
    }

    .typing{
      opacity:0.7;
      font-style:italic;
    }

    .bottom{
      display:flex;
      gap:10px;
    }

    input{
      flex:1;
      padding:10px;
      border:none;
      border-radius:10px;
      outline:none;
    }

    button{
      padding:10px 20px;
      border:none;
      border-radius:10px;
      background:#2563eb;
      color:white;
      cursor:pointer;
    }

    button:hover{
      background:#1d4ed8;
    }

  </style>
</head>

<body>

<div class="container">

  <h2>Lubna AI Chatbot</h2>

  <div id="chat"></div>

  <div class="bottom">
    <input
      type="text"
      id="input"
      placeholder="Ask anything..."
    />

    <button onclick="sendMessage()">
      Send
    </button>
  </div>

</div>

<script>

async function sendMessage(){

  const input = document.getElementById("input");

  const text = input.value;

  if(!text) return;

  const chat = document.getElementById("chat");

  // User Message
  chat.innerHTML +=
  '<div class="message user">'+text+'</div>';

  input.value = "";

  // Typing Effect
  const typingId = "typing-" + Date.now();

  chat.innerHTML +=
  '<div class="message bot typing" id="'+typingId+'">AI is typing...</div>';

  chat.scrollTop = chat.scrollHeight;

  // Send Request
  const response = await fetch("/",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      message:text
    })
  });

  const data = await response.json();

  // Remove Typing
  document.getElementById(typingId).remove();

  // Bot Message
  chat.innerHTML +=
  '<div class="message bot">'+data.reply+'</div>';

  chat.scrollTop = chat.scrollHeight;
}

// Enter Key Support
document
.getElementById("input")
.addEventListener("keypress", function(e){

  if(e.key === "Enter"){
    sendMessage();
  }

});

</script>

</body>
</html>
`;

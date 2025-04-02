const WebSocket = require("ws");

const PORT = 4000; // Updated to match frontend WebSocket URL
const wss = new WebSocket.Server({ port: PORT });

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("New client connected");
  clients.add(ws);

  ws.on("message", (message) => {
    console.log("Received:", message);

    // Broadcast the message to all connected clients
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

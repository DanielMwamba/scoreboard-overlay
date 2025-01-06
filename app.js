// wss://scoreboard-t4k5.onrender.com
// ws://localhost:8080

// Configuration WebSocket
const WS_URL = "wss://lotto-r7aq.onrender.com/";
let currentData = {
  teamAName: "",
  teamBName: "",
  teamAScore: 0,
  teamBScore: 0,
  gameTimer: "",
  period: "",
  shotClock: "",
};

// Initialisation de la connexion WebSocket
function initializeWebSocket() {
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => console.log("Overlay WebSocket connecté");

  ws.onmessage = async (event) => {
    try {
      const data = await parseWebSocketMessage(event);
      if (data) {
        updateOverlayWithMerge(data);
      }
    } catch (error) {
      console.error("Erreur lors du traitement du message WebSocket:", error);
    }
  };

  ws.onclose = () => {
    console.warn("WebSocket déconnecté. Reconnexion dans 3 secondes...");
    setTimeout(initializeWebSocket, 3000); // Réessai après 3 secondes
  };

  ws.onerror = (error) => {
    console.error("Erreur WebSocket:", error);
  };
}

// Traite et fusionne les nouvelles données reçues
function updateOverlayWithMerge(newData) {
  currentData = { ...currentData, ...newData }; // Fusion des nouvelles données
  updateOverlay(currentData); // Mise à jour de l'overlay
}

// Met à jour les éléments DOM de l'overlay
function updateOverlay(data) {
  const fields = {
    "#teamA .team-name": data.teamAName,
    "#teamB .team-name": data.teamBName,
    "#teamA .score": data.teamAScore,
    "#teamB .score": data.teamBScore,
    "#timer": data.gameTimer,
    "#shotClock": data.shotClock,
    "#period": formatPeriod(data.period),
  };

  for (const [selector, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = value;
      } else {
        console.warn(`Élément introuvable pour le sélecteur: ${selector}`);
      }
    }
  }
}

// Formate la période pour l'affichage
function formatPeriod(period) {
  switch (period) {
    case "OT":
      return "Overtime";
    case 1:
      return "1st Quarter";
    case 2:
      return "2nd Quarter";
    case 3:
      return "3rd Quarter";
    default:
      return `${period}th Quarter`;
  }
}

// Analyse les messages WebSocket, y compris les Blobs
async function parseWebSocketMessage(event) {
  if (event.data instanceof Blob) {
    try {
      const text = await event.data.text();
      return JSON.parse(text);
    } catch (error) {
      console.error("Erreur lors de l'analyse du Blob:", error);
      return null;
    }
  }

  try {
    return JSON.parse(event.data);
  } catch (error) {
    console.error("Erreur lors de l'analyse des données JSON:", error);
    return null;
  }
}

// Lancement de l'application
initializeWebSocket();

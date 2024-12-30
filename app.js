// Stocker l'état actuel des données
// wss://lotto-r7aq.onrender.com/
// ws://localhost:8080
let currentData = {
  teamAName: "",
  teamBName: "",
  teamAScore: 0,
  teamBScore: 0,
  gameTimer: "",
  period: "",
  shotClock: "",
};

function initializeWebSocket() {
  const ws = new WebSocket("wss://lotto-r7aq.onrender.com/");

  ws.onopen = () => {
    console.log("Overlay WebSocket connected");
  };

  ws.onmessage = async (event) => {
    try {
      let data;
      if (event.data instanceof Blob) {
        data = await parseBlob(event.data);
      } else {
        data = JSON.parse(event.data);
      }

      if (data) {
        updateOverlayWithMerge(data); // Appel avec fusion des données
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  };

  ws.onclose = () => {
    console.warn("Overlay WebSocket disconnected. Attempting to reconnect...");
    setTimeout(initializeWebSocket, 3000); // Réessayer après 5 secondes
  };

  ws.onerror = (error) => {
    console.error("WebSocket encountered an error:", error);
  };
}

// Fusionner les nouvelles données avec les précédentes
function updateOverlayWithMerge(newData) {
  currentData = { ...currentData, ...newData }; // Fusion des anciennes et nouvelles données
  updateOverlay(currentData); // Mise à jour de l'overlay avec les données complètes
}

// Mise à jour de l'interface utilisateur
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
      }
    }
  }
}

// Formater la période
function formatPeriod(period) {
  if (period === "OT") {
    return "Overtime";
  }
  if (period === 1) {
    return `${period}st Quarter`;
  }
  if (period === 2) {
    return `${period}nd Quarter`;
  }
  return `${period}th Quarter`;
}

// Fonction pour analyser un Blob
async function parseBlob(blob) {
  try {
    const text = await blob.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing Blob data:", error);
    return null;
  }
}

// Initialiser la connexion WebSocket
initializeWebSocket();

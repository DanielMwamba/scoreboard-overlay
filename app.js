const ws = new WebSocket("wss://lotto-r7aq.onrender.com/");

ws.onopen = () => {
  console.log("Overlay WebSocket connected");
};

ws.onmessage = (event) => {
  try {
    let data;
    if (event.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = function () {
        data = JSON.parse(reader.result);
        updateOverlay(data);
      };
      reader.readAsText(event.data);
    } else {
      data = JSON.parse(event.data);
      updateOverlay(data);
    }
  } catch (error) {
    console.error("Error processing WebSocket message:", error);
  }
};

ws.onclose = () => {
  console.log("Overlay WebSocket disconnected");
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

function updateOverlay(data) {
  if (data.teamAName !== undefined) {
    document.querySelector("#teamA .team-name").textContent = data.teamAName;
  }
  if (data.teamBName !== undefined) {
    document.querySelector("#teamB .team-name").textContent = data.teamBName;
  }
  if (data.teamAScore !== undefined) {
    document.querySelector("#teamA .score").textContent = data.teamAScore;
  }
  if (data.teamBScore !== undefined) {
    document.querySelector("#teamB .score").textContent = data.teamBScore;
  }
  if (data.gameTimer !== undefined) {
    document.getElementById("timer").textContent = data.gameTimer;
  }
  if (data.period !== undefined) {
    document.getElementById("period").textContent =
      data.period === "OT" ? "Overtime" : `${data.period} Quarter`;
  }
  if (data.shotClock !== undefined) {
    document.getElementById("shotClock").textContent = data.shotClock;
  }
}

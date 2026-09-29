const BASE_URL = "http://localhost:5000";

async function summarize() {
  const text = document.getElementById("inputText").value.trim();
  const method = document.getElementById("method").value;
  const numSentences = parseInt(document.getElementById("numSentences").value);

  const errorEl = document.getElementById("errorMsg");
  const loader = document.getElementById("loader");
  const resultCard = document.getElementById("resultCard");

  errorEl.textContent = "";
  resultCard.style.display = "none";

  if (!text) {
    errorEl.textContent = "⚠️ Please enter some text first.";
    return;
  }

  loader.style.display = "block";

  const endpoint = method === "extractive"
    ? `${BASE_URL}/summarize/extractive`
    : `${BASE_URL}/summarize/abstractive`;

  const body = method === "extractive"
    ? { text, num_sentences: numSentences }
    : { text };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    loader.style.display = "none";

    if (data.error) {
      errorEl.textContent = `Error: ${data.error}`;
      return;
    }

    document.getElementById("summaryOutput").textContent = data.summary;
    document.getElementById("methodBadge").textContent =
      method === "extractive" ? "✂️ Extractive (TF-IDF + spaCy)" : "🤖 Abstractive (BART)";

    resultCard.style.display = "block";

  } catch (err) {
    loader.style.display = "none";
    errorEl.textContent = "❌ Cannot connect to backend. Make sure Flask is running on port 5000.";
  }
}

async function analyzeNote() {
  const text = document.getElementById("inputText").value.trim();

  const errorEl = document.getElementById("errorMsg");
  const loader = document.getElementById("loader");
  const entitiesCard = document.getElementById("entitiesCard");

  errorEl.textContent = "";
  entitiesCard.style.display = "none";

  if (!text) {
    errorEl.textContent = "⚠️ Please enter some text first.";
    return;
  }

  loader.style.display = "block";

  try {
    const response = await fetch(`${BASE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    loader.style.display = "none";

    if (data.error) {
      errorEl.textContent = `Error: ${data.error}`;
      return;
    }

    const entities = data.entities || {};
    const noteType = data.note_type || "-";

    const symptoms = entities.Symptom || [];
    const medications = entities.Medication || [];

    document.getElementById("noteTypeOutput").textContent = noteType;
    document.getElementById("symptomsOutput").textContent = symptoms.length ? symptoms.join(", ") : "-";
    document.getElementById("medicationsOutput").textContent = medications.length ? medications.join(", ") : "-";
    document.getElementById("analysisOutput").textContent = data.output || "";

    entitiesCard.style.display = "block";

  } catch (err) {
    loader.style.display = "none";
    errorEl.textContent = "❌ Cannot connect to backend. Make sure Flask is running on port 5000.";
  }
}

function copyToClipboard() {
  const summary = document.getElementById("summaryOutput").textContent;
  navigator.clipboard.writeText(summary).then(() => {
    alert("Summary copied to clipboard!");
  });
}

function saveSummary() {
  const summary = document.getElementById("summaryOutput").textContent;
  const blob = new Blob([summary], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "summary.txt";
  a.click();
  URL.revokeObjectURL(url);
}

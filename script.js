const summarizeBtn = document.getElementById("summarizeBtn");
const copyBtn = document.getElementById("copyBtn");
const inputText = document.getElementById("inputText");
const summaryText = document.getElementById("summaryText");

const originalCount = document.getElementById("originalCount");
const summaryCount = document.getElementById("summaryCount");

// Paste your Groq API key here
const API_KEY = "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";

// Count original words
inputText.addEventListener("input", () => {

  const words = inputText.value
    .trim()
    .split(/\s+/)
    .filter(word => word);

  originalCount.textContent = words.length;

});

// Summarize
summarizeBtn.addEventListener("click", async () => {

  const text = inputText.value.trim();

  if (!text) {
    alert("Please enter some text!");
    return;
  }

  summaryText.textContent = "Summarizing...";

  try {

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },

        body: JSON.stringify({
          model: "llama-3.1-8b-instant",

          messages: [
            {
              role: "system",
              content: "You summarize text."
            },
            {
              role: "user",
              content: `Summarize this text:\n\n${text}`
            }
          ],

          temperature: 0.3,
          max_tokens: 200
        })

      }
    );

    // Convert response
    const data = await response.json();

    console.log(data);

    // Check for API errors
    if (data.error) {

      summaryText.textContent =
        "API Error: " + data.error.message;

      return;
    }

    // Get summary
    const summary =
      data.choices[0].message.content;

    summaryText.textContent = summary;

    // Count summary words
    const summaryWords = summary
      .trim()
      .split(/\s+/)
      .filter(word => word);

    summaryCount.textContent =
      summaryWords.length;

  }

  catch (error) {

    console.error(error);

    summaryText.textContent =
      "Something went wrong.";

  }

});

// Copy summary
copyBtn.addEventListener("click", () => {

  navigator.clipboard.writeText(
    summaryText.textContent
  );

  alert("Summary copied!");

});
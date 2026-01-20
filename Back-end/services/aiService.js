const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeGrievance = async (description, subject) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Analyze the following grievance complaint and provide a structured JSON response.
        
        Complaint Subject: ${subject}
        Complaint Description: ${description}

        Return ONLY a JSON object with the following fields:
        - summary: A concise 1-sentence summary of the issue.
        - department: The most appropriate department (e.g., Roads, Sanitation, Electrical, Water Supply, Police, Health).
        - priority: "High", "Medium", or "Low" based on urgency and severity.
        - sentiment: "Negative", "Neutral", or "Positive".
        - category: A short 1-2 word category (e.g., "Pothole", "Garbage", "Street Light").

        Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim(); // Clean up text

        // Naive JSON cleaning if model adds backticks
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        // Fallback if AI fails
        return {
            summary: "Analysis failed",
            department: "General",
            priority: "Medium",
            sentiment: "Neutral",
            category: "Uncategorized"
        };
    }
};

module.exports = { analyzeGrievance };

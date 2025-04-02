const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Load the JSON file
const filePath = path.join(__dirname, "data", "colleges.json");
let colleges = [];

try {
    colleges = JSON.parse(fs.readFileSync(filePath, "utf8"));
} catch (error) {
    console.error("Error reading JSON file:", error);
}

// API Endpoint to predict colleges
app.post("/predict", (req, res) => {
    const { percentile, rank, caste, branch, location } = req.body;

    if (!percentile && !rank) {
        return res.status(400).json({ error: "Please provide either percentile or rank." });
    }

    const matchingColleges = colleges.filter(college =>
        (!percentile || college.percentile <= percentile) &&
        (!rank || college.rank >= rank) &&
        (!caste || college.caste === caste) &&
        (!branch || college.branch === branch) &&
        (!location || college.location.includes(location))
    );

    res.json(matchingColleges.length ? matchingColleges : { message: "No matching colleges found." });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🔥 Server running on http://localhost:${PORT}`));

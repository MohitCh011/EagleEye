const { spawn } = require("child_process");

const runMLModel = (mode, inputData) => {
    return new Promise((resolve, reject) => {
        const scriptPath = mode === "analysis"
            ? `mlModels/Road construction/analysis/model.py`
            : `mlModels/Road construction/comparsion/model.py`;

        const args = mode === "analysis"
            ? [inputData] // Input image URL
            : [inputData.previousImageUrl,inputData.currentImageUrl ]; // Comparison

        console.log(`Running Python script: ${scriptPath} with args: ${args.join(", ")}`);
        const process = spawn("python3", [scriptPath, ...args]);

        let result = "";
        let errorOutput = "";

        // Collect standard output
        process.stdout.on("data", (data) => {
            result += data.toString();
        });

        // Collect error output
        process.stderr.on("data", (data) => {
            errorOutput += data.toString();
            console.error(`Python Error Output: ${data}`); // Log Python stderr
        });

        // Handle process exit
        process.on("close", (code) => {
            console.log(`Python scrist exited with code ${code}`); // Log exit code
            console.log(`Raw Python Output: ${result.trim()}`); // Log stdout

            if (code === 0) {
                try {
                    // Extract the JSON part from the output
                    const jsonMatch = result.match(/{.*}/s); // Matches the JSON object
                    if (jsonMatch) {
                        const jsonOutput = JSON.parse(jsonMatch[0]); // Parse the extracted JSON
                        console.log(`Extracted JSON Output: ${JSON.stringify(jsonOutput)}`);
                        resolve(jsonOutput);
                    } else {
                        reject(new Error(`No valid JSON found in Python output: ${result}`));
                    }
                } catch (err) {
                    console.error(`JSON Parsing Error: ${err.message}`);
                    reject(new Error(`Invalid JSON output: ${result.trim()}`));
                }
            } else {
                reject(new Error(errorOutput || "Python script execution failed"));
            }
        });
    });
};

module.exports = runMLModel;

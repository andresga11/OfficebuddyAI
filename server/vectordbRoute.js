import { Pinecone } from "@pinecone-database/pinecone";
import fetch from "node-fetch";
import express from "express";
import axios from "axios";
import OpenAI from "openai";
import mysql from "mysql";
const router = express.Router();
const OPENAI_API_KEY = "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";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// const fetch = import("node-fetch");

// const OPENAI_API_KEY = "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";
const PINECONE_API_KEY = "87df2844-e9e2-4bdf-be3b-9a5b2d88620d";
const PINECONE_INDEX_NAME = "queries-and-schemas-index";

// Placeholder for Pinecone client setup
// Initialize Pinecone client (example uses hypothetical SDK)
const pc = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

const index = pc.index(PINECONE_INDEX_NAME);

async function embedText(text) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-ada-002",
      input: text,
    }),
  });
  const data = await response.json();
  return data.data[0].embedding;
}

async function findSimilarQueriesAndSchemas(inputText, topK = 5) {
  const embedding = await embedText(inputText);

  const queryResults = await index.namespace("queries").query({
    vector: embedding,
    topK: topK,
    includeMetadata: true,
  });

  const schemaResults = await index.namespace("schemas").query({
    vector: embedding,
    topK: topK,
    includeMetadata: true,
  });

  const similarQueries = queryResults.matches.filter((result) =>
    result.id.startsWith("query_")
  );
  const similarSchemas = schemaResults.matches.filter((result) =>
    result.id.startsWith("schema_")
  );

  return { similarQueries, similarSchemas };
}

// async function main() {
//   const newInputText =
//     "List employees who are managers and their current department";
//   const { similarQueries, similarSchemas } = await findSimilarQueriesAndSchemas(
//     newInputText
//   );

//   console.log("Similar Queries:");
//   similarQueries.forEach((query) => {
//     console.log(query.id, query.metadata);
//   });

//   console.log("\nSimilar Schemas:");
//   similarSchemas.forEach((schema) => {
//     console.log(schema.id, schema.metadata);
//   });
// }

// async function fetchChatGPTResponse(prompt) {
//   const url = "https://api.openai.com/v1/chat/completions";

//   try {
//     const response = await axios.post(
//       url,
//       {
//         model: "gpt-4", // Specify the model
//         messages: [{ role: "assistant", content: prompt }],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching response:", error);
//   }
// }

async function fetchChatGPTResponse(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "assistant",
        content: prompt,
      },
    ],
    model: "gpt-4",
  });

  // Make sure to access the response correctly based on the API documentation
  if (completion && completion.choices && completion.choices.length > 0) {
    return completion.choices[0].message.content;
  } else {
    console.error("No valid response received");
    return null; // Handle cases where no response is received
  }
}


// async function getData(query) {

//   var data = "";

//   const connection = mysql.createConnection({
//     host: "localhost", 
//     user: "user1",
//     password: "password123",
//     database: "employees",
//     });
  
//     // Connect to the database
//     connection.connect((err) => {
//     if (err) {
//       return console.error("error connecting: " + err.stack);
//     }
//     console.log("connected as id " + connection.threadId);
//     });
  
//   // Perform queries
//     connection.query(query, (err, results, fields) => {
//     if (err) throw err;
  
//     data = results;

//     });

//     // Close the connection
//     connection.end();


//   return data;
// }


// Async function to get data from the database
async function getData(query) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'user1',
      password: 'password123',
      database: 'employees',
    });

    connection.connect(err => {
      if (err) {
        console.error('Error connecting: ' + err.stack);
        reject(err);
        return;
      }
      console.log('Connected as ID ' + connection.threadId);
    });

    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
      connection.end();
    });
  });
}


router.post("/get_data", async (req, res) => {
  const newInputText = req.body.input;
  const { similarQueries, similarSchemas } = await findSimilarQueriesAndSchemas(
    newInputText
  );

  // console.log("Similar Queries:");
  // similarQueries.forEach((query) => {
  //   console.log(query.id, query.metadata);
  // });

  let queries = "Similar Queries:\n"; // Start with a heading and a newline
  let schemas = "Relevant Schemas:\n";

  similarQueries.forEach((query) => {
    // Append each query's metadata text to the result string, with each entry on a new line
    queries += `ID: ${query.id}\nText: ${query.metadata.text}\n\n`;
  });

  similarSchemas.forEach((query) => {
    // Append each query's metadata text to the result string, with each entry on a new line
    schemas += `ID: ${query.id}\nText: ${query.metadata.text}\n\n`;
  });

  // Now `resultString` contains the entire formatted output as a string
  // This can be logged to console, sent back to the client, or used elsewhere
  // console.log(resultString); // Optional: log the result string to check its contents

  let prompt = `
Background: I need to generate an SQL statement, for a mysql server, to address the following query in a database. The database schema and contextually relevant SQL examples are provided to help generate the accurate SQL statement. It is very important you ONLY respond with the Generated SQL Statement throughtout all of our conversation. 
\nUser Query: ${newInputText}.\n
${queries}\n
${schemas}
`;

  const gptResponse = await fetchChatGPTResponse(prompt);
console.log(gptResponse);
  // Running the getData function with a sample query
  getData(gptResponse)
    .then(data => {
      return res.json({ status: "ok", bot: data });
    })
    .catch(err => {
      console.error('Error fetching data:', err);
    });

});

export default router;



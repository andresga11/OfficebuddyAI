import { Pinecone } from "@pinecone-database/pinecone";
import fetch from "node-fetch";
import express from "express";
import axios from "axios";
import OpenAI from "openai";
import mysql from "mysql";
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

const OPENAI_API_KEY = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });


const PINECONE_API_KEY = process.env.PINECONE_AI_KEY
const PINECONE_INDEX_NAME = "queries-and-schemas-index";

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

  return { similarQueries, similarSchemas, embedding };
}


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

  if (completion && completion.choices && completion.choices.length > 0) {
    return completion.choices[0].message.content;
  } else {
    console.error("No valid response received");
    return null; 
  }
}



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

  try {
    const { similarQueries, similarSchemas, embedding } = await findSimilarQueriesAndSchemas(
      newInputText
    );


    let queries = "Similar Queries:\n"; // Start with a heading and a newline
    let schemas = "Relevant Schemas:\n";

    similarQueries.forEach((query) => {
      // Append each query's metadata text to the result string, with each entry on a new line
      queries += `ID: ${query.id}\nText: ${query.metadata.text} \nSql: ${query.metadata.sql}\n\n`;
    });

    similarSchemas.forEach((query) => {
      // Append each query's metadata text to the result string, with each entry on a new line
      schemas += `ID: ${query.id}\nText: ${query.metadata.text}\n\n`;
    });


    let prompt = `
  Background: I need to generate an SQL statement, for a mysql server, to address the following query in a database. The database schema and contextually relevant SQL examples are provided to help generate the accurate SQL statement. It is very important you ONLY respond with the Generated SQL Statement throughtout all of our conversation. 
  \nUser Query: ${newInputText}.\n
  ${queries}\n
  ${schemas}
  `;    

    const sqlStatement = await fetchChatGPTResponse(prompt);

    const data = await getData(sqlStatement);
    res.json({ status: "ok", bot: data, sql: sqlStatement, embedding: embedding });

    // After displaying data, you might handle user feedback here or on client-side
    // Assuming you have an endpoint or method to receive user confirmation

  } catch (error) {
      console.error('Error fetching data or processing request:', error);
      res.status(500).json({ status: "error", message: "Sorry, can you try again?" });
  }

});


// Endpoint to handle user feedback and store data in VectorDB
router.post("/feedback", async (req, res) => {
  const { userInput, sqlStatement, feedback, embedding } = req.body;

  if (feedback.toLowerCase() === "yes") {
    // Corrected the filter to use the value of userInput
    const response = await index.namespace("queries").query({
      vector: embedding,
      topK: 5, // Adjust according to your needs
      filter: {
        "text": { "$eq": userInput } // Use the value of userInput variable
      }
    });

    // Check if the response is empty or undefined based on your database's response structure
    if (response.matches.length === 0) {
      // Store in VectorDB
      const metadata = { sql: sqlStatement, text: userInput };
      await index.namespace("queries").upsert([
        {
          id: `query_${new Date().toISOString()}`, // Unique ID for the query
          values: await embedText(userInput), // Assuming embedText is defined elsewhere
          metadata: metadata
        },
      ]);
      res.json({ status: "ok", message: "Data stored successfully!" });
    } else {
      res.json({ status: "ok", message: "Feedback noted, no data stored!" });
    }
  } else {
    res.json({ status: "ok", message: "Feedback noted, no data stored." });
  }
});

export default router;



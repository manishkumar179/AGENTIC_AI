/*
import {ChatMistralAI} from '@langchain/mistralai'

import dotenv from 'dotenv'
dotenv.config()

const model =new ChatMistralAI({
    model:"mistral-medium-latest",
    apiKey:process.env.MISTRAL_API_KEY,
})

// const response = await model.invoke("What is the capital of India?");
const stream = await model.stream("What is the capital of India?")

// console.log(response.text)

for await (const chunk of stream){
    process.stdout.write(chunk.text)
}

*/

// To remember my last question what i asked form my AI,
// we have to send all the last chat to LLM with new chat

// Langchain ka kaam hai tool ko cal karna and LLM ko same message ko wapas feed krna

import dotenv from "dotenv";
dotenv.config();
import rl from "readline/promises";
import { ChatMistralAI } from "@langchain/mistralai";
import { chunkArray } from "@langchain/core/utils/chunk_array";
import * as z from 'zod' 

import { HumanMessage, AIMessage } from "langchain";


const readline = rl.createInterface({
    input:process.stdin,
    output:process.stdout
})


const model = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const message = []

while (true) {

  const prompt = await readline.question("Enter your prompt:- ");
  message.push(new HumanMessage(prompt))
  const stream = await model.stream(message);

  let responseText = ""

  for await (const chunks of stream) {
    process.stdout.write(chunks.text);

    responseText += chunks.text

  }

  message.push(new AIMessage(responseText))

   process.stdout.write("\n\n");
}

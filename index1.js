import { ChatMistralAI } from "@langchain/mistralai";
import dotenv from "dotenv";
import { read } from "fs";
import { createAgent, HumanMessage, tool, ToolMessage } from "langchain";
import { stdin } from "process";
dotenv.config()
import rl from 'readline/promises'
import * as z from 'zod'
import fs from 'fs/promises'

/*

const readline= rl.createInterface({
    input:process.stdin,
    output:process.stdout
})

const model = new ChatMistralAI({
    model:"mistral-medium-latest",
    apiKey:process.env.MISTRAL_API_KEY
})

function getWeather({city}){
    return `The weather in ${city} is sunny with high of 25 `
}

const getWeatherTool = tool(
    getWeather,
    {
        name: "getWeather",
        description:"Get the weather update of city. ",
        schema:z.string().describe("I want to know thw weather of bhopal")
    }
)

const agent = createAgent({
    model,
    tools:[getWeatherTool]
})


const messages = []

while(true){
    const prompt = await readline.question("Enter your prompt:- ")
    messages.push(new HumanMessage(prompt))
    const response = await agent.invoke({
        messages
    })

    console.log(response)
}

*/


const model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})

// get weather function

function getWeather({ city }) {
    return `The weather of ${city} is above 25 `
}

const getWeatherTool = tool(
    getWeather,
    {
        name: "getWeather",
        description: "Finding the weather of city",
        schema:z.object({
            city:z.string().describe("The weather of city")
        }) 
    }
)


// Read profile method
async function readProfile(){
    const data = await fs.readFile("./profile.md", "utf-8")
    return data
    
}

const readProfileTool = tool(
    readProfile,
    {
        name:"readProfile",
        description:'Read the memory of current user.',
        schema:z.object({})
    }
)

async function updateMemory({newMemory}){
    await fs.writeFile("./profile.md", newMemory, "utf-8")
    return "Memory updated successfully."
}

const updateMemoryTool = tool(
    updateMemory,
    {
        name:"update_memory",
        description:"Update the memory of the current User. ",
        schema:z.object({
            newMemory:z.string().describe("The new memory to be overwriten. ")
        })
    }
)

const agent = createAgent({
    model,
    tools: [getWeatherTool,readProfileTool, updateMemoryTool],
    systemPrompt:`
    Update the memory of the user whenever you found fact that will be relevant for weeks/month.
    `
})

const messages = []

while (true) {
    const prompt = await readline.question("Enter your prompt: ")
    messages.push(new HumanMessage(prompt))

    const response = await agent.invoke({
        messages
    })
    console.log(response)
}


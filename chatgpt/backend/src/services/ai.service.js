import { ChatMistralAI } from "@langchain/mistralai"
import { createAgent, toolStrategy, HumanMessage, AIMessage,tool } from "langchain"
import * as z from "zod"
import env from "../config/env.js";
import Context from "../model/context.model.js";



const model = new ChatMistralAI({
    model: "open-mistral-7b",
    apiKey: env.MISTRALAI_API_KEY,
})



//--------------------------- Tools for readContext and updateContext -------------------------------------------


const readContext = tool(
    async ({ userId }) => {
        const context = await Context.findOne({ user: userId })

        return context ? context.context : "no context found for this user"
    },
    {
        name: "readContext",
        description: "Reads the context for the current user.",
        schema: z.object({
            userId: z.string().describe("The ID of the user to read the context for."),
        })
    }
)

const updateContext = tool(
    async ({ userId, context }) => {
        const contextDoc = await Context.findOneAndUpdate(
            {
                user: userId
            },
            {
                context: context
            },
            {
                new: true,
                upsert: true
            }
        )

        return "context updated successfully"
    },
    {
        name: "updateContext",
        description: "Overwrites the context for the current user with the provided context.",
        schema: z.object({
            userId: z.string().describe("The ID of the user to update the context for."),
            context: z.string().describe("The new context to set for the user.")
        })
    }
)

async function getWeather({ city }) {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY || env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== 200) {
            return `Error fetching weather for ${city}: ${data.message}`;
        }
        const temp = data.main.temp;
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        return `The current weather in ${data.name}, ${data.sys.country} is ${temp}°C with ${description} and ${humidity}% humidity.`;
    } catch (error) {
        return `Failed to fetch weather data for ${city}: ${error.message}`;
    }
}

const getWeatherTool = tool(
    getWeather,
    {
        name: "getWeather",
        description: "Fetch the real-time weather information for any city.",
        schema: z.object({
            city: z.string().describe("The name of the city to get weather for.")
        }) 
    }
);


const getWikipediaSummaryTool = tool(
    async ({ topic }) => {
        try {
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
            const res = await fetch(url);
            if (!res.ok) return `No Wikipedia article found for "${topic}".`;
            const data = await res.json();
            return data.extract || "No summary available.";
        } catch (error) {
            return `Error fetching Wikipedia data: ${error.message}`;
        }
    },
    {
        name: "getWikipediaSummary",
        description: "Search and retrieve a concise summary of any concept, entity, or topic from Wikipedia.",
        schema: z.object({
            topic: z.string().describe("The topic or concept to search for on Wikipedia")
        })
    }
);



export async function generateTitle({ message }) {

    const agent = createAgent({
        model,
        systemPrompt: "Your role is to generate the title for the conversation on the basis of user first message",
        responseFormat: toolStrategy(z.object({
            title: z.string().describe("The title of the conversation based on the message"),
        }))
    })

    const response = await agent.invoke({
        messages: [
            new HumanMessage(message)
        ]
    })

    return response.structuredResponse.title

}



// how ai agent behave and to pass the additional instruction


export async function getStream({ messages,userId }) {

    const agent = createAgent({
        model,
        tools: [ getWikipediaSummaryTool, getWeatherTool, readContext, updateContext ],
        systemPrompt: `

        I am Alex and i am 3rd year student and i am trying to helping my juniors.

        Update the context for the current user whenever you found information that is relevant for weeks/months.

        read the current user context whenever you need to know about the user.

        current userId is ${userId}

        Current date is ${new Date().toDateString()}
        `,
    })

    const stream = agent.stream({
        messages: messages.map(msg =>{
            if(msg.author == "user"){
                return new HumanMessage(msg.content)
            }else{
                return new AIMessage(msg.content)
            }
        })
    }, {
        streamMode: "messages"
    })

    return stream
}








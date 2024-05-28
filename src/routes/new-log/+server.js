import { OpenAI, FunctionTool, OpenAIAgent, Settings } from "llamaindex";
import { SECRET_OPENAI_API_KEY } from '$env/static/private'



//function which will load the items and tags from the database.
async function loadItemsAndTags(event) {

    let itemsRes = await event.fetch('./table/items?select=id,name,tags(name)');
    let tagsRes = await event.fetch('./table/tags?select=id,name');


    let items = await itemsRes.json();
    let tags = await tagsRes.json();

    return { items, tags };
}

let jsonExample = `[
    {
      "name": "item_name",
      "description": "short text description/summary of item_name"
    },
    {
        "name": "another_item_name",
      "description": "short text description/summary of another_item_name"
    }
  ]`

// Creating new logs
// Goal: Take text input, get tags and items from the db, run it through the OpenAI API, create any new tags or items, and save the log to the db.

export const POST = async (event) => {
    //settings and setup.
    Settings.llm = new OpenAI({
        apiKey: SECRET_OPENAI_API_KEY,
        model: "gpt-4o",
    });

    Settings.callbackManager.on("llm-tool-call", (event) => {
        console.log(event.detail.payload);
    });
    Settings.callbackManager.on("llm-tool-result", (event) => {
        console.log(event.detail.payload);
    });
    try {
        // Retrieve the body content from the request
        const text = await event.request.json(); // Use .json() to parse the request body as JSON
        console.log(text);

        //get the tags and items from the database.
        let { items, tags } = await loadItemsAndTags(event);

        let systemPrompt = `You are a journaling assistant which takes user text and uses it to generate a list of log items to be added to a timeline. Included below is the existing list of items which can be added, along with their associated tags. New items may be generated if the content doesn't fit any existing data, but always fit into the more general existing items first. For example 'black tea' should not be added if there is already an entry for 'tea', 'play with pets' should not be created if there is already 'pet care' . Your The output should take the following raw JSON structure (do NOT include a json codeblock): ${jsonExample}  Existing tags: ${tags} Existing items: ${items}`

        // make the request to openai
        const agent = new OpenAIAgent({
            tools: [], // Include tools if necessary
            systemPrompt,
        });

        const response = await agent.chat({ message: text.content });
        let json = JSON.parse(response.response.message.content);
        // Create the response body
        const responseBody = JSON.stringify({
            suggestions: json,
            items: items,
            tags: tags
        });

        // Return the response as a Response object
        return new Response(responseBody, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        // Handle any errors that may occur
        console.error("Error processing request:", error);

        return new Response(
            JSON.stringify({ message: "An error occurred" }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};



import { OpenAI, FunctionTool, OpenAIAgent, Settings, Anthropic, AnthropicAgent } from "llamaindex";
import { SECRET_OPENAI_API_KEY, SECRET_ANTHROPIC_API_KEY } from '$env/static/private'



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

    try {
        // Retrieve the body content from the request
        const form = await event.request.json(); // Use .json() to parse the request body as JSON
        console.log(form);

        if (form.model === "openAI") {
            Settings.llm = new OpenAI({
                apiKey: SECRET_OPENAI_API_KEY,
                model: "gpt-4o",
            });
        } else if (form.model === "anthropic") {
            Settings.llm = new Anthropic({
                apiKey: SECRET_ANTHROPIC_API_KEY
            });
        }

        Settings.callbackManager.on("llm-tool-call", (event) => {
            console.log(event.detail.payload);
        });
        Settings.callbackManager.on("llm-tool-result", (event) => {
            console.log(event.detail.payload);
        });
        //get the tags and items from the database.
        let { items, tags } = await loadItemsAndTags(event);

        console.log(items,tags);

        let systemPrompt = `You are a journaling assistant that takes user text and uses it to generate a list of log items to be added to a timeline. Included below is the existing list of items which can be added, along with their associated tags.

Your primary goal is to match the user's input with the existing items as closely as possible. Only generate new items if the content absolutely does not fit any of the existing items. For example, 'black tea' should be matched with 'tea' if 'tea' already exists in the list, and 'play with pets' should be matched with 'pet care' if 'pet care' is an existing item.
A good strategy is to word match. If the input contains the exact word of an existing item, it should be matched with that item. If the input contains a word that is a substring of an existing item, it should be matched with that item. If the input contains multiple words that are substrings of an existing item, it should be matched with that item. Ex: If a entry talks about 'working on programming', it should be encoded as 'programming' and matched with 'programming'. 
You can generate a list of outputs, so when in doubt, it is better to generate more suggestions than fewer.
When generating the output, use the following raw JSON structure (do NOT include a JSON codeblock):
${jsonExample}

Existing tags: ${tags}
Existing items: ${items}`
        // make the request to openai

        let responseContent;
        if (form.model === "openAI") {
            const agent = new OpenAIAgent({
                tools: [], // Include tools if necessary
                systemPrompt,
            });
            const response = await agent.chat({ message: form.content });
            responseContent = JSON.parse(response.response.message.content);//OpenAI
        } else if (form.model === "anthropic") {
            const agent = new AnthropicAgent({
                tools: [], // Include tools if necessary
                systemPrompt,
            });
            const response = await agent.chat({ message: form.content });
            responseContent = JSON.parse(response.response.message.content[0].text); //Anthropic
        }
       
        console.log(responseContent);

        // let json = JSON.parse(responseContent);
        // Create the response body
        const responseBody = JSON.stringify({
            suggestions: responseContent,
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



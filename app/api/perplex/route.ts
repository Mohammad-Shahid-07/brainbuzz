// In your API route
type Chats = { role: string; content: string }[];

let chatHistory: Chats = [];

export async function POST(req: any, res: any) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.PERPEX_API;
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "pplx-70b-chat",
        messages: [
          {
            role: "system",
            content: "be short and consice",
          },
          ...chatHistory,
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0]?.message?.content;

    // Update chat history
    chatHistory = [
      ...chatHistory,
      { role: "user", content: message },
      { role: "assistant", content: assistantResponse },
    ];


    return Response.json(data);
  } catch (error) {
    console.error(error);
    return res.json({ error: "Internal Server Error" }); // Handle errors appropriately
  }
}

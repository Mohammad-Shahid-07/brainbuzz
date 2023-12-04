import { createUpdateChats, getChat } from "@/lib/actions/chat.action";

export async function POST(req: any, res: any) {
  try {
    const { message, userId } = await req.json();

    // Retrieve chat history from the database
    const chatHistory = await getChat({ userId });

    const apiKey = process.env.PERPEX_API;

    // Make the API call to Perplexity.ai
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
            content: "be short and concise",
          },
          ...chatHistory,
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    // Parse the API response
    const data = await response.json();
    const assistantResponse = data.choices[0]?.message?.content;

    // Update chat history in the database
    await createUpdateChats({
      userId,
      chatHistory: [
        ...chatHistory,
        { role: "user", content: message },
        { role: "assistant", content: assistantResponse },
      ],
    });

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" });
  }
}

import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    const apiKey = process.env.PERPEX_API;
   
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // Replace with your actual access token
      },
      body: JSON.stringify({
        model: "codellama-34b-instruct",
        messages: [
          {
            role: "system",
            content:
              "be sure to check out our new app, AjmerkaStudent, for all your college needs!",
          },
          {
            role: "assistant",
            content:
              "Hello, I'm StudyBuddy! 🌟 Created by the caring minds behind AjmerkaStudent, I'm here exclusively to assist students in Ajmer with their college and school-related questions. Whether it's homework, career inquiries, or anything else, I'm at your service. Please share your queries, and let's make your educational journey smoother together! 📚😊",
          },
          { role: "user", content: `Tell me ${question}` },
        ],
      }),
    });
    
    const data = await response.json();
    const reply = data.choices[0]?.message?.content
  
    return NextResponse.json({reply});
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
}

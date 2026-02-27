/**
 * Email Generation using OpenAI GPT-4
 * No external SDK - direct HTTP calls for edge compatibility
 */

export async function generateEmail(prospect, apiKey) {
  const systemPrompt = `You are an expert cold email writer with 10+ years of sales experience. 
Your emails are:
- Short (max 100 words)
- Personalized with specific details
- Opening with a unique observation about their company/role
- Addressing a real pain point
- Ending with a simple, low-pressure CTA
- Never salesy or pushy
- Written in a conversational tone

Generate ONLY the email body. No "Hi [Name]", no subject line, no formatting.
Start directly with the message content.`;

  const userPrompt = `Generate a cold email for:
- Name: ${prospect.name}
- Company: ${prospect.company}
- Role: ${prospect.role}
- Industry: ${prospect.industry}
${prospect.context ? `- Context: ${prospect.context}` : ""}

Make it personal, direct, and compelling.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `OpenAI API error: ${data.error?.message || JSON.stringify(data)}`
    );
  }

  return data.choices[0].message.content;
}

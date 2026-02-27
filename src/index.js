/**
 * MailForge API - Cloudflare Workers
 * AI Cold Email Generator powered by Claude Opus 4.6
 */

import { Anthropic } from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Route: Generate email
    if (url.pathname === "/api/generate-email" && request.method === "POST") {
      return handleGenerateEmail(request, env, anthropic);
    }

    // Route: Send email
    if (url.pathname === "/api/send-email" && request.method === "POST") {
      return handleSendEmail(request, env);
    }

    // Route: Get user emails
    if (url.pathname === "/api/emails" && request.method === "GET") {
      return handleGetEmails(request, env);
    }

    // Route: Health check
    if (url.pathname === "/health" && request.method === "GET") {
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};

async function handleGenerateEmail(request, env, anthropic) {
  try {
    const { prospect } = await request.json();

    const prompt = `You are an expert cold email writer. Generate a highly personalized, short cold email (max 100 words) that:
- Opens with a specific observation about their company or role
- Mentions a specific pain point they likely face
- Proposes a brief conversation (no sales pitch)
- Ends with a simple CTA

Prospect info:
- Name: ${prospect.name}
- Company: ${prospect.company}
- Role: ${prospect.role}
- Industry: ${prospect.industry}
- Context: ${prospect.context || ""}

Generate ONLY the email body, no subject line, no salutation. Make it personal and direct.`;

    const message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const emailBody = message.content[0].text;

    return new Response(
      JSON.stringify({
        success: true,
        email: emailBody,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function handleSendEmail(request, env) {
  try {
    const { to, subject, body } = await request.json();

    // TODO: Implement MS Graph email sending
    // For now, store in KV as proof of concept

    const emailRecord = {
      to,
      subject,
      body,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    // Store email in KV
    const key = `email_${Date.now()}_${Math.random()}`;
    await env.EMAILS.put(key, JSON.stringify(emailRecord));

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email queued for sending",
        id: key,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function handleGetEmails(request, env) {
  try {
    // List all emails from KV
    const list = await env.EMAILS.list();
    const emails = [];

    for (const key of list.keys) {
      const email = await env.EMAILS.get(key.name);
      emails.push(JSON.parse(email));
    }

    return new Response(JSON.stringify({ success: true, emails }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

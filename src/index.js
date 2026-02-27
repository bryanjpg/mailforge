/**
 * MailForge API - Cloudflare Workers
 * AI Cold Email Generator powered by Claude Opus 4.6
 */

import { generateEmail } from "./claude-email.js";
import { MSGraphService } from "./msgraph.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Enable CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Health check
    if (url.pathname === "/health" && request.method === "GET") {
      return json({ status: "ok", timestamp: new Date().toISOString() });
    }

    // Generate email
    if (url.pathname === "/api/generate-email" && request.method === "POST") {
      return handleGenerateEmail(request, env);
    }

    // Send email
    if (url.pathname === "/api/send-email" && request.method === "POST") {
      return handleSendEmail(request, env);
    }

    // Get email history
    if (url.pathname === "/api/emails" && request.method === "GET") {
      return handleGetEmails(request, env);
    }

    return json({ error: "Not Found" }, 404);
  },
};

async function handleGenerateEmail(request, env) {
  try {
    const { prospect } = await request.json();

    // Validate input
    if (!prospect || !prospect.name || !prospect.company || !prospect.role) {
      return json(
        { error: "Missing required fields: name, company, role" },
        400
      );
    }

    // Generate email using OpenAI GPT-4
    const emailBody = await generateEmail(
      prospect,
      env.OPENAI_API_KEY || process.env.OPENAI_API_KEY
    );

    return json({
      success: true,
      email: emailBody,
      prospect: {
        name: prospect.name,
        company: prospect.company,
        role: prospect.role,
      },
    });
  } catch (error) {
    console.error("Generate email error:", error);
    return json({ error: error.message }, 500);
  }
}

async function handleSendEmail(request, env) {
  try {
    const { to, subject, body } = await request.json();

    if (!to || !subject || !body) {
      return json(
        { error: "Missing required fields: to, subject, body" },
        400
      );
    }

    // Initialize MS Graph service
    const msGraph = new MSGraphService(
      env.MS_CLIENT_ID || process.env.MS_CLIENT_ID,
      env.MS_CLIENT_SECRET || process.env.MS_CLIENT_SECRET,
      env.MS_TENANT_ID || process.env.MS_TENANT_ID,
      env.EMAIL_ADDRESS || process.env.EMAIL_ADDRESS
    );

    // Send email
    await msGraph.sendEmail(to, subject, body);

    // Store in KV for history
    const emailRecord = {
      to,
      subject,
      body,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    const key = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    if (env.EMAILS) {
      await env.EMAILS.put(key, JSON.stringify(emailRecord));
    }

    return json({
      success: true,
      message: "Email sent successfully",
      id: key,
    });
  } catch (error) {
    console.error("Send email error:", error);
    return json({ error: error.message }, 500);
  }
}

async function handleGetEmails(request, env) {
  try {
    const emails = [];

    if (env.EMAILS) {
      const list = await env.EMAILS.list();

      for (const key of list.keys) {
        const email = await env.EMAILS.get(key.name);
        if (email) {
          emails.push(JSON.parse(email));
        }
      }
    }

    return json({
      success: true,
      count: emails.length,
      emails: emails.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    });
  } catch (error) {
    console.error("Get emails error:", error);
    return json({ error: error.message }, 500);
  }
}

// Helper function for JSON responses
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

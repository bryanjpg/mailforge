/**
 * MS Graph Integration for Email Sending
 * Sends emails via maduro@layer-ict.nl (Office365/Outlook)
 */

export class MSGraphService {
  constructor(clientId, clientSecret, tenantId, emailAddress) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.tenantId = tenantId;
    this.emailAddress = emailAddress;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;

    const body = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      body: body.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to get access token: ${data.error} - ${data.error_description}`
      );
    }

    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // Refresh 1 min before expiry

    return this.accessToken;
  }

  async sendEmail(to, subject, body, isHtml = false) {
    const token = await this.getAccessToken();

    const message = {
      subject: subject,
      body: {
        contentType: isHtml ? "HTML" : "text",
        content: body,
      },
      toRecipients: [
        {
          emailAddress: {
            address: to,
          },
        },
      ],
      isReadReceiptRequested: false,
    };

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${this.emailAddress}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          saveToSentItems: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to send email: ${error.error.message || JSON.stringify(error)}`
      );
    }

    return { success: true };
  }
}

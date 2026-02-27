/**
 * MailForge Frontend
 * React-less simple app for email generation
 */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");

  root.innerHTML = `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-black border-b border-gray-800">
        <div class="max-w-6xl mx-auto px-6 py-4">
          <h1 class="text-3xl font-bold">💌 MailForge</h1>
          <p class="text-gray-400">AI-Powered Cold Email Generator</p>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Input Form -->
          <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 class="text-2xl font-bold mb-6">Generate Email</h2>
            
            <form id="emailForm" class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Prospect Name</label>
                <input 
                  type="text" 
                  id="prospectName"
                  placeholder="John Smith"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Company</label>
                <input 
                  type="text" 
                  id="company"
                  placeholder="Acme Corp"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Role</label>
                <input 
                  type="text" 
                  id="role"
                  placeholder="CEO / Marketing Manager"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Industry</label>
                <input 
                  type="text" 
                  id="industry"
                  placeholder="SaaS / E-commerce / Tech"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Context (Optional)</label>
                <textarea 
                  id="context"
                  placeholder="Any specific details about them or their company"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20"
                ></textarea>
              </div>

              <button 
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Generate Email
              </button>
            </form>
          </div>

          <!-- Output Preview -->
          <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 class="text-2xl font-bold mb-6">Preview</h2>
            
            <div id="preview" class="space-y-4">
              <div class="bg-gray-700 p-4 rounded text-gray-400 text-center">
                Your generated email will appear here...
              </div>
            </div>

            <div class="mt-6 space-y-2">
              <button 
                id="sendBtn"
                disabled
                class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>

        <!-- History -->
        <div class="mt-12 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 class="text-2xl font-bold mb-6">Recent Emails</h2>
          <div id="history" class="space-y-2">
            <p class="text-gray-400">No emails yet</p>
          </div>
        </div>
      </main>
    </div>
  `;

  // Event listeners
  document.getElementById("emailForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const prospect = {
      name: document.getElementById("prospectName").value,
      company: document.getElementById("company").value,
      role: document.getElementById("role").value,
      industry: document.getElementById("industry").value,
      context: document.getElementById("context").value,
    };

    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect }),
      });

      const data = await response.json();

      if (data.success) {
        const preview = document.getElementById("preview");
        preview.innerHTML = `
          <div class="bg-gray-700 p-4 rounded text-white">
            <p class="text-sm text-gray-300 mb-2">Generated for: <strong>${prospect.name}</strong> at <strong>${prospect.company}</strong></p>
            <p class="whitespace-pre-wrap">${data.email}</p>
          </div>
        `;
        document.getElementById("sendBtn").disabled = false;
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Failed to generate email: " + error.message);
    }
  });
});

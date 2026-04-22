export default async function handler(req, res) {
  try {
    const apiKey = process.env.PADLET_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "PADLET_API_KEY fehlt in Vercel."
      });
    }

    const response = await fetch("https://api.padlet.dev/v1/me", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json"
      }
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return res.status(response.status).json({
      ok: response.ok,
      status: response.status,
      data
    });
  } catch (error) {
    return res.status(500).json({
      error: "Serverfunktion abgestürzt",
      details: String(error)
    });
  }
}

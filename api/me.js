export default async function handler(req, res) {
  try {
    const apiKey = process.env.PADLET_API_KEY;

    const response = await fetch("https://api.padlet.dev/v1/me", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json"
      }
    });

    const text = await response.text();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(text.substring(0, 3000));

  } catch (error) {
    return res.status(500).send("Fehler: " + error.message);
  }
}

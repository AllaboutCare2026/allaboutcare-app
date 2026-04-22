export default async function handler(req, res) {
  try {
    const apiKey = process.env.PADLET_API_KEY;
    const boardId = "m4lpvae8jyAKvxvo";

    const response = await fetch(`https://api.padlet.dev/v1/boards/${boardId}`, {
      headers: {
        "X-Api-Key": apiKey,
        Accept: "application/vnd.api+json"
      }
    });

    const text = await response.text();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(response.status).send(text.substring(0, 4000));
  } catch (error) {
    return res.status(500).send("Fehler: " + error.message);
  }
}

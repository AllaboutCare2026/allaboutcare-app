export default async function handler(req, res) {
  try {
    const apiKey = process.env.PADLET_API_KEY;

    const response = await fetch("https://api.padlet.dev/v1/me", {
      headers: {
        "X-Api-Key": apiKey,
        Accept: "application/vnd.api+json"
      }
    });

    const data = await response.json();

    const boards = data.data?.relationships?.boards?.data || [];

    return res.status(200).json({ boards });
  } catch (error) {
    return res.status(500).json({
      error: "Fehler beim Laden der Boards",
      details: String(error)
    });
  }
}

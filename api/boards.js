export default async function handler(req, res) {
  try {
    const apiKey = process.env.PADLET_API_KEY;

    const response = await fetch("https://api.padlet.dev/v1/me?include=boards", {
      headers: {
        "X-Api-Key": apiKey,
        "Accept": "application/vnd.api+json"
      }
    });

    const data = await response.json();

    const boards = (data.included || [])
      .filter(item => item.type === "board")
      .map(item => ({
        id: item.id,
        title: item.attributes?.title || "Ohne Titel"
      }));

    res.status(200).json({ boards });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

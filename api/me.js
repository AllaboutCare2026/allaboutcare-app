export default async function handler(req, res) {
  try {
    const apiKey = process.env.PADLET_API_KEY;

    const response = await fetch("https://api.padlet.dev/v1/me?include=boards", {
      headers: {
        "X-Api-Key": apiKey,
        Accept: "application/vnd.api+json"
      }
    });

    const data = await response.json();

    const included = Array.isArray(data.included) ? data.included : [];

    const boards = included
      .filter(item => item.type === "board" || item.type === "boards")
      .map(item => ({
        id: item.id,
        title:
          item.attributes?.title ||
          item.attributes?.name ||
          item.attributes?.subject ||
          "Ohne Titel"
      }));

    return res.status(200).json({ boards });
  } catch (error) {
    return res.status(500).json({
      error: "Fehler beim Laden",
      details: String(error)
    });
  }
}

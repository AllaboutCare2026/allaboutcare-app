export default async function handler(req, res) {
  try {
    const apiKey = process.env.PADLET_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "PADLET_API_KEY fehlt." });
    }

    const meResponse = await fetch("https://api.padlet.dev/v1/me", {
      headers: {
        "X-Api-Key": apiKey,
        Accept: "application/vnd.api+json"
      }
    });

    const meData = await meResponse.json();
    const boardRefs = meData?.data?.relationships?.boards?.data || [];

    const boards = [];

    for (const ref of boardRefs) {
      const boardId = ref.id;

      const boardResponse = await fetch(`https://api.padlet.dev/v1/boards/${boardId}`, {
        headers: {
          "X-Api-Key": apiKey,
          Accept: "application/vnd.api+json"
        }
      });

      const boardData = await boardResponse.json();

      boards.push({
        id: boardId,
        title:
          boardData?.data?.attributes?.title ||
          boardData?.data?.attributes?.name ||
          "Ohne Titel"
      });
    }

    return res.status(200).json({ boards });
  } catch (error) {
    return res.status(500).json({
      error: "Fehler beim Laden der Boards",
      details: String(error)
    });
  }
}

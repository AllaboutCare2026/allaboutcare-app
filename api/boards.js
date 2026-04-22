export default async function handler(req, res) {
  const boardId = req.query.id;

  if (!boardId) {
    return res.status(400).json({ error: "Board-ID fehlt." });
  }

  try {
    const apiKey = process.env.PADLET_API_KEY;

    const response = await fetch(
      `https://api.padlet.dev/v1/boards/${boardId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    const data = await response.json();

    return res.status(200).json({
      title: data.title || "",
      sections: data.sections || [],
      posts: data.posts || []
    });

  } catch (error) {
    return res.status(500).json({
      error: "Fehler beim Laden."
    });
  }
}

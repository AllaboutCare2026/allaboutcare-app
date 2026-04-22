export default async function handler(req, res) {
  try {
    const apiKey = process.env.PADLET_API_KEY;
    const boardId = req.query.id;

    if (!boardId) {
      return res.status(400).json({ error: "Board-ID fehlt." });
    }

    const response = await fetch(`https://api.padlet.dev/v1/boards/${boardId}?include=posts`, {
      headers: {
        "X-Api-Key": apiKey,
        "Accept": "application/vnd.api+json"
      }
    });

    const data = await response.json();

    const included = Array.isArray(data.included) ? data.included : [];
    const posts = included.filter(item => item.type === "post" || item.type === "posts");

    res.status(200).json({
      count: posts.length,
      firstPost: posts[0] || null,
      posts: posts.slice(0, 3)
    });
  } catch (error) {
    res.status(500).json({
      error: "Fehler beim Laden des Boards",
      details: String(error)
    });
  }
}

export default async function handler(req, res) {
  try {
    const apiKey = process.env.PADLET_API_KEY;
    const boardId = req.query.id;

    if (!boardId) {
      return res.status(400).json({ error: "Board-ID fehlt." });
    }

    const response = await fetch(`https://api.padlet.dev/v1/boards/${boardId}?include=posts,sections`, {
      headers: {
        "X-Api-Key": apiKey,
        "Accept": "application/vnd.api+json"
      }
    });

    const data = await response.json();
    const included = Array.isArray(data.included) ? data.included : [];

    const sections = included
      .filter(item => item.type === "section" || item.type === "sections")
      .map(item => ({
        id: item.id,
        title:
          item.attributes?.title ||
          item.attributes?.subject ||
          item.attributes?.name ||
          "Ohne Titel"
      }));

    const posts = included
      .filter(item => item.type === "post" || item.type === "posts")
      .map(item => ({
        id: item.id,
        title:
          item.attributes?.title ||
          item.attributes?.subject ||
          item.attributes?.name ||
          "Ohne Titel",
        text:
          typeof item.attributes?.content === "string"
            ? item.attributes.content
            : typeof item.attributes?.body === "string"
            ? item.attributes.body
            : "",
        url:
          item.attributes?.attachment_url ||
          item.attributes?.url ||
          item.attributes?.link ||
          "",
        sectionId:
          item.relationships?.section?.data?.id || ""
      }));

    res.status(200).json({ sections, posts });
  } catch (error) {
    res.status(500).json({
      error: "Fehler beim Laden des Boards",
      details: String(error)
    });
  }
}

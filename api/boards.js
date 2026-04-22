export default async function handler(req, res) {
  try {
    const apiKey = process.env.PADLET_API_KEY;
    const boardId = req.query.id;

    if (!boardId) {
      return res.status(400).json({ error: "Board-ID fehlt." });
    }

    const response = await fetch(
      `https://api.padlet.dev/v1/boards/${boardId}?include=posts,sections`,
      {
        headers: {
          "X-Api-Key": apiKey,
          "Accept": "application/vnd.api+json"
        }
      }
    );

    const raw = await response.json();

    const included = Array.isArray(raw.included) ? raw.included : [];
    const data = raw.data || {};

    const sections = included
      .filter(item => item.type === "section" || item.type === "sections")
      .map(item => ({
        id: item.id,
        title:
          item.attributes?.title ||
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
          "Ohne Titel",
        text:
          item.attributes?.body ||
          item.attributes?.text ||
          item.attributes?.content ||
          "",
        url:
          item.attributes?.url ||
          item.attributes?.link_url ||
          "",
        sectionId:
          item.relationships?.section?.data?.id ||
          item.attributes?.section_id ||
          "",
        attachments: []
      }));

    return res.status(200).json({
      id: data.id || boardId,
      title: data.attributes?.title || "",
      sections,
      posts
    });
  } catch (error) {
    return res.status(500).json({
      error: "Fehler beim Laden des Boards",
      details: String(error)
    });
  }
}

function cleanText(value) {
  return String(value || "")
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .replace(/[^\x00-\x7F]/g, "");
}

export default async function handler(req, res) {
  try {
    const apiKey = process.env.PADLET_API_KEY;

    if (!apiKey) {
      return res.status(500).send("PADLET_API_KEY fehlt.");
    }

    const response = await fetch("https://api.padlet.dev/v1/me", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json"
      }
    });

    const json = await response.json();

    const included = Array.isArray(json.included) ? json.included : [];

    const boards = included
      .filter(item => item.type === "boards")
      .map(item => ({
        id: item.id,
        title: cleanText(
          item.attributes?.title ||
          item.attributes?.name ||
          item.attributes?.subject ||
          "Ohne Titel"
        )
      }));

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).send(JSON.stringify({ boards }, null, 2));
  } catch (error) {
    return res.status(500).send(
      JSON.stringify(
        {
          error: "Serverfunktion abgesturzt",
          details: String(error)
        },
        null,
        2
      )
    );
  }
}

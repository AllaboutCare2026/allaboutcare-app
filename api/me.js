export default async function handler(req, res) {
  const response = await fetch("https://api.padlet.dev/v1/me", {
    headers: {
      Authorization: `Bearer ${process.env.PADLET_API_KEY}`,
      Accept: "application/vnd.api+json"
    }
  });

  const data = await response.json();
  res.status(200).json(data);
}

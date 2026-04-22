export default async function handler(req, res) {
  res.status(200).json({
    posts: [
      {
        title: "Testbeitrag",
        text: "board.js funktioniert jetzt.",
        url: ""
      }
    ]
  });
}

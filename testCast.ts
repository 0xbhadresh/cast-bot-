import { createCanvas, loadImage } from "canvas";
import { writeFileSync } from "fs";

// Dummy Data (same as API response)
const dummyData = {
  username: "0xshinchain",
  displayName: "shinchain",
  profilePic:
    "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/c85b9ce3-b47c-4cff-6113-7c631d35f500/rectcrop3",
  text: "Ethereum is the second-largest cryptocurrency by market cap, powering a robust ecosystem of decentralized applications.",
  timestamp: "2025-02-19T16:04:36.000Z",
};

// Function to generate the tweet-like image
async function generateTweetImage(data: { username: any; displayName: any; profilePic: any; text: any; timestamp: any; }) {
  const width = 800;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Load profile picture
  const profileImage = await loadImage(data.profilePic);
  ctx.drawImage(profileImage, 20, 20, 80, 80);

  // Display name
  ctx.fillStyle = "#000";
  ctx.font = "bold 24px Arial";
  ctx.fillText(data.displayName, 120, 50);

  // Username
  ctx.fillStyle = "#555";
  ctx.font = "18px Arial";
  ctx.fillText(`@${data.username}`, 120, 80);

  // Text
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  wrapText(ctx, data.text, 20, 140, width - 40, 28);

  // Timestamp
  ctx.fillStyle = "#777";
  ctx.font = "16px Arial";
  ctx.fillText(new Date(data.timestamp).toLocaleString(), 20, height - 20);

  // Save Image
  const buffer = canvas.toBuffer("image/png");
  writeFileSync("tweet.png", new Uint8Array(buffer));
  console.log("Image saved as tweet.png");
}

// Function to wrap text
function wrapText(ctx: import("canvas").CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(" ");
    let line = "";
    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, y);
            line = words[i] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

// Initialize Bun server
const server = Bun.serve({
  port: 3003,
  async fetch(req) {
    if (req.method === "GET") {
      await generateTweetImage(dummyData);
      return new Response("Image generated! Check tweet.png", { status: 200 });
    }
    return new Response("Method Not Allowed", { status: 405 });
  },
});

console.log(`Listening on localhost:${server.port}`);

import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "your_webhook_secret";

function verifySignature(body: string, signature: string, timestamp: string): boolean {
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  return signature === expected;
}

app.post("/webhook", (req, res) => {
  const signature = req.headers["x-gaviventures-signature"] as string;
  const timestamp = req.headers["x-gaviventures-timestamp"] as string;

  if (signature && timestamp) {
    const isValid = verifySignature(JSON.stringify(req.body), signature, timestamp);
    console.log("Signature valid:", isValid);
  }

  const { event, data } = req.body;
  console.log(`Event: ${event}`);
  console.log("Data:", JSON.stringify(data, null, 2));

  res.json({ received: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Webhook receiver listening on http://localhost:${PORT}/webhook`);
});

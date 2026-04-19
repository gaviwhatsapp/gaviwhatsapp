import { readFileSync } from "fs";
import { WhatsApp } from "@gaviwhatsapp/whatsapp";

const wa = new WhatsApp({ apiKey: process.env.GAVIWHATSAPP_API_KEY! });

const csv = readFileSync("recipients.csv", "utf-8");
const lines = csv.trim().split("\n").slice(1); // skip header

const recipients: string[] = [];
const variablesPerRecipient: Record<string, string>[] = [];

for (const line of lines) {
  const [phone, ...vars] = line.split(",");
  recipients.push(phone);
  const varMap: Record<string, string> = {};
  vars.forEach((v, i) => {
    varMap[String(i + 1)] = v;
  });
  variablesPerRecipient.push(varMap);
}

console.log(`Sending broadcast to ${recipients.length} recipients...`);

const result = await wa.broadcast({
  recipients,
  template: "promo_offer", // replace with your approved template name
  variables_per_recipient: variablesPerRecipient,
});

console.log("Broadcast result:", JSON.stringify(result, null, 2));

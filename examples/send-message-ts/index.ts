import { WhatsApp } from "@gaviwhatsapp/whatsapp";

const wa = new WhatsApp({ apiKey: process.env.GAVIWHATSAPP_API_KEY! });

const result = await wa.send({
  to: "+919876543210", // replace with recipient number
  text: "Hello from the Gavi WhatsApp API! 🚀",
});

console.log("Message sent:", result);

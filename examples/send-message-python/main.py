import os
from gaviwhatsapp import WhatsApp

wa = WhatsApp(api_key=os.environ["GAVIWHATSAPP_API_KEY"])

result = wa.send(
    to="+919876543210",  # replace with recipient number
    text="Hello from the Gavi WhatsApp API! 🚀",
)

print("Message sent:", result)

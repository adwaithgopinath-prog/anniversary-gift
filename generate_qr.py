import qrcode
import os

# Create assets folder if not exists
if not os.path.exists('assets'):
    os.makedirs('assets')

# URL to encode (Local Network Testing)
# Phone must be on SAME WiFi as Laptop!
url = "http://192.168.1.11:8000/index.html"  

# Generate QR Code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H, # High error correction
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Create an image from the QR Code instance
img = qr.make_image(fill_color="#ff0a54", back_color="white") # Pink color!

img.save("assets/qrcode.png")
print("Success! QR Code generated at assets/qrcode.png")

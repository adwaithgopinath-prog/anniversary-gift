import qrcode
import os

# Create assets folder if not exists
if not os.path.exists('assets'):
    os.makedirs('assets')

# URL to encode (GitHub Pages)
# Make sure to enable GitHub Pages in your Repo Settings!
url = "https://adwaithgopinath-prog.github.io/anniversary-gift/"  

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

# WAJoin
Currently WhatsApp group size limit is still only 256 users. What if you wanted to join a full group?
WAJoin will let you join full WhatsApp groups by waiting for the exact moment another user exits the group and then automatically replacing him.
WAJoin works with browser automation using Selenium.

## Installation
- Install firefox's geckodriver from the following link: https://github.com/mozilla/geckodriver/releases. Click here for instructions: https://askubuntu.com/a/871077.
- Then install the project and it's dependencies using the following commands:
```
git clone https://github.com/danzilberdan/WAJoin.git
cd WAJoin
pip3 install -r requirements.txt
```

## Running WAJoin
inside the projects directory run wajoin.py with the link to the group you would like to join.
```
# Run the tool with the link of the group you would like to join.
python3 wajoin.py https://chat.whatsapp.com/GfDjd5847fjgKJSHRK749f
```
Then a Browser window will appear with a QR code for WhatsApp Web. Scan the link with your phone and the script should start.

## Languages
Currently the code only supports English and Hebrew.
Support for more countries should be implemented.
Even better will be to implement the functionality without relying on the 'Join' text of the button.
I will happily accept contributions :smile:

If your WhatsApp is in a different language, change it temporerily.
1. Open WhatsApp
2. Tap More options > Settings > Chats > App Language.
3. Choose English.
4. Now the script should work.

#!/bin/bash

# Start Backend
cd Backend
npm start &

# Start Frontend
cd ../Frontend
npm start &

# Start Python Chatbot
cd ../ChatBot
source ~/venv-metal/bin/activate
python chatgui.py &

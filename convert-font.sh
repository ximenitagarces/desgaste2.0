#!/bin/bash

echo "Convirtiendo...";

# Intentar usar pyftsubset directamente
if command -v pyftsubset &> /dev/null; then
    pyftsubset ./fonts/DesgasteVF.ttf --layout-features="*" --flavor="woff2" --output-file="./fonts/DesgasteVF.woff2"
# Si no está disponible, intentar usar python3 -m fontTools.subset
elif python3 -m fontTools.subset --help &> /dev/null; then
    python3 -m fontTools.subset ./fonts/DesgasteVF.ttf --layout-features="*" --flavor="woff2" --output-file="./fonts/DesgasteVF.woff2"
else
    echo "Error: pyftsubset no está disponible."
    echo "Para instalar fonttools, ejecuta uno de estos comandos:"
    echo "  sudo apt install python3-fonttools"
    echo "  O: python3 -m pip install --user fonttools --break-system-packages"
    exit 1
fi
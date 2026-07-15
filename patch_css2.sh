#!/bin/bash
sed -i 's/transition: all 0.25s/transition: transform 0.25s, opacity 0.25s, background-color 0.25s, box-shadow 0.25s, border-color 0.25s/g' src/index.css

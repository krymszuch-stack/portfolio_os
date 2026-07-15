#!/bin/bash
sed -i 's/transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);/transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  will-change: transform, box-shadow;\n  transform: translateZ(0);/g' src/index.css
sed -i 's/transform: translateY(-4px);/transform: translateY(-4px) translateZ(0);/g' src/index.css

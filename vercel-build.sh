#!/bin/bash
# Vercel build script - injects the API URL at build time
set -e

# Replace the placeholder with the actual Render API URL
sed -i "s|API_URL_PLACEHOLDER|${NG_APP_API_URL}|g" src/environments/environment.prod.ts

# Build Angular for production
npx ng build --configuration production

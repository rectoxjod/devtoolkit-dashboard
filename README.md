# DevToolkit Dashboard 🛠️

A lightweight, browser-based toolbox for developers. Format JSON, inspect API responses, encode/decode Base64, and generate UUIDs—all in one place.

## Features
- **JSON Formatter & Validator** — format messy JSON and report parsing errors.
- **API Tester** — send GET/POST/PUT/PATCH/DELETE requests and inspect status, headers, and response time.
- **Base64 Utility** — encode and decode text.
- **UUID Generator** — create UUID v4 identifiers.
- **Responsive UI** — works on desktop and mobile.
- **Privacy-first** — utilities run in your browser; API requests go directly from your browser to the chosen endpoint.

## Run locally
No build step or dependencies required.

1. Download or clone this repository.
2. Open `index.html` in your browser.

For a local development server, run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## Deploy with GitHub Pages
1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under build and deployment, choose **Deploy from a branch**.
4. Select `main` and `/ (root)`, then save.

## Important notes
- Some APIs block browser requests through CORS. That is a server policy, not necessarily a bug in this tool.
- Do not paste secrets, access tokens, or private customer data into public/shared environments.
- This is a client-side demo tool, not a secure vault or production API gateway.

## Roadmap
- [ ] Save named snippets locally
- [ ] Add dark/light theme toggle
- [ ] Export formatted JSON
- [ ] Add request history
- [ ] Add unit tests for utility functions

## Contributing
Issues and pull requests are welcome. Please describe the problem, steps to reproduce, and expected behavior.

## License
MIT — see [LICENSE](LICENSE).

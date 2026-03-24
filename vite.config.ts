import path from "path"
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

function prerenderPlugin(): Plugin {
  return {
    name: "vite:prerender",
    apply: "build",
    enforce: "post",
    async closeBundle() {
      const distDir = path.resolve(__dirname, "dist")
      const indexPath = path.join(distDir, "index.html")

      const { readFile, writeFile } = await import("fs/promises")
      const puppeteer = await import("puppeteer")
      const { createServer } = await import("http")

      // Поднимаем простой статический сервер для dist
      const server = createServer(async (req, res) => {
        const url = req.url === "/" ? "/index.html" : req.url!
        const filePath = path.join(distDir, url)
        try {
          const content = await readFile(filePath)
          const ext = path.extname(filePath)
          const types: Record<string, string> = {
            ".html": "text/html", ".js": "application/javascript",
            ".css": "text/css", ".svg": "image/svg+xml",
            ".json": "application/json", ".png": "image/png",
            ".ico": "image/x-icon", ".xml": "application/xml",
          }
          res.setHeader("Content-Type", types[ext] || "application/octet-stream")
          res.end(content)
        } catch {
          res.statusCode = 404
          res.end("")
        }
      })

      await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve))
      const port = (server.address() as import("net").AddressInfo).port

      console.log(`\n[prerender] Запуск Puppeteer на http://127.0.0.1:${port}...`)

      const browser = await puppeteer.default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      })
      const page = await browser.newPage()

      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle0" })
      // Ждём рендера React
      await page.waitForSelector("#root > *", { timeout: 10000 })

      const renderedHtml = await page.content()
      await browser.close()
      server.close()

      await writeFile(indexPath, renderedHtml, "utf-8")
      console.log(`[prerender] index.html пререндерен (${(renderedHtml.length / 1024).toFixed(1)} KB)\n`)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    prerenderPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

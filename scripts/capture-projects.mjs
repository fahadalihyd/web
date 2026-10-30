// One-off screenshot capture for the showcase projects.
// Not a project dependency: playwright-core is installed in a temp folder and passed in via PW_PATH.
//   PW_PATH=/path/to/folder-with-node_modules node scripts/capture-projects.mjs
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(join(process.env.PW_PATH ?? process.cwd(), 'noop.js'))
const { chromium } = require('playwright-core')

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'projects')
mkdirSync(out, { recursive: true })

const targets = [
  { slug: 'orderswift', url: 'https://ordersswift.com/' },
  // hero fades in slowly, so wait longer before shooting
  { slug: 'beyond-limits', url: 'https://beyondlimitstechnologies.com/', wait: 8000 },
  { slug: 'monily', url: 'https://monily-v2.vercel.app/' },
]

const MAX_FULL_HEIGHT = 5200

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge', headless: true })

const only = process.env.ONLY
for (const { slug, url, wait = 2500, full = true } of targets) {
  if (only && only !== slug) continue
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {})
    await page.waitForTimeout(wait)

    // dismiss common cookie / consent banners
    for (const name of [/accept all/i, /accept/i, /agree/i, /got it/i, /allow all/i]) {
      const btn = page.getByRole('button', { name }).first()
      if (await btn.isVisible().catch(() => false)) {
        await btn.click({ timeout: 1500 }).catch(() => {})
        break
      }
    }

    // scroll through the page to trigger lazy content, then return to top
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < Math.min(height, MAX_FULL_HEIGHT); y += 700) {
      await page.evaluate((v) => window.scrollTo(0, v), y)
      await page.waitForTimeout(250)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(1200)

    await page.screenshot({ path: join(out, `${slug}.jpg`), type: 'jpeg', quality: 80 })
    if (full) await page.screenshot({
      path: join(out, `${slug}-full.jpg`),
      type: 'jpeg',
      quality: 75,
      fullPage: true,
      clip: { x: 0, y: 0, width: 1440, height: Math.min(height, MAX_FULL_HEIGHT) },
    })
    console.log(`captured ${slug} (page height ${height})`)
  } catch (err) {
    console.error(`failed ${slug}:`, err.message)
  } finally {
    await page.close()
  }
}

await browser.close()

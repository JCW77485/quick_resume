import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Test Desktop
        page = await browser.new_page(viewport={'width': 1280, 'height': 720})
        base_url = "http://localhost:5174/quick_resume/"

        try:
            await page.goto(base_url, timeout=10000)
            await page.wait_for_selector("text=QuickResume")
        except Exception as e:
            print(f"Failed to load page: {e}")
            await browser.close()
            return

        # 1. Landing Page
        await page.screenshot(path="desktop_landing.png")
        print("Captured desktop_landing.png")

        # 2. Builder (Unauthenticated)
        # Using a safer way to navigate
        await page.goto(base_url + "#/builder")
        await page.wait_for_selector("text=My Resumes", timeout=10000)
        await page.screenshot(path="desktop_builder.png")
        print("Captured desktop_builder.png")

        # 3. Editor
        await page.click("text=New resume")
        await page.wait_for_selector("text=Personal details", timeout=10000)
        await page.screenshot(path="desktop_editor.png")
        print("Captured desktop_editor.png")

        # 4. Gated Download
        await page.click("text=Download PDF")
        await page.wait_for_selector("text=Sign in to Download", timeout=10000)
        await page.screenshot(path="desktop_gate_modal.png")
        print("Captured desktop_gate_modal.png")

        # 5. Pricing
        await page.goto(base_url + "#/pricing")
        await page.wait_for_selector("text=Simple, transparent pricing", timeout=10000)
        await page.screenshot(path="desktop_pricing.png")
        print("Captured desktop_pricing.png")

        # Test Mobile
        mobile_page = await browser.new_page(viewport={'width': 375, 'height': 667}, is_mobile=True)
        await mobile_page.goto(base_url)
        await mobile_page.screenshot(path="mobile_landing.png")
        print("Captured mobile_landing.png")

        await mobile_page.goto(base_url + "#/builder")
        await mobile_page.wait_for_selector("text=My Resumes", timeout=10000)
        await mobile_page.screenshot(path="mobile_builder.png")
        print("Captured mobile_builder.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())

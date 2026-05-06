import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Direct navigation to editor for default resume
        try:
            await page.goto("http://localhost:5174/builder/editor/default", timeout=10000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            await browser.close()
            return

        try:
            await page.wait_for_selector("text=Download PDF", timeout=10000)
        except:
             print("Editor did not load in time")
             await page.screenshot(path="verify_print_v3_fail.png")
             await browser.close()
             return

        # Check for data-print-target
        content = await page.content()
        if 'data-print-target' in content:
             print("SUCCESS: data-print-target found in page content")
        else:
             print("FAILURE: [data-print-target] NOT found in DOM")

        await page.screenshot(path="verify_print_v3.png", full_page=True)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())

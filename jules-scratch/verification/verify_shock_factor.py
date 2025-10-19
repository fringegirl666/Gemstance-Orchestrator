from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:3000", timeout=60000)

    # Wait for the page to load
    page.wait_for_selector('div:has-text("Cognitive Enhancements")', timeout=60000)

    print(page.content())

    # Find the switch for "Shock Factor"
    shock_factor_switch = page.get_by_role('switch', name='Shock Factor')
    shock_factor_switch.click()

    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)

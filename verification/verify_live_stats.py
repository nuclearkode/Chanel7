from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    # Navigate to the Lab page
    page.goto("http://localhost:9002/lab", timeout=60000)

    # Wait for the page to load and stabilize
    page.wait_for_load_state("networkidle")

    print("Step 1: Checking default view (Formula Editor)")
    # Check if Live Stats is visible
    live_stats = page.locator("aside", has_text="Live Analytics")
    expect(live_stats).to_be_visible()
    page.screenshot(path="verification/1_formula_editor.png")
    print("  - Live Stats visible: OK")

    print("Step 2: Switching to Visual Formula tab")
    # Click the Visual Formula tab
    page.get_by_role("tab", name="Visual Formula").click()
    page.wait_for_timeout(1000) # Wait for animation/transition

    # Check if Live Stats is hidden
    expect(live_stats).not_to_be_visible()
    page.screenshot(path="verification/2_visual_formula.png")
    print("  - Live Stats hidden: OK")

    print("Step 3: Switching to Analysis tab")
    # Click the Analysis tab
    page.get_by_role("tab", name="Analysis").click()
    page.wait_for_timeout(1000)

    # Check if Live Stats is visible again
    expect(live_stats).to_be_visible()
    page.screenshot(path="verification/3_analysis.png")
    print("  - Live Stats visible again: OK")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

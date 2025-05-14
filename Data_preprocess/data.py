import time
import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.get("https://tasty.co/latest")
time.sleep(3)
max_click = 40
click_count = 0
while click_count < max_click:
    try:
        show_more = driver.find_element(By.XPATH, '//button[text()="Show more"]')
        driver.execute_script("arguments[0].scrollIntoView(true);", show_more)
        show_more.click()
        time.sleep(2)
        click_count+=1
    except:
        break
soup = BeautifulSoup(driver.page_source, "html.parser")
cards = soup.select('.feed__items.list-unstyled > li')

recipe_data = []
recipe_links = []
for card in cards:
    link_tag = card.select_one('a[href^="/recipe/"]')
    img_tag = card.select_one('.feed-item__img-wrapper img')
    image_url = ""
    if link_tag and img_tag:
        recipe_link = "https://tasty.co" + link_tag['href']
        image_url = (
        img_tag.get("src") or
        img_tag.get("data-src") or
        img_tag.get("srcset", "").split(" ")[0]  # Gets first image in srcset
        )
        recipe_data.append((recipe_link, image_url))
        recipe_links.append(recipe_link)

print(f"Found {len(recipe_links)} recipes")
all_recipes = []
image_map = {link: img for link, img in recipe_data}

for idx, link in enumerate(recipe_links):
    print(f"Scraping {idx+1}/{len(recipe_links)}: {link}")
    try:
        driver.get(link)
        time.sleep(2)
        recipe_soup = BeautifulSoup(driver.page_source, "html.parser")

        name = recipe_soup.select_one("h1").text.strip() if recipe_soup.select_one("h1") else ""
        total_time = recipe_soup.select_one('[class*="recipe__time"]').text.strip() if recipe_soup.select_one('[class*="recipe__time"]') else ""
        servings = recipe_soup.select_one('[class*="recipe__yield"]').text.strip() if recipe_soup.select_one('[class*="recipe__yield"]') else ""

        ingredients = [li.text.strip() for li in recipe_soup.select(".ingredients__section .ingredient")]
        directions = [step.text.strip() for step in recipe_soup.select(".prep-steps li")]

        all_recipes.append({
            "recipe_name": name,
            "url": link,
            "total_time": total_time,
            "servings": servings,
            "ingredients": " | ".join(ingredients),
            "directions": " | ".join(directions)
        })
    except Exception as e:
        print(f"Failed to scrape {link}: {e}")

for recipe in all_recipes:
    recipe["img_src"] = image_map.get(recipe["url"], "")  
# Save to CSV
keys = all_recipes[0].keys() if all_recipes else []
with open("tasty_recipes.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=keys)
    writer.writeheader()
    writer.writerows(all_recipes)

driver.quit()
print("✅ Scraping completed. Saved to tasty_recipes.csv")


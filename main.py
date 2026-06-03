import requests
import re
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from bs4 import BeautifulSoup

app = FastAPI(title="ProSight Universal Scraper")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = "AIzaSyCAVgfnnL8Mjl2u1S86bTD8lP1USTNQ18M"
SCRAPER_API_KEY = "36cdac12eea54b3eb0e4fe3c6d4c609e" # Aapki nayi ScraperAPI Key

genai.configure(api_key=GEMINI_API_KEY)
ai_model = genai.GenerativeModel('gemini-2.5-flash')

def get_platform_data(url: str) -> dict:
    # ScraperAPI ke through request bhejna (Firewall bypass karne ke liye)
    payload = {
        'api_key': SCRAPER_API_KEY,
        'url': url,
        'country_code': 'in', # Indian proxy use karne ke liye
        'render': 'true'      # JavaScript load karne ke liye (Flipkart/Amazon ke liye zaroori)
    }
    
    try:
        response = requests.get('https://api.scraperapi.com/', params=payload)
        
        if response.status_code != 200:
             return {"error": f"Scraping Failed. Status Code: {response.status_code}"}
             
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Determine Platform
        platform = "Unknown"
        title = "Title not found"
        price_str = "0"
        price = 0.0

        if "amazon.in" in url.lower():
            platform = "Amazon India"
            title_tag = soup.find(id="productTitle")
            title = title_tag.get_text().strip() if title_tag else "Title not found"
            
            price_tag = soup.find("span", class_="a-price-whole")
            if price_tag:
                 price_str = price_tag.get_text().replace(',', '').strip()

        elif "flipkart.com" in url.lower():
             platform = "Flipkart"
             # Flipkart title class
             title_tag = soup.find("span", class_="VU-Tz5") 
             title = title_tag.get_text().strip() if title_tag else "Title not found"
             
             # Flipkart price class
             price_tag = soup.find("div", class_="Nx9bqj CxhGGd") 
             if price_tag:
                 price_str = price_tag.get_text().replace('₹', '').replace(',', '').strip()

        try:
             price = float(price_str)
        except ValueError:
             price = 0.0

        return {
            "Platform": platform,
            "Title": title,
            "Price": price,
            "Brand": "Extracted via ScraperAPI",
            "BuyBox_Owner": "N/A"
        }
        
    except Exception as e:
        return {"error": str(e)}

def calculate_margins(price: float, platform: str) -> dict:
    if price <= 0:
        return {"Selling_Price": "N/A", "Est_Net_Profit": "N/A", "ROI": "N/A"}
        
    # Standard FBA/Marketplace Fees (Estimate)
    fba_fee = 70
    closing_fee = 20
    
    # Flipkart's special zero-fee structure for items under ₹1000
    if platform == "Flipkart" and price <= 1000:
         referral_fee = 0 
    else:
         referral_fee = price * 0.10 # Standard 10% assumption for Amazon/Flipkart >1000
         
    net_profit = price - (referral_fee + fba_fee + closing_fee)
    
    return {
        "Selling_Price": f"₹{price}",
        "Est_Net_Profit": f"₹{round(net_profit, 2)}",
        "ROI": f"{round((net_profit / price) * 100, 2)}%" if price > 0 else "0%"
    }

def fix_title_with_ai(title: str) -> str:
    if not title or title == "Title not found":
        return "No title extracted to optimize."
    if len(title) > 150:
        return "Your title length is already well optimized."
    
    prompt = f"Act as an Expert SEO Copywriter. Rewrite this e-commerce title to be highly converting and under 200 characters: {title}"
    response = ai_model.generate_content(prompt)
    return response.text.strip()

@app.get("/analyze")
def analyze_listing(url: str):
    data = get_platform_data(url)
    if "error" in data:
        return {"Status": "Failed", "Message": data["error"]}

    financials = calculate_margins(data["Price"], data["Platform"])
    ai_title = fix_title_with_ai(data["Title"])
    
    return {
        "Status": "Success",
        "Core_Data": data,
        "Financials": financials,
        "AI_Fixer": {"Optimized_Title": ai_title}
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

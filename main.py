import requests
import json
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="ProSight AI Engine")

# CORS Policy: Ye Frontend ko permission deta hai API se baat karne ki
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Aapki API Keys
GEMINI_API_KEY = "AIzaSyCAVgfnnL8Mjl2u1S86bTD8lP1USTNQ18M"
RAINFOREST_API_KEY = "08E7B1F6E90940CE86724596428378F4"

# Configure AI
genai.configure(api_key=GEMINI_API_KEY)
ai_model = genai.GenerativeModel('gemini-2.5-flash')

def get_marketplace_data(url: str) -> dict:
    params = {
        "api_key": RAINFOREST_API_KEY,
        "type": "product",
        "url": url
    }
    try:
        response = requests.get('https://api.rainforestapi.com/request', params=params)
        data = response.json()
        
        if "product" not in data:
            return {"error": "Listing blocked or invalid URL"}
            
        product = data["product"]
        price = product.get("buybox_winner", {}).get("price", {}).get("value", 0)
        
        return {
            "Title": product.get("title", ""),
            "Price": price,
            "Brand": product.get("brand", "Unknown"),
            "BuyBox_Owner": product.get("buybox_winner", {}).get("merchant_info", {}).get("name", "Amazon")
        }
    except Exception as e:
        return {"error": str(e)}

def calculate_margins(price: float) -> dict:
    if price == 0:
        return {"Error": "Price data missing"}
        
    referral_fee = price * 0.10 # Avg 10%
    fba_fee = 70
    closing_fee = 20
    net_profit = price - (referral_fee + fba_fee + closing_fee)
    
    return {
        "Selling_Price": f"₹{price}",
        "Est_Net_Profit": f"₹{round(net_profit, 2)}",
        "ROI": f"{round((net_profit / price) * 100, 2)}%" if price > 0 else "0%"
    }

def fix_title_with_ai(title: str) -> str:
    if len(title) > 150:
        return "Your title length is well optimized."
    prompt = f"Act as an Expert Amazon SEO Copywriter. Rewrite this title to be highly converting, SEO friendly, and under 200 characters: {title}"
    response = ai_model.generate_content(prompt)
    return response.text.strip()

@app.get("/analyze")
def analyze_listing(url: str):
    """Main API Pipeline"""
    data = get_marketplace_data(url)
    if "error" in data:
        return {"Status": "Failed", "Message": data["error"]}

    financials = calculate_margins(data["Price"])
    ai_title = fix_title_with_ai(data["Title"])
    
    return {
        "Status": "Success",
        "Core_Data": data,
        "Financials": financials,
        "AI_Fixer": {"Optimized_Title": ai_title}
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

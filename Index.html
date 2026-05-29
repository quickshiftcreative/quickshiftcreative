<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-commerce Listing Analyzer PRO</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        darkbg: '#121212',
                        cardbg: '#1E1E1E',
                        gold: '#D4AF37',
                        goldlight: '#FFD700',
                    }
                }
            }
        }
    </script>

    <style>
        /* Custom Glowing & Animations */
        body {
            background-color: #121212;
            color: #ffffff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .gold-glow {
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
            border: 1px solid rgba(212, 175, 55, 0.5);
        }
        
        .gold-glow:hover {
            box-shadow: 0 0 25px rgba(255, 215, 0, 0.5);
            border: 1px solid #FFD700;
            transition: all 0.3s ease;
        }

        .gold-text-glow {
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        /* Circular Progress */
        .circular-chart {
            display: block;
            margin: 0 auto;
            max-width: 80%;
            max-height: 250px;
        }
        .circle-bg {
            fill: none;
            stroke: #333333;
            stroke-width: 3.8;
        }
        .circle {
            fill: none;
            stroke-width: 2.8;
            stroke-linecap: round;
            animation: progress 2s ease-out forwards;
        }
        @keyframes progress {
            0% { stroke-dasharray: 0 100; }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #121212; 
        }
        ::-webkit-scrollbar-thumb {
            background: #D4AF37; 
            border-radius: 4px;
        }
        
        /* Spinner */
        .loader {
            border: 4px solid #1E1E1E;
            border-top: 4px solid #FFD700;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="min-h-screen p-4 md:p-8">

    <header class="text-center mb-10">
        <h1 class="text-4xl md:text-5xl font-bold text-goldlight gold-text-glow mb-2">
            <i class="fa-solid fa-bolt text-gold"></i> OmniScan PRO
        </h1>
        <p class="text-gray-400 text-lg">E-commerce Listing Analyzer & Profitability Matrix</p>
    </header>

    <div class="max-w-3xl mx-auto mb-12 relative">
        <div class="flex flex-col md:flex-row gap-4">
            <div class="relative flex-grow">
                <i class="fa-solid fa-link absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input type="text" id="urlInput" placeholder="Paste Amazon, Flipkart, or Walmart URL here..." 
                    class="w-full bg-cardbg border-2 border-gray-700 focus:border-gold outline-none rounded-lg py-4 pl-12 pr-4 text-white transition-all shadow-lg">
            </div>
            <button onclick="analyzeListing()" class="bg-gradient-to-r from-gold to-goldlight text-black font-bold py-4 px-8 rounded-lg hover:opacity-90 transition-all gold-glow whitespace-nowrap">
                <i class="fa-solid fa-magnifying-glass mr-2"></i> Scan Listing
            </button>
        </div>
    </div>

    <div id="loadingState" class="hidden flex-col items-center justify-center py-20">
        <div class="loader mb-4"></div>
        <p class="text-gold animate-pulse text-lg tracking-widest">ANALYZING LISTING DATA...</p>
    </div>

    <div id="dashboard" class="hidden max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="cardbg rounded-xl p-6 gold-glow bg-cardbg md:col-span-2 flex flex-col md:flex-row gap-6 items-center">
            <div class="w-48 h-48 bg-darkbg rounded-lg border border-gray-700 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-image text-6xl text-gray-600"></i>
            </div>
            <div class="flex-grow">
                <div class="flex justify-between items-start mb-2">
                    <span class="bg-darkbg text-gold text-xs font-bold px-3 py-1 rounded-full border border-gold">Bestseller</span>
                    <span class="text-gray-400 text-sm"><i class="fa-solid fa-tag"></i> ID: <span id="mockId">B08FX...</span></span>
                </div>
                <h2 id="mockTitle" class="text-2xl font-bold text-white mb-3">Premium Noise Cancelling Headphones - Over Ear Bluetooth</h2>
                <div class="flex items-center gap-6 mb-4">
                    <div class="text-3xl font-bold text-goldlight" id="mockPriceDisplay">₹1,499</div>
                    <div class="text-gray-400"><i class="fa-solid fa-star text-gold"></i> 4.6 (12,403 ratings)</div>
                </div>
                <div class="text-sm text-gray-300">
                    <p><i class="fa-solid fa-trophy text-gold mr-2"></i> Category Rank: <strong>#4 in Electronics</strong></p>
                </div>
            </div>
        </div>

        <div class="cardbg rounded-xl p-6 gold-glow bg-cardbg flex flex-col items-center justify-center text-center">
            <h3 class="text-xl font-bold text-white mb-2"><i class="fa-solid fa-chart-pie text-gold mr-2"></i> Quality Score</h3>
            <div class="w-full relative">
                <svg viewBox="0 0 36 36" class="circular-chart gold">
                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path class="circle stroke-gold" stroke-dasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-white">
                    85<span class="text-sm text-gray-400">/100</span>
                </div>
            </div>
            <p class="text-sm text-gray-400 mt-2">Excellent. Add 2 more images to reach 100.</p>
        </div>

        <div class="cardbg rounded-xl p-6 gold-glow bg-cardbg md:col-span-2">
            <h3 class="text-xl font-bold text-white mb-4"><i class="fa-solid fa-magnifying-glass-chart text-gold mr-2"></i> Top Keywords Tracker</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-gray-300">
                    <thead class="text-xs text-gold uppercase bg-darkbg border-b border-gray-700">
                        <tr>
                            <th class="px-4 py-3 rounded-tl-lg">Keyword</th>
                            <th class="px-4 py-3">Search Volume</th>
                            <th class="px-4 py-3">Organic Rank</th>
                            <th class="px-4 py-3 rounded-tr-lg">Trend</th>
                        </tr>
                    </thead>
                    <tbody id="keywordTableBody">
                        </tbody>
                </table>
            </div>
        </div>

        <div class="cardbg rounded-xl p-6 gold-glow bg-cardbg">
            <h3 class="text-xl font-bold text-white mb-4"><i class="fa-solid fa-robot text-gold mr-2"></i> AI Action Items</h3>
            <ul class="space-y-4">
                <li class="flex items-start gap-3">
                    <i class="fa-solid fa-circle-check text-gold mt-1"></i>
                    <span class="text-sm text-gray-300">Extend bullet point #2 to include long-tail keyword "wireless over ear".</span>
                </li>
                <li class="flex items-start gap-3">
                    <i class="fa-solid fa-circle-check text-gold mt-1"></i>
                    <span class="text-sm text-gray-300">Add an A+ Content lifestyle image showing the product outdoors.</span>
                </li>
                <li class="flex items-start gap-3">
                    <i class="fa-solid fa-circle-check text-gold mt-1"></i>
                    <span class="text-sm text-gray-300">Title is 145 chars. Expand to 190 chars for better indexability.</span>
                </li>
            </ul>
        </div>

        <div class="cardbg rounded-xl p-6 gold-glow bg-cardbg md:col-span-3">
            <h3 class="text-xl font-bold text-white mb-4"><i class="fa-solid fa-calculator text-gold mr-2"></i> Profitability Matrix</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                
                <div>
                    <label class="block text-sm text-gray-400 mb-2">Platform</label>
                    <select id="calcPlatform" class="w-full bg-darkbg border border-gray-700 text-white rounded-lg p-3 outline-none focus:border-gold transition-colors">
                        <option value="amazon">Amazon</option>
                        <option value="flipkart">Flipkart</option>
                        <option value="walmart">Walmart</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm text-gray-400 mb-2">Selling Price (₹)</label>
                    <input type="number" id="calcSellingPrice" value="1499" class="w-full bg-darkbg border border-gray-700 text-white rounded-lg p-3 outline-none focus:border-gold transition-colors">
                </div>

                <div>
                    <label class="block text-sm text-gray-400 mb-2">Product Cost (₹)</label>
                    <input type="number" id="calcCost" value="500" placeholder="e.g. 500" class="w-full bg-darkbg border border-gray-700 text-white rounded-lg p-3 outline-none focus:border-gold transition-colors">
                </div>

                <div class="bg-darkbg p-4 rounded-lg border border-gold flex flex-col justify-center h-[74px]">
                    <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Net Profit</div>
                    <div class="text-2xl font-bold text-green-400" id="calcProfitResult">₹774.15</div>
                </div>
            </div>
            
            <div class="mt-4 text-xs text-gray-500 flex justify-between items-center">
                <p id="feeLogicText">* Default 15% platform fee applied.</p>
                <p>Profit Margin: <span id="calcMarginResult" class="text-gold font-bold">51.6%</span></p>
            </div>
        </div>

    </div>

    <script>
        // Mock Data
        const mockKeywords = [
            { kw: "noise cancelling headphones", vol: "145,200", rank: 4, trend: "up" },
            { kw: "wireless headphones", vol: "89,400", rank: 12, trend: "up" },
            { kw: "bluetooth headset", vol: "55,100", rank: 8, trend: "down" },
            { kw: "over ear headphones", vol: "42,300", rank: 2, trend: "up" },
            { kw: "gaming headphones", vol: "38,000", rank: 45, trend: "down" }
        ];

        // Main Search Action
        function analyzeListing() {
            const input = document.getElementById('urlInput').value;
            if(!input) {
                alert("Please paste a URL to analyze.");
                return;
            }

            // Hide Dashboard, Show Loader
            document.getElementById('dashboard').classList.add('hidden');
            document.getElementById('loadingState').classList.remove('hidden');
            document.getElementById('loadingState').classList.add('flex');

            // Simulate API Fetch (2 seconds)
            setTimeout(() => {
                populateDashboard();
                
                // Hide Loader, Show Dashboard
                document.getElementById('loadingState').classList.add('hidden');
                document.getElementById('loadingState').classList.remove('flex');
                document.getElementById('dashboard').classList.remove('hidden');
                
                calculateProfit(); // Trigger initial calc
            }, 2000);
        }

        function populateDashboard() {
            // Render Keywords
            const tbody = document.getElementById('keywordTableBody');
            tbody.innerHTML = '';
            
            mockKeywords.forEach((item, index) => {
                const trendIcon = item.trend === 'up' 
                    ? '<i class="fa-solid fa-arrow-trend-up text-green-500"></i>' 
                    : '<i class="fa-solid fa-arrow-trend-down text-red-500"></i>';
                
                const row = `
                    <tr class="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                        <td class="px-4 py-3 font-medium text-white">${item.kw}</td>
                        <td class="px-4 py-3">${item.vol}</td>
                        <td class="px-4 py-3 text-gold">#${item.rank}</td>
                        <td class="px-4 py-3">${trendIcon}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        // Profitability Calculator Logic
        const calcPlatform = document.getElementById('calcPlatform');
        const calcSellingPrice = document.getElementById('calcSellingPrice');
        const calcCost = document.getElementById('calcCost');
        
        calcPlatform.addEventListener('change', calculateProfit);
        calcSellingPrice.addEventListener('input', calculateProfit);
        calcCost.addEventListener('input', calculateProfit);

        function calculateProfit() {
            const platform = calcPlatform.value;
            const price = parseFloat(calcSellingPrice.value) || 0;
            const cost = parseFloat(calcCost.value) || 0;
            let fee = 0;
            let feeText = "* Default 15% platform fee applied.";

            // CRITICAL LOGIC: Flipkart fee waiver for items under 1000
            if (platform === 'flipkart' && price < 1000) {
                fee = 0;
                feeText = "* Flipkart Promo Applied: ₹0 commission for items under ₹1000.";
            } else {
                fee = price * 0.15; // 15% standard placeholder fee
            }

            const netProfit = price - cost - fee;
            let margin = 0;
            if(price > 0) margin = (netProfit / price) * 100;

            // Update UI
            document.getElementById('feeLogicText').innerText = feeText;
            
            const profitEl = document.getElementById('calcProfitResult');
            profitEl.innerText = `₹${netProfit.toFixed(2)}`;
            if (netProfit < 0) {
                profitEl.classList.remove('text-green-400');
                profitEl.classList.add('text-red-400');
            } else {
                profitEl.classList.remove('text-red-400');
                profitEl.classList.add('text-green-400');
            }

            document.getElementById('calcMarginResult').innerText = `${margin.toFixed(1)}%`;
        }
    </script>
</body>
</html>

import fs from "fs";
import path from "path";

const skylinePath = "c:/Users/HP/OneDrive/Desktop/grand Theft Auto 6/public/img/hero-vice-skyline-hd.jpg";
let skylineBase64 = "";
if (fs.existsSync(skylinePath)) {
  skylineBase64 = fs.readFileSync(skylinePath).toString("base64");
}
const skylineDataUri = `data:image/jpeg;base64,${skylineBase64}`;

const artifactHtmlPath = "C:/Users/HP/.gemini/antigravity/brain/1865355f-e74f-4a79-9c11-16863f3f9c92/live_preview.html";

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GTA 6 Atlas — Live Hero Preview</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
</head>
<body class="bg-[#090d16] text-[#F5F7FC] antialiased p-2 sm:p-4 font-sans">
  <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090d16] min-h-[640px] flex flex-col justify-between shadow-2xl">
    
    <!-- 1. CINEMATIC BACKGROUND CANVAS (Vice City Skyline) -->
    <div class="pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none">
      <div class="absolute inset-0 bg-[#090d16]"></div>
      <img src="${skylineDataUri}" alt="Vice City Skyline" class="absolute inset-0 w-full h-full object-cover object-center" />
      <div class="absolute inset-0 bg-[#090d16]/40"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-[#090d16]/60 via-transparent to-[#090d16]/80"></div>
      <div class="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#090d16] to-transparent"></div>
      <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#090d16] to-transparent"></div>
    </div>

    <!-- Top Status Bar -->
    <div class="relative z-20 flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3 backdrop-blur-md">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full border border-pink-500/40 bg-pink-950/60 px-2.5 py-0.5 text-[11px] font-bold text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)]">
          <span class="h-2 w-2 rounded-full bg-pink-400 animate-ping"></span>
          LIVE LOCAL DEV: http://localhost:3000
        </span>
      </div>
      <a href="http://localhost:3000" target="_blank" rel="noreferrer" class="inline-flex items-center gap-1 text-xs font-bold text-pink-400 hover:text-pink-300 hover:underline">
        Open in New Tab &rarr;
      </a>
    </div>

    <!-- 2. MAIN HERO CONTENT (Centered Transparent Countdown with Vice City Neon Palette) -->
    <div class="relative z-10 mx-auto w-full max-w-4xl flex flex-col items-center justify-center flex-1 py-12 px-4 sm:px-6 text-center">
      
      <!-- Countdown Component -->
      <div class="w-full max-w-2xl sm:max-w-3xl bg-transparent select-none">
        
        <!-- Header Bar -->
        <div class="pb-3.5 border-b border-white/15 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <p class="font-mono text-xs font-black uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 drop-shadow-[0_2px_10px_rgba(244,114,182,0.35)]">
              RELEASE TIMELINE
            </p>
            <span class="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-pink-400 bg-pink-950/40 border border-pink-500/30 rounded-full px-2.5 py-0.5 backdrop-blur-md shadow-[0_0_12px_rgba(236,72,153,0.2)]">
              <span class="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"></span>
              LIVE
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-black/40 border border-white/15 text-slate-200 backdrop-blur-md">
              <span class="text-pink-400">🌍</span> <span>My Time</span>
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-black/40 border border-white/15 text-slate-200 backdrop-blur-md">
              <span class="text-pink-400">📋</span> <span>Share</span>
            </span>
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-pink-500/25">
              <span>📅</span> <span>Remind Me</span>
            </span>
          </div>
        </div>

        <!-- 4-Column Responsive Digit Grid (Vice City Neon Accents) -->
        <div class="grid grid-cols-4 gap-2.5 sm:gap-4 py-5 text-center">
          <div class="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-pink-500/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.2)] transition-all">
            <span class="font-mono tabular-nums text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] drop-shadow-[0_0_24px_rgba(236,72,153,0.3)]">
              608
            </span>
            <span class="mt-2.5 font-mono text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-pink-400/90 drop-shadow">
              DAYS
            </span>
            <span class="mt-1 text-[9px] sm:text-[10px] text-slate-300/70 font-mono hidden sm:inline-block">
              86.9 Wks
            </span>
          </div>

          <div class="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-pink-500/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.2)] transition-all">
            <span class="font-mono tabular-nums text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] drop-shadow-[0_0_24px_rgba(236,72,153,0.3)]">
              11
            </span>
            <span class="mt-2.5 font-mono text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-pink-400/90 drop-shadow">
              HOURS
            </span>
            <span class="mt-1 text-[9px] sm:text-[10px] text-slate-300/70 font-mono hidden sm:inline-block">
              14,603 Total
            </span>
          </div>

          <div class="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-pink-500/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.2)] transition-all">
            <span class="font-mono tabular-nums text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] drop-shadow-[0_0_24px_rgba(236,72,153,0.3)]">
              45
            </span>
            <span class="mt-2.5 font-mono text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-pink-400/90 drop-shadow">
              MINUTES
            </span>
            <span class="mt-1 text-[9px] sm:text-[10px] text-slate-300/70 font-mono hidden sm:inline-block">
              876,225 Total
            </span>
          </div>

          <div class="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-pink-500/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.2)] transition-all">
            <span class="font-mono tabular-nums text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] drop-shadow-[0_0_24px_rgba(236,72,153,0.3)]">
              22
            </span>
            <span class="mt-2.5 font-mono text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-pink-400/90 drop-shadow">
              SECONDS
            </span>
            <span class="mt-1 text-[9px] sm:text-[10px] text-slate-300/70 font-mono hidden sm:inline-block">
              52,573,500 Total
            </span>
          </div>
        </div>

        <!-- Percentage Completion Progress Bar (Vice City Neon Palette) -->
        <div class="pt-4 border-t border-white/15 space-y-2.5">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="text-pink-400">✨</span>
              <span class="font-black uppercase tracking-wider text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-purple-200 drop-shadow">
                Journey to Leonida
              </span>
            </div>
            <div class="flex items-center gap-2.5 font-mono text-xs">
              <span class="text-slate-300/80 text-[11px] hidden sm:inline drop-shadow">
                473d elapsed / 608d to go
              </span>
              <span class="font-black text-sm sm:text-base text-pink-400 tabular-nums drop-shadow-[0_0_12px_rgba(236,72,153,0.4)]">
                43.8% <span class="text-[10px] font-normal text-slate-300/70">Complete</span>
              </span>
            </div>
          </div>

          <!-- The Animated Progress Track -->
          <div class="relative w-full h-3 rounded-full bg-black/50 border border-white/15 overflow-hidden backdrop-blur-sm p-0.5 shadow-inner">
            <div class="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 via-pink-500 to-rose-400 relative shadow-[0_0_15px_rgba(236,72,153,0.5)]" style="width: 43.8%">
              <div class="absolute inset-0 bg-white/35 animate-pulse"></div>
            </div>
          </div>

          <!-- Milestone Labels -->
          <div class="flex items-center justify-between text-[11px] font-mono text-slate-300/80 drop-shadow-sm">
            <span>Reveal Trailer (Dec 2023)</span>
            <span class="text-pink-300 font-bold drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]">Current Intel</span>
            <span>Target Launch (Nov 2026)</span>
          </div>
        </div>

        <!-- Footer Note -->
        <div class="pt-3 text-center">
          <p class="font-mono text-[10px] sm:text-[11px] text-slate-400 font-medium drop-shadow-sm">
            Anticipated window • Date to be confirmed by Rockstar Games
          </p>
        </div>
      </div>

      <!-- Action Buttons Centered Below Countdown -->
      <div class="flex flex-wrap items-center justify-center gap-4 pt-6">
        <a
          href="http://localhost:3000/map"
          target="_blank"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 px-7 py-3.5 text-sm font-black text-white transition-all shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 active:scale-95"
        >
          <span>Explore the Atlas</span>
          <span>&rarr;</span>
        </a>

        <a
          href="http://localhost:3000/map-explorer"
          target="_blank"
          class="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-black/40 hover:bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition-all backdrop-blur-md hover:border-pink-400/50 active:scale-95 shadow-sm"
        >
          <span>Open Interactive Map</span>
          <span class="text-pink-300">🗺️</span>
        </a>
      </div>

    </div>

    <!-- 3. Bottom Quick-Access Feature Bar -->
    <div class="relative z-10 w-full border-t border-white/10 pt-4 px-6 pb-4 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
        <div class="flex items-center gap-3 justify-center md:justify-start">
          <span class="text-pink-400 text-lg">📰</span>
          <div>
            <div class="text-xs font-bold text-white">Latest stories</div>
            <div class="text-[11px] text-slate-400">News, leaks and analysis</div>
          </div>
        </div>
        <div class="flex items-center gap-3 justify-center md:justify-start md:border-l md:border-white/10 md:pl-6">
          <span class="text-pink-400 text-lg">🚗</span>
          <div>
            <div class="text-xs font-bold text-white">Vehicle database</div>
            <div class="text-[11px] text-slate-400">Cars, bikes, boats and more</div>
          </div>
        </div>
        <div class="flex items-center gap-3 justify-center md:justify-start md:border-l md:border-white/10 md:pl-6">
          <span class="text-pink-400 text-lg">🗺️</span>
          <div>
            <div class="text-xs font-bold text-white">Interactive map</div>
            <div class="text-[11px] text-slate-400">Explore Vice City</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</body>
</html>
`;

fs.writeFileSync(artifactHtmlPath, htmlContent, "utf-8");
console.log("Updated live_preview.html with Vice City neon colors successfully!");

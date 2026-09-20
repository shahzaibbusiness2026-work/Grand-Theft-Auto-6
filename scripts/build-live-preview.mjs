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
        <div class="pb-3.5 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 sm:gap-3">
            <p class="font-mono text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#00F0FF] drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">
              RELEASE TIMELINE
            </p>
            <span class="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/50 rounded-full px-3 py-0.5 backdrop-blur-md shadow-[0_0_12px_rgba(0,240,255,0.25)]">
              <span class="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]"></span>
              LIVE
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 border border-white/20 text-white backdrop-blur-md shadow-sm">
              <span class="text-[#00F0FF]">🕒</span> <span>MY TIME</span>
            </span>
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 border border-white/20 text-white backdrop-blur-md shadow-sm">
              <span class="text-[#00F0FF]">⧉</span> <span>SHARE</span>
            </span>
            <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#00D2FF] to-[#0066FF] text-white shadow-[0_0_20px_rgba(0,210,255,0.45)]">
              <span>📅</span> <span>REMIND ME</span>
            </span>
          </div>
        </div>

        <!-- 4-Column Responsive Digit Grid (Frosted Glass Cards with Cyan Accents) -->
        <div class="grid grid-cols-4 gap-2.5 sm:gap-4 py-4 text-center">
          <div class="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-[#00F0FF]/60 transition-all">
            <span class="font-sans tabular-nums text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              608
            </span>
            <span class="mt-2.5 sm:mt-3 font-mono text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
              DAYS
            </span>
            <span class="mt-1.5 text-[11px] sm:text-xs text-white/80 font-mono font-medium drop-shadow">
              3.4M Watching
            </span>
          </div>

          <div class="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-[#00F0FF]/60 transition-all">
            <span class="font-sans tabular-nums text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              11
            </span>
            <span class="mt-2.5 sm:mt-3 font-mono text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
              HOURS
            </span>
            <span class="mt-1.5 text-[11px] sm:text-xs text-white/80 font-mono font-medium drop-shadow">
              14,603 Total
            </span>
          </div>

          <div class="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-[#00F0FF]/60 transition-all">
            <span class="font-sans tabular-nums text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              45
            </span>
            <span class="mt-2.5 sm:mt-3 font-mono text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
              MINUTES
            </span>
            <span class="mt-1.5 text-[11px] sm:text-xs text-white/80 font-mono font-medium drop-shadow">
              876,225 Total
            </span>
          </div>

          <div class="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-[#00F0FF]/60 transition-all">
            <span class="font-sans tabular-nums text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              22
            </span>
            <span class="mt-2.5 sm:mt-3 font-mono text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
              SECONDS
            </span>
            <span class="mt-1.5 text-[11px] sm:text-xs text-white/80 font-mono font-medium drop-shadow">
              52,573,500 Total
            </span>
          </div>
        </div>

        <!-- Percentage Completion Progress Bar (Journey to Leonida) -->
        <div class="pt-3 space-y-2.5">
          <div class="flex items-center justify-between text-xs sm:text-sm">
            <div class="flex items-center gap-2">
              <span class="text-[#00F0FF] text-base -rotate-45 inline-block drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">✈</span>
              <span class="font-black uppercase tracking-wider text-xs sm:text-sm text-white drop-shadow">
                JOURNEY TO LEONIDA
              </span>
            </div>
            <div class="flex items-center gap-2 sm:gap-3 font-mono text-xs sm:text-sm">
              <span class="text-slate-300 font-medium hidden sm:inline drop-shadow">
                473d elapsed / 608d to go
              </span>
              <span class="font-bold text-sm sm:text-base text-[#00F0FF] tabular-nums drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]">
                43.8%
              </span>
              <span class="text-white font-medium text-xs sm:text-sm drop-shadow">
                Complete
              </span>
            </div>
          </div>

          <!-- The Animated Progress Track with Glowing Thumb Knob -->
          <div class="relative w-full h-2.5 sm:h-3 rounded-full bg-black/60 border border-white/20 backdrop-blur-md p-0 shadow-inner flex items-center">
            <div class="h-full rounded-full bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] shadow-[0_0_15px_#00F0FF] relative flex items-center justify-end" style="width: 43.8%">
              <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border-2 border-[#00D2FF] shadow-[0_0_12px_#00F0FF] z-10"></div>
            </div>
          </div>

          <!-- Milestone Labels -->
          <div class="flex items-center justify-between text-[11px] sm:text-xs font-medium text-slate-300 drop-shadow-sm">
            <span>Reveal Trailer (Dec 2023)</span>
            <span class="text-[#00F0FF] font-semibold drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">Current Intel</span>
            <span>Target Launch (Nov 2026)</span>
          </div>
        </div>

        <!-- Footer Note -->
        <div class="pt-3 text-center">
          <p class="text-[11px] sm:text-xs text-slate-300/80 font-medium drop-shadow-sm">
            Anticipated window • Date to be confirmed by Rockstar Games
          </p>
        </div>
      </div>

      <!-- Action Buttons Centered Below Countdown -->
      <div class="flex flex-wrap items-center justify-center gap-4 pt-6">
        <a
          href="http://localhost:3000/map"
          target="_blank"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00D2FF] via-[#00A3FF] to-[#0066FF] hover:from-[#38BDF8] hover:to-[#0055EE] px-8 py-3.5 text-sm sm:text-base font-bold text-white transition-all shadow-[0_0_30px_rgba(0,210,255,0.45)] hover:shadow-[0_0_40px_rgba(0,210,255,0.7)] active:scale-95"
        >
          <span>Explore the Atlas</span>
          <span>&rarr;</span>
        </a>

        <a
          href="http://localhost:3000/map-explorer"
          target="_blank"
          class="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/25 bg-black/60 hover:bg-black/80 px-8 py-3.5 text-sm sm:text-base font-bold text-white transition-all backdrop-blur-xl hover:border-[#00F0FF]/60 active:scale-95 shadow-lg"
        >
          <span>Open Interactive Map</span>
          <span class="text-[#00F0FF]">🗺️</span>
        </a>
      </div>

    </div>

    <!-- 3. Bottom Quick-Access Feature Bar -->
    <div class="relative z-10 w-full border-t border-white/10 pt-4 px-6 pb-4 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
        <div class="flex items-center gap-3 justify-center md:justify-start">
          <span class="text-[#00F0FF] text-lg">📰</span>
          <div>
            <div class="text-xs font-bold text-white">Latest stories</div>
            <div class="text-[11px] text-slate-400">News, leaks and analysis</div>
          </div>
        </div>
        <div class="flex items-center gap-3 justify-center md:justify-start md:border-l md:border-white/10 md:pl-6">
          <span class="text-[#00F0FF] text-lg">🚗</span>
          <div>
            <div class="text-xs font-bold text-white">Vehicle database</div>
            <div class="text-[11px] text-slate-400">Cars, bikes, boats and more</div>
          </div>
        </div>
        <div class="flex items-center gap-3 justify-center md:justify-start md:border-l md:border-white/10 md:pl-6">
          <span class="text-[#00F0FF] text-lg">🗺️</span>
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
console.log("Updated live_preview.html with Electric Cyan & Blue colors successfully!");

// renderEngine.ts — Gemstance Orchestrator "Shock Factor" Stage FX Command Center
// EchoField Display 🜂 ASCII frame generator + event service
// Tanya Maria + ChatGPT
import { EventEmitter } from "events";

export type EffectEvent = {
  id: string;
  name: string;
  type?: string;
  intensity?: number;
  durationMs?: number;
  text?: string;
  timestamp?: string;
};

export type FramePayload = {
  asciiLines: string[];
  themeHint?: string;
  meta?: { intensity?: number; bpm?: number };
};

// internal animation counter
let tick = 0;

// main frame generator ---------------------------------------------------------
export function generateFrame(
  event: EffectEvent,
  mode: "pulse" | "wordfire" = "pulse",
  fullView = false
): FramePayload {
  const cols = fullView ? 80 : 40;
  const rows = fullView ? 24 : 12;
  const intensity = Math.min(1, Math.max(0, event.intensity ?? 0.8));
  const asciiLines: string[] = [];

  if (mode === "pulse") {
    const mid = Math.floor(rows / 2);
    const pulseChars = ["░", "▒", "▓", "█"];
    for (let r = 0; r < rows; r++) {
      let line = "";
      for (let c = 0; c < cols; c++) {
        const offset = Math.sin((c / cols) * Math.PI * 2 + tick / 6);
        const y = Math.floor(Math.abs(offset) * mid);
        if (r > mid - y && r < mid + y) {
          const idx = Math.floor(
            Math.abs(Math.sin(c / 8 + tick / 10)) * (pulseChars.length - 1)
          );
          line += pulseChars[idx];
        } else {
          line += " ";
        }
      }
      asciiLines.push(line);
    }
  } else {
    const fireChars = [".", "•", "*", "✦", "✹", "✷", " "];
    const baseText = event.text ?? " GEMSTANCE  ORCHESTRATOR  ";
    const flameIntensity = ((Math.sin(tick / 5) + 1) / 2) * intensity;
    for (let r = 0; r < rows; r++) {
      let line = "";
      for (let c = 0; c < cols; c++) {
        let char = " ";
        const heat = flameIntensity * Math.max(0, (rows - r) / rows);
        if (r > rows - 4 && c > 5 && c < 5 + baseText.length && r === rows - 3) {
          char = baseText[c - 6] || " ";
        } else if (Math.random() < Math.max(0.01, heat * 0.06)) {
          char =
            fireChars[Math.floor(Math.random() * (fireChars.length - 1))];
        }
        line += char;
      }
      asciiLines.push(line);
    }
  }

  tick++;
  return { asciiLines, meta: { intensity } };
}

// simple in-app event bus ------------------------------------------------------
export const visualizerBus = new EventEmitter();

/**
 * handleEffectEvent
 * feed any Stage FX EffectEvent into the ASCII generator
 * and broadcast a new FramePayload on "frame"
 */
export function handleEffectEvent(
  evt: EffectEvent,
  mode: "pulse" | "wordfire" = "pulse",
  fullView = false
) {
  const frame = generateFrame(evt, mode, fullView);
  visualizerBus.emit("frame", frame);
}

// example helper for manual testing -------------------------------------------
if (require.main === module) {
  console.clear();
  let count = 0;
  const demoEvt: EffectEvent = { id: "demo", name: "pulse", intensity: 0.8 };
  setInterval(() => {
    handleEffectEvent(demoEvt, count % 20 < 10 ? "pulse" : "wordfire");
    count++;
  }, 100);
  visualizerBus.on("frame", (f: FramePayload) => {
    console.clear();
    console.log(f.asciiLines.join("\n"));
  });
}











import { STAGGER } from "@/lib/motion";

type Line = { text: string; accent?: boolean };

/**
 * The hero headline builds itself: words rise 24px and fade in, 70ms apart (pure CSS, so it plays on
 * first paint). Once landed, hovering or tapping a word lifts it 2px and turns it signal coral.
 * With reduced motion the words simply appear in place.
 */
export function HeroHeadline({ lines, className = "", startDelay = 80 }: { lines: Line[]; className?: string; startDelay?: number }) {
  let i = 0;
  return (
    <h1 className={className}>
      {lines.map((line, l) => (
        <span key={l} className="block">
          {line.text.split(" ").map((word, w, words) => {
            const delay = startDelay + i++ * STAGGER.words;
            return (
              <span key={w}>
                <span
                  data-hero-word=""
                  className={`inline-block animate-word-in transition-[translate,color] duration-150 ease-spring hover:-translate-y-0.5 active:-translate-y-0.5 ${
                    line.accent ? "text-coral hover:text-coral-ink active:text-coral-ink" : "hover:text-coral active:text-coral"
                  }`}
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {word}
                </span>
                {w < words.length - 1 ? " " : null}
              </span>
            );
          })}
          {/* Keeps a space between lines for the accessible name and copied text. */}
          {l < lines.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}

/** Delay (ms) for content that should follow a headline of `wordCount` words. */
export function afterHeadline(wordCount: number, extra = 0, startDelay = 80) {
  return startDelay + wordCount * STAGGER.words + 60 + extra;
}

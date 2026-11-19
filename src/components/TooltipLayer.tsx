import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Tip {
  text: string;
  x: number;
  y: number;
  placement: 'top' | 'bottom' | 'right';
}

const SHOW_DELAY = 350;
const GAP = 8;

/**
 * App-wide styled tooltips. Any element with a `title` (or `data-tip`) gets a modern tooltip
 * instead of the browser's native one: on hover/focus the `title` is moved to `data-tip` so the
 * native tooltip never appears. If the element had no other accessible name, the text is copied
 * to `aria-label` first so screen readers still announce it. Touch input is ignored.
 * Add `data-tip-side="right"` to open the tooltip to the right (e.g. the collapsed sidebar).
 */
export function TooltipLayer() {
  const [tip, setTip] = useState<Tip | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const current = useRef<HTMLElement | null>(null);
  const bubble = useRef<HTMLDivElement>(null);
  // Horizontal centre of the bubble after measuring its real width, so it never leaves the screen.
  const [center, setCenter] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!tip || !bubble.current) return setCenter(null);
    if (tip.placement === 'right') return setCenter(tip.x);
    const w = bubble.current.offsetWidth;
    const margin = 8;
    setCenter(Math.min(window.innerWidth - margin - w / 2, Math.max(margin + w / 2, tip.x)));
  }, [tip]);

  useEffect(() => {
    const adopt = (el: HTMLElement): string | null => {
      const title = el.getAttribute('title');
      if (title) {
        if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.textContent?.trim()) {
          el.setAttribute('aria-label', title);
        }
        el.setAttribute('data-tip', title);
        el.removeAttribute('title');
      }
      return el.getAttribute('data-tip');
    };

    const findTarget = (node: EventTarget | null) =>
      node instanceof Element ? (node.closest('[title], [data-tip]') as HTMLElement | null) : null;

    const show = (el: HTMLElement) => {
      const text = adopt(el);
      if (!text) return;
      current.current = el;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        if (current.current !== el || !el.isConnected) return;
        const r = el.getBoundingClientRect();
        if (el.dataset.tipSide === 'right') {
          setTip({ text, x: r.right + GAP + 2, y: r.top + r.height / 2, placement: 'right' });
          return;
        }
        const placement = r.top > 44 ? 'top' : 'bottom';
        setTip({ text, x: r.left + r.width / 2, y: placement === 'top' ? r.top - GAP : r.bottom + GAP, placement });
      }, SHOW_DELAY);
    };

    const hide = () => {
      window.clearTimeout(timer.current);
      current.current = null;
      setTip(null);
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const el = findTarget(e.target);
      if (!el) {
        if (current.current) hide();
        return;
      }
      if (el !== current.current) show(el);
    };
    const onOut = (e: PointerEvent) => {
      const el = current.current;
      if (el && !(e.relatedTarget instanceof Node && el.contains(e.relatedTarget))) hide();
    };
    const onFocus = (e: FocusEvent) => {
      const el = findTarget(e.target);
      if (el && (e.target as HTMLElement).matches?.(':focus-visible')) show(el);
    };

    document.addEventListener('pointerover', onOver, true);
    document.addEventListener('pointerout', onOut, true);
    document.addEventListener('focusin', onFocus, true);
    document.addEventListener('focusout', hide, true);
    document.addEventListener('pointerdown', hide, true);
    document.addEventListener('keydown', hide, true);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => {
      document.removeEventListener('pointerover', onOver, true);
      document.removeEventListener('pointerout', onOut, true);
      document.removeEventListener('focusin', onFocus, true);
      document.removeEventListener('focusout', hide, true);
      document.removeEventListener('pointerdown', hide, true);
      document.removeEventListener('keydown', hide, true);
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
      window.clearTimeout(timer.current);
    };
  }, []);

  if (!tip) return null;
  const side = tip.placement === 'right';
  const x = center ?? tip.x;
  // Arrow stays on the target even when the bubble is shifted; keep it off the rounded corners.
  const w = bubble.current?.offsetWidth ?? 0;
  const arrowShift = Math.max(-(w / 2 - 12), Math.min(w / 2 - 12, tip.x - x));
  return createPortal(
    <div
      role="tooltip"
      className="pointer-events-none fixed z-[200] motion-safe:animate-[tipIn_.12s_ease-out]"
      style={{
        left: x,
        top: tip.y,
        transform: side ? 'translate(0, -50%)' : `translate(-50%, ${tip.placement === 'top' ? '-100%' : '0'})`,
        visibility: center === null ? 'hidden' : 'visible',
      }}
    >
      <div ref={bubble} className="relative w-max max-w-[min(280px,calc(100vw-16px))] rounded-lg bg-slate-900 px-2.5 py-1.5 text-center text-xs font-medium leading-snug text-white shadow-lg ring-1 ring-white/10 [overflow-wrap:anywhere]">
        {tip.text}
        {side ? (
          <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-slate-900" />
        ) : (
          <span
            className={`absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900 ${tip.placement === 'top' ? '-bottom-1' : '-top-1'}`}
            style={{ marginLeft: arrowShift }}
          />
        )}
      </div>
    </div>,
    document.body,
  );
}

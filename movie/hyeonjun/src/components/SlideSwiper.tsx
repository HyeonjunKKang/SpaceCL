import React, { useEffect, useMemo, useRef, useState } from 'react';

type FlowSliderProps = {
  children: React.ReactNode[]; // 흘러갈 아이템들
  speed?: number; // px/초 (기본 40)
  direction?: 'left' | 'right'; // 흐르는 방향 (기본 left)
  gap?: number; // 아이템 간격(px) 기본 16
  pauseOnHover?: boolean; // 호버 시 일시정지 (기본 true)
  className?: string;
};

const FlowSlider: React.FC<FlowSliderProps> = ({
  children,
  speed = 100,
  direction = 'left',
  gap = 16,
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null); // 원본 1세트 측정용
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const [containerW, setContainerW] = useState(0);
  const [contentW, setContentW] = useState(0); // 원본 1세트의 전체 폭
  const [offset, setOffset] = useState(0); // 현재 이동량(px)
  const [running, setRunning] = useState(true);

  // 자식들을 배열로 고정
  const items = useMemo(() => React.Children.toArray(children) as React.ReactNode[], [children]);

  // ======= 폭 측정 (컨테이너/콘텐츠) =======
  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const updateSizes = () => {
      setContainerW(container.clientWidth);
      // measureRef는 원본 1세트만 감싸고 있어서 scrollWidth로 전체 폭 측정
      setContentW(measure.scrollWidth);
    };

    updateSizes();

    const ro1 = new ResizeObserver(updateSizes);
    const ro2 = new ResizeObserver(updateSizes);
    ro1.observe(container);
    ro2.observe(measure);

    return () => {
      ro1.disconnect();
      ro2.disconnect();
    };
  }, [items.length, gap]);

  // ======= rAF 애니메이션 =======
  useEffect(() => {
    // 접근성: 사용자가 모션 최소화를 선호하면 정지
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setRunning(false);
      setOffset(0);
      return;
    }

    const step = (ts: number) => {
      if (!running) {
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const last = lastTsRef.current ?? ts;
      const dt = (ts - last) / 1000; // 초
      lastTsRef.current = ts;

      if (contentW <= 0) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const dir = direction === 'left' ? 1 : -1;
      let next = offset + dir * speed * dt;

      // 무한 루프: 이동량을 원본 1세트 폭 기준으로 모듈러
      // 왼쪽 흐름이면 -translateX가 증가해야 하므로 offset을 증가시키고,
      // translateX는 -offset으로 적용한다.
      if (next >= contentW) next -= contentW;
      if (next <= -contentW) next += contentW;

      setOffset(next);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [running, speed, contentW, direction, offset]);

  // 탭이 비활성화되면 일시정지
  useEffect(() => {
    const onVis = () => setRunning(r => (document.hidden ? false : r));
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // 컨테이너를 최소 2세트 이상, 보통은 2~3세트로 채워서 빈틈 방지
  const repeatCount = useMemo(() => {
    if (contentW === 0 || containerW === 0) return 2;
    // 컨테이너*2를 커버하도록 반복 수 계산(여유를 위해 +1)
    return Math.max(2, Math.ceil((containerW * 2) / contentW) + 1);
  }, [contentW, containerW]);

  // 트랙 이동값(왼쪽 흐름이면 -offset)
  const translateX = direction === 'left' ? -offset : -offset;

  // 아이템 렌더(간격 적용, 줄어들지 않도록 shrink-0)
  const renderItems = (prefixKey: string) =>
    items.map((child, i) => (
      <div key={`${prefixKey}-${i}`} className="shrink-0" style={{ marginRight: gap }}>
        {child}
      </div>
    ));

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full ${className ?? ''}`}
      onMouseEnter={() => pauseOnHover && setRunning(false)}
      onMouseLeave={() => pauseOnHover && setRunning(true)}
      role="region"
      aria-roledescription="marquee"
    >
      {/* 측정용 1세트 (화면에는 겹치지만, 아래 트랙과 동일한 내용) */}
      <div
        ref={measureRef}
        className="absolute -z-10 invisible pointer-events-none whitespace-nowrap flex"
      >
        {renderItems('m')}
      </div>

      {/* 실제 트랙: 여러 세트를 이어붙여 빈틈 없이 */}
      <div
        className="flex  will-change-transform"
        style={{
          transform: `translateX(${translateX}px)`,
        }}
      >
        {Array.from({ length: repeatCount }).map((_, r) => (
          <div key={r} className="flex">
            {renderItems(`r${r}`)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowSlider;

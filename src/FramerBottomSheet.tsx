import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { PanInfo, motion, useAnimation, useMotionValue } from 'framer-motion';
import { createPortal } from 'react-dom';

import { usePreventScroll } from './hooks/usePreventScroll';
import React from 'react';
import { FramerBottomSheetType, SnapType } from './sheetType';

const FramerBottomSheet: FramerBottomSheetType = (
  {
    initialPosition = 'bottom',
    onOpenEnd,
    onCloseEnd,
    header = true,
    headerElement,
    footerElement,
    snapPoint,
    bottomScrollLock = false,
    children,
    style,
    portalContainer,
    dragTransition,
    dragMomentum,
    dragConstraints,
    ...props
  },
  externalRef
) => {
  const [position, setPosition] = useState(initialPosition);
  const [footerHeight, setFooterHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const maxHeight = snapPoint.top.height;
  const minHeight = snapPoint.bottom.height;
  const initialY = initialPosition === 'top' ? 0 : maxHeight - minHeight;
  const containerY = useMotionValue(initialY);

  const heightVariantMemo = useMemo(() => {
    return {
      top: { y: `0px` },
      bottom: { y: `${maxHeight - minHeight}px` },
    };
  }, [maxHeight, minHeight]);

  const { lastTouchScrollTopRef } = usePreventScroll({
    scrollRef,
    bottomScrollLock,
    position,
  });
  useImperativeHandle(externalRef, () => ({
    snapTo: (position: SnapType) => {
      setPosition(position);
    },
    getPosition: () => {
      return position;
    },
    getContentScrollTop: () => {
      return lastTouchScrollTopRef.current;
    },
    contentScrollTo: scrollValue => {
      if (scrollRef.current && scrollRef.current.scrollHeight) {
        scrollRef.current.scrollTop = scrollValue;
      }
    },
    getElements: () => {
      return {
        containerRef: containerRef.current,
        headerRef: headerRef.current,
        scrollRef: scrollRef.current,
        contentRef: contentRef.current,
        footerRef: footerRef.current,
      };
    },
  }));
  // 각 포지션에 맞게 containerY value init
  const handleClose = async (event: MouseEvent | TouchEvent | PointerEvent) => {
    setPosition('bottom');
    controls.start('bottom');
    onCloseEnd && (await onCloseEnd(event));
    containerY.set(maxHeight);
  };
  const handleOpen = async (event: MouseEvent | TouchEvent | PointerEvent) => {
    setPosition('top');
    controls.start('top');
    onOpenEnd && (await onOpenEnd(event));
    containerY.set(0);
  };
  const handleSlow = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    yValue: number
  ) => {
    // 'top' 스냅포인트와 'bottom' 스냅포인트까지의 거리 계산
    const distanceToTop = Math.abs(yValue - 0);
    const distanceToBottom = Math.abs(yValue - (maxHeight - minHeight));
    if (distanceToTop < distanceToBottom) {
      await handleOpen(event);
    } else {
      await handleClose(event);
    }
  };
  const onDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const speedY = info.velocity.y;
    const yValue = containerY.get();
    const shouldClose = speedY > 30;
    const shouldOpen = speedY < -30;
    if (shouldClose) {
      await handleClose(event);
    } else if (shouldOpen) {
      await handleOpen(event);
    } else {
      handleSlow(event, yValue);
    }
  };

  //드래그 속도가 느릴 때 가까운 스냅포인트를 계산하기위한 y set - 실제 애니메이션에는 쓰이지않음
  const onDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    { delta }: PanInfo
  ) => {
    containerY.set(Math.max(containerY.get() + delta.y, 0));
  };

  //footer의 높이만큼 시트의 bottom에 할당
  useLayoutEffect(() => {
    if (footerRef.current && footerElement) {
      setFooterHeight(footerRef.current.scrollHeight);
    }
  }, [footerElement]);

  //열고 닫기
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);
  useLayoutEffect(() => {
    controls.start(position);
  }, [controls, position]);
  // motion.div initial Property bug로 인해 대신 사용하는 초기 포지션 설정
  useLayoutEffect(() => {
    if (initialPosition === 'bottom') {
      controls.start(initialPosition, { duration: 0 });
    } else {
      controls.start(initialPosition, { duration: 0 });
    }
  }, [controls, initialPosition]);

  return (
    <>
      {createPortal(
        <>
          <motion.div
            data-container-ref
            ref={containerRef}
            drag={'y'}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            animate={controls}
            variants={heightVariantMemo}
            dragConstraints={
              dragConstraints ?? {
                top: 0,
                bottom: maxHeight - minHeight,
              }
            }
            dragMomentum={dragMomentum ?? false}
            dragElastic={{ top: 0, bottom: 0 }}
            dragTransition={
              dragTransition ?? { min: 0, max: 0, bounceStiffness: 400 }
            }
            transition={{
              type: 'just',
            }}
            style={{
              position: 'fixed',
              left: '0',
              display: 'flex',
              width: '100vw',
              overflow: 'hidden',
              userSelect: 'auto',
              flexDirection: 'column',
              overscrollBehavior: 'none',
              borderRadius: '1.5rem 1.5rem 0 0',
              boxShadow: '0 -3px 7px 0 rgba(0,0,0,0.1)',
              zIndex: 3,
              height: maxHeight,
              bottom: footerHeight ?? 0,
              ...style,
            }}
            {...props}
          >
            {header && (
              <div
                data-header-ref
                ref={headerRef}
                style={{
                  height: 'fit-content',
                  flexShrink: 0,
                  textAlign: 'center',
                }}
              >
                {headerElement}
              </div>
            )}
            <motion.div
              data-scroll-ref
              onPointerDownCapture={e => {
                if (scrollRef.current && scrollRef.current.scrollTop !== 0) {
                  e.stopPropagation();
                }
              }}
              ref={scrollRef}
              style={{
                WebkitOverflowScrolling: 'touch',
                userSelect: 'auto',
                overscrollBehavior: 'contain',
                height: '100%',
                flexGrow: 1,
                overflow:
                  bottomScrollLock && position === 'bottom' ? 'hidden' : 'auto',
              }}
            >
              <div data-content-ref ref={contentRef}>
                {children}
              </div>
            </motion.div>
          </motion.div>
          {footerElement && (
            <div
              ref={footerRef}
              data-footer-ref
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                zIndex: 10,
                height: 'fit-content',
                width: '100%',
                flexShrink: 0,
              }}
            >
              {footerElement}
            </div>
          )}
        </>,
        portalContainer ?? document.body
      )}
    </>
  );
};
const FramerBottomSheetRef = forwardRef(FramerBottomSheet);
export { FramerBottomSheetRef as FramerBottomSheet };

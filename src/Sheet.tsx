import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { PanInfo, motion, useAnimation } from 'framer-motion';
import { createPortal } from 'react-dom';

import { usePreventScroll } from './hooks/usePreventScroll';
import './style.css';
import { FramerBottomSheetType, SnapType } from './sheetType';
import React from 'react';

const Sheet: FramerBottomSheetType = (
  {
    initialPosition = 'bottom',
    onOpenEnd,
    onCloseEnd,
    header = true,
    headerElement,
    snapPoint,
    bottomScrollLock = false,
    children,
    style,
    portalContainer,
  },
  externalRef
) => {
  const [position, setPosition] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const maxHeight = snapPoint.top.height;
  const minHeight = snapPoint.bottom.height;

  const heightVariantMemo = useMemo(() => {
    return {
      top: { y: `0px` },
      bottom: { y: `${maxHeight - minHeight}px` },
    };
  }, [maxHeight, minHeight]);

  usePreventScroll({
    scrollRef,
    bottomScrollLock,
    position,
    header,
  });

  useImperativeHandle(externalRef, () => ({
    snapTo: (position: SnapType) => {
      setPosition(position);
    },
    getPosition: () => {
      return position;
    },
  }));

  const handleClose = async (event: MouseEvent | TouchEvent | PointerEvent) => {
    setPosition('bottom');
    controls.start('bottom');
    onCloseEnd && (await onCloseEnd(event));
  };

  const handleOpen = async (event: MouseEvent | TouchEvent | PointerEvent) => {
    setPosition('top');
    controls.start('top');
    onOpenEnd && (await onOpenEnd(event));
  };

  const handleRestorePosition = () => {
    controls.start(position);
  };

  const onDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const speedY = info.velocity.y;
    const shouldClose = speedY > 45;
    const shouldOpen = speedY < -45;
    if (shouldClose) {
      await handleClose(event);
    } else if (shouldOpen) {
      await handleOpen(event);
    } else {
      handleRestorePosition();
    }
  };

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);
  //열고 닫기
  useEffect(() => {
    controls.start(position);
  }, [controls, position]);

  return (
    <>
      {createPortal(
        <motion.div
          data-container-ref
          ref={containerRef}
          onDragEnd={onDragEnd}
          drag={'y'}
          initial={position}
          animate={controls}
          variants={heightVariantMemo}
          dragConstraints={{
            top: 0,
            bottom: maxHeight - minHeight,
          }}
          dragMomentum={false}
          dragElastic={{ top: 0, bottom: 0 }}
          dragTransition={{ min: 0, max: 0, bounceStiffness: 400 }}
          transition={{
            type: 'just',
          }}
          className={`fixed bottom-0 left-0  z-[3] flex w-screen select-auto flex-col overflow-hidden overscroll-none rounded-t-3xl shadow-[0_-3px_7px_0_rgba(0,0,0,0.1)]`}
          style={{
            height: maxHeight,
            ...style,
          }}
        >
          {header && (
            <div data-header-ref className=" h-fit shrink-0 text-center">
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
            className={`h-full shrink-0 grow select-auto overscroll-contain 
                        ${
                          bottomScrollLock && position === 'bottom'
                            ? 'overflow-hidden'
                            : 'overflow-auto'
                        }
                       `}
          >
            <div data-content-ref ref={contentRef}>
              {children}
            </div>
          </motion.div>
        </motion.div>,
        portalContainer ?? document.body
      )}
    </>
  );
};
const FramerBottomSheetRef = forwardRef(Sheet);
export { FramerBottomSheetRef as Sheet };

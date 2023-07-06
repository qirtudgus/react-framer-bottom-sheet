import React, {
  ForwardRefRenderFunction,
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
} from 'react';

import { motion } from 'framer-motion';
export type SnapType = 'top' | 'bottom';

export interface FramerBottomSheetRefHandles {
  /**
   * 포지션을 스냅할 때 사용
   * @param position 'top' or 'bottom'
   */
  snapTo: (position: SnapType) => void;
  /**
   * 시트의 현재 포지션
   * @returns 'top' | 'bottom'
   */
  getPosition: () => string;
  /**
   * content ScrollTop Value
   * @returns number
   */
  getContentScrollTop: () => number | undefined;
  /**
   * set content scrollTop
   * @param scrollValue
   */
  contentScrollTo: (scrollValue: number) => void;
  /**
   * 시트를 구성하는 HTMLDivElement 반환
   */
  getElements: () => {
    containerRef: HTMLDivElement | null;
    headerRef: HTMLDivElement | null;
    scrollRef: HTMLDivElement | null;
    contentRef: HTMLDivElement | null;
    footerRef: HTMLDivElement | null;
  };
}
export type FramerBottomSheetRef = FramerBottomSheetRefHandles;
export type FramerBottomSheetProps = React.ComponentPropsWithoutRef<
  typeof motion.div
> &
  PropsWithChildren & {
    /**
     * 바텀시트 렌더링 시 초기 위치
     * @default ['bottom']
     * ```jsx
     * <FramerBottomSheet3 initialPostion={'top'}>
     * ```
     */
    initialPosition: SnapType;
    /**
     * 바텀시트가 열린 후 실행될 콜백 함수
     * ```jsx
     * <FramerBottomSheet3 onOpenEnd={()=>{setState(true)}}>
     * ```
     */
    onOpenEnd?: (event?: MouseEvent | TouchEvent | PointerEvent) => void;
    /**
     * 바텀시트가 닫힌 후 실행될 콜백 함수
     * ```jsx
     * <FramerBottomSheet3 onCloseEnd={()=>{setState(true)}}>
     * ```
     */
    onCloseEnd?: (event?: MouseEvent | TouchEvent | PointerEvent) => void;
    /**
     * 바텀시트가 언마운트 될 때 실행될 함수
     */
    onMount?: () => void;
    /**
     * 바텀시트가 언마운트 될 때 실행될 함수
     */
    onUnmount?: (scrollTop: number) => void;
    /**
     * header component
     */
    headerElement?: ReactNode;
    /**
     * footer component
     */
    footerElement?: ReactNode;
    /**
     * bottom일때와 top일때의 스냅포인트
     */
    snapPoint: { top: { height: number }; bottom: { height: number } };
    /**
     * 바텀시트가 내려가있을때 content scrollLock 여부
     * header가 없을 경우 true를 주면 시트가 핸들링됨
     * @default [false]
     */
    bottomScrollLock?: boolean;
    style?: React.CSSProperties;
    /**
     * createPortal Container
     * @default document.body
     */
    portalContainer?: Element | DocumentFragment;
  };
export interface UsePreventScrollProps {
  scrollRef: MutableRefObject<HTMLElement | null>;
  bottomScrollLock: boolean;
  position: SnapType;
}
export type FramerBottomSheetType = ForwardRefRenderFunction<
  FramerBottomSheetRefHandles,
  FramerBottomSheetProps
>;

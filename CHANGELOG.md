# Changelog

framer motion bottom sheet

## [0.1.9] 2023-07-24

### Fix

- fix portalContainer Bug
  - portalContainer 전달 시 포지션이 제대로 렌더링되지않던 버그 수정
- fix bottomScrollLock Bug
  - 초기 포지션이 'bottom'일때 잘못된 scrollRef를 참조하던 버그 수정

## [0.1.8] 2023-07-08

### Feature

- add touchmoveEvent preventDefault to footerElement
- add velocity value properties to recognize when opening and closing sheets
  - openVelocity?: number
  - closeVelocity?: number
- containerRef dragDirectionLock property default set true

### Refactor

- Improveed drag animation by using event control instead of overflow
- Improved performance by replacing useState, which manages position status, with useRef

## [0.1.7] 2023-07-06

### Feature / Fix

- add containerRef 'will-change' css property
- add onMount, onUnmount
  - onMount?: () => void
  - onUnmount?: (scrollTop:number) => void
- add useWindowSizeHook
- fixed Bottom sheet location correspondence according to browser
- refactor containerY : useMotionValue -> useRef
- refactor snapTo logic
- refactor lastScrollTopRef
  - addEventListener.scroll record scrollTop
- del header property

불필요한 effect를 덜어내고
시트의 위치가 브라우저 리사이징에 따라 조정되도록 했다.

## [0.1.61] 2023-07-05

### Fix

- fixed a bug where two footer components were rendered

## [0.1.6] 2023-07-05

### Feature / Fix

- fixed a bug that did not drag during initial bottom sheet rendering
- add useImperativeHandle method

## [0.1.53] 2023-07-03

### Feature

- add README

## [0.1.3] 2023-07-03

### Feature

- add Props FooterElement
- rename Sheet.tsx -> FramerBottomSheet.tsx
- add example TestPage
- add dragTransition property

## [0.1.2] 2023-07-03

### Fixed

- Sheet.tsx tailwind className 삭제

import { useState, useEffect, useCallback } from "react";

const usePan = (svgRef) => {
  const [viewBox, setViewBox] = useState(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [pointerOrigin, setPointerOrigin] = useState({});
  const [panActive, setPanActive] = useState(false);
  const [panning, setPanning] = useState(false);
  const [scale, setScale] = useState(100);

  const handleKeyDown = (e) => {
    if (e.keyCode === 32) {
        setPanActive(true);
    }
  }

  const handleKeyUp = (e) => {
    if (e.keyCode === 32)
        setPanActive(false);
  }

  const getPointFromEvent = useCallback((event) => {
  
    const svg = svgRef.current;
    var point = svg.createSVGPoint();

    // If even is triggered by a touch event, we get the position of the first finger
    if (event.targetTouches) {
      point.x = event.targetTouches[0].clientX;
      point.y = event.targetTouches[0].clientY;
    } else {
      point.x = event.clientX;
      point.y = event.clientY;
    }
    
    // We get the current transformation matrix of the SVG and we inverse it
    var invertedSVGMatrix = svg.getScreenCTM().inverse();
    
    return point.matrixTransform(invertedSVGMatrix);
  }, [svgRef])

  const handleZoom = useCallback((event) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    event.returnValue = false;
    const svg = svgRef.current;
    const viewBox = svg.viewBox.baseVal;
    const pointerPosition = getPointFromEvent(event);
    const s = (event.deltaY < 0) ? 0.95 : 1.05;

    const dx = (pointerPosition.x - viewBox.x) * (s - 1);
    const dy = (pointerPosition.y - viewBox.y) * (s - 1);

    viewBox.x -= dx
    viewBox.y -= dy
    viewBox.width *= s;
    viewBox.height *= s;
    setScale(scale * s);
    return false;
  }, [getPointFromEvent, svgRef, scale])

  //const handleWindowResize = (e) => {
    // const svg = svgRef.current;
    // const viewBox = svg.viewBox.baseVal;

    // let editor = document.getElementById('editor-container');
    // if (editor) {
    //     let width = editor.offsetWidth;
    //     let height = editor.offsetHeight;
    //     viewBox.width = width;
    //     viewBox.height = height;
    // }
  //}

  useEffect(() => {
    
    const zoomOptions = {
        passive: false,
        capture: true
    }

    // window.addEventListener('resize', handleWindowResize);
    // window.addEventListener('orientationchange', handleWindowResize);
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('wheel', handleZoom, zoomOptions);

    return () => {
        // window.removeEventListener('resize', handleWindowResize);
        // window.removeEventListener('orientationchange', handleWindowResize);
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
        document.removeEventListener('wheel', handleZoom);
    }
      
  }, [handleZoom]);

  useEffect(() => {
    const svg = svgRef.current;
    const viewBox = svg.viewBox.baseVal;

    let editor = document.getElementById('editor-container');
    if (editor) {
        let width = editor.offsetWidth;
        let height = editor.offsetHeight;
        viewBox.width = width;
        viewBox.height = height;
    }

    setViewBox(viewBox);
  }, [svgRef]);

  const onPointerUp = () => {
    setIsPointerDown(false);
    setPanning(false);
  }

  const onPointerDown = (event) => {
    const pointerOrigin = getPointFromEvent(event);
    setIsPointerDown(true);
    setPanning(panActive);
    setPointerOrigin(pointerOrigin);
  }

  const onPointerMove = (event) => {

    // Only run this function if the pointer is down
    if (!isPointerDown || !panActive) {
      return;
    }

    // This prevent user to do a selection on the page
    //event.preventDefault();
  
    // Get the pointer position as an SVG Point
    var pointerPosition = getPointFromEvent(event);
  
    // Update the viewBox variable with the distance from origin and current position
    // We don't need to take care of a ratio because this is handled in the getPointFromEvent function
    viewBox.x -= (pointerPosition.x - pointerOrigin.x);
    viewBox.y -= (pointerPosition.y - pointerOrigin.y);

  }

  return { 
    viewBox, 
    scale: scale,
    panActive: panActive,
    panning: panning,
    panPointerMove: onPointerMove, 
    panPointerUp: onPointerUp,
    panPointerDown: onPointerDown,
    setPanActive: setPanActive,
    getPointFromEvent: getPointFromEvent
  };
};

export default usePan;
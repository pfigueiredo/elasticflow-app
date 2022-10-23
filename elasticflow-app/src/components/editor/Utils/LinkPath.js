
 const spreadTable = [
          [0], 
         [0,0],
        [0,1,0],
       [0,1,1,0],
      [0,1,2,1,0],
     [0,1,2,2,1,0],
    [0,1,2,3,2,1,0],
 ]
 
 function generateLinkPath(origX, origY, destX, destY, index, total) {
     let coordinates = {
         start: { x: origX, y: origY },
         end: { x: destX, y: destY },                                
     };
 
     const distanceX = coordinates.end.x - coordinates.start.x;
     const distanceY = coordinates.end.y - coordinates.start.y;
 
     let spreadBase = 0;
     if (total > 2) {
        spreadBase = total - 1 -index;
        if (spreadTable.length > (total) && Math.abs(distanceY) < 50) {
            spreadBase = spreadTable[total - 1][index];
        }
     }

     let indexSpread = spreadBase * 8;
     let stem = 16;
     let tolerance = 16;
     const grids = 8;
 
     const radius = 1; //props.roundCorner ? 1 : 0;
 
     const stepX = distanceX / grids;
     const stepY = distanceY / grids;
 
     if (stem >= Math.abs(distanceX)) {
         stem = Math.abs(distanceX) - Math.abs(stepX);
     }
 
    let step = Math.min(Math.abs(stepX), Math.abs(stepY));
         
    function lineT1C() {
        let path = `
            M ${coordinates.start.x} ${coordinates.start.y}
            c ${stem} 0 ${-stem} ${distanceY} ${distanceX} ${distanceY}
        `;
        return path;
    }

    

    function lineT1S() {

        const factor = distanceX * distanceY > 0 ? 1 : -1;

        let path = `
        M ${coordinates.start.x} ${coordinates.start.y} 
        h ${stem + indexSpread} 
        q ${step * radius} 0 ${step * 1 * radius} ${step * factor * radius}
        V ${coordinates.end.y - step * factor * radius}
        q 0 ${step * factor * radius} ${step * radius} ${step * factor * radius}
        H ${coordinates.end.x}
        `;
        return path;
    }

    function lineT1() {
        let path = `
            M ${coordinates.start.x} ${coordinates.start.y}
            h ${stem + indexSpread}
            v ${distanceY}
            H ${coordinates.end.x}
        `;
        return path;
    }

    function lineT2S() {

        const factor = 1;

        const turnPoint = 
            (distanceY <= 40) ? 20 :
            (distanceY <= 48) ? 24 : 32;
        let path = `
            M ${coordinates.start.x} ${coordinates.start.y}
            h ${stem + indexSpread}
            q ${step * radius} 0 ${step * 1 * radius} ${step * radius}
            v ${distanceY - turnPoint}
            q ${step * -radius} 0 ${-step * 1 * -radius} ${-step * radius}
            h ${distanceX - (stem * 2)}
            v ${turnPoint}
            H ${coordinates.end.x}
        `;
        return path;
    }


    function lineT2() {
        const turnPoint = 
            (distanceY <= 40) ? 20 :
            (distanceY <= 48) ? 24 : 32;
        let path = `
            M ${coordinates.start.x} ${coordinates.start.y}
            h ${stem + indexSpread}
            v ${distanceY - turnPoint}
            h ${distanceX - (stem * 2)}
            v ${turnPoint}
            H ${coordinates.end.x}
        `;
        return path;
    }

    function lineT3() {
        let path = `
            M ${coordinates.start.x} ${coordinates.start.y}
            h ${stem + indexSpread}
            v ${24}
            h ${distanceX - (stem * 2)}
            v ${distanceY -24}
            H ${coordinates.end.x}
        `;
        return path;
    }

    //  return corner34();
    

     if (distanceX > (stem + tolerance)) {
        return lineT1S();
     } else if (distanceY > 16) {
        return lineT2S();
     } else {
        return lineT3();
     }
 
 }
 
 export default generateLinkPath;

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
 
     const stepX = distanceX / grids;
     const stepY = distanceY / grids;
 
     if (stem >= Math.abs(distanceX)) {
         stem = Math.abs(distanceX) - Math.abs(stepX);
     }
 
    let step = Math.min(Math.abs(stepX), Math.abs(stepY));
    //step = grids * Math.round(step / grids);
    step = 8; //(Math.min(stepX, stepY) < 8) ? 0 : 8;

    function lineT1Q() {
        const qsize = (distanceX - ((stem) * 2)) / 4;
        
        let path = `
        M ${coordinates.start.x} ${coordinates.start.y} 
        h ${stem} 
        c ${qsize} 0, ${qsize} ${distanceY}, ${distanceX - (stem)} ${distanceY}
        H ${coordinates.end.x}
        `;
        return path;
    }

    function lineT1S() {
        const factor = distanceX * distanceY > 0 ? 1 : -1;

        let path = `
        M ${coordinates.start.x} ${coordinates.start.y} 
        h ${stem + indexSpread} 
        q ${step} 0 ${step} ${step * factor}
        V ${coordinates.end.y - step * factor}
        q 0 ${step * factor} ${step} ${step * factor}
        H ${coordinates.end.x}
        `;
        return path;
    }

    function lineT2S() {

        const turnPoint = 
            (distanceY <= 40) ? 20 :
            (distanceY <= 48) ? 24 : 32;

        let path = `
            M ${coordinates.start.x} ${coordinates.start.y}
            h ${stem + indexSpread}
            q ${step} 0 ${step} ${step}
            v ${distanceY - turnPoint - (step * 2)}
            q 0 ${step} ${-step} ${step}
            h ${distanceX - (stem * 2)}
            q ${-step} 0 ${-step} ${step}
            v ${turnPoint - (step * 2)}
            q 0 ${step} ${step} ${step}
            H ${coordinates.end.x}
        `;
        return path;
    }

    function lineT3S() {
        let path = `
            M ${coordinates.start.x} ${coordinates.start.y}
            h ${stem + indexSpread}
            q ${step} 0 ${step} ${step}
            v ${24 - (step * 2)}
            q 0 ${step} ${-step} ${step}
            h ${distanceX - (stem * 2 + step)}
            q ${-step} 0 ${-step} ${-step}
            v ${distanceY -(24 - (step * 2))}
            q 0 ${-step} ${step} ${-step}
            H ${coordinates.end.x}
        `;
        return path;
    }    

    if (distanceX > (stem + tolerance)) {
        if (Math.abs(distanceY) <= 8)
            return lineT1Q();
        else 
            return lineT1S();
     } else if (distanceY > 16) {
        return lineT2S();
     } else {
        //TODO: if -distanceX < size of activity we need a new S curve similar to T2S but inverted
        return lineT3S();
     }
 
 }
 
 export default generateLinkPath;
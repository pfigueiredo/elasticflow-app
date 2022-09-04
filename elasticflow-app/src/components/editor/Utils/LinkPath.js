/** Node.red *********************************************
 * some functions copied from the node.RED project
 *********************************************************/

 var lineCurveScale = 0.75;
 var default_node_height = 30;
 var default_node_width = 100;
 
 function generateLinkPath(origX, origY, destX, destY, sc, node_height, node_width) {
     let coordinates = {
         start: { x: origX, y: origY },
         end: { x: destX, y: destY },                                
     };
 
     const distanceX = coordinates.end.x - coordinates.start.x;
     const distanceY = coordinates.end.y - coordinates.start.y;
 
     let stem = 25;
     const grids = 10;
 
     const radius = 1; //props.roundCorner ? 1 : 0;
 
     const stepX = distanceX / grids;
     const stepY = distanceY / grids;
 
     if (stem >= Math.abs(distanceX)) {
         stem = Math.abs(distanceX) - Math.abs(stepX);
     }
 
     let step = Math.min(Math.abs(stepX), Math.abs(stepY));
 
     function corner12() {
         const factor = distanceX * distanceY >= 0 ? 1 : -1;
         const l2lFactor = 1;
     
         /**
          * -|-
          */
 
         const pathr2l = `M
                         ${coordinates.start.x} ${coordinates.start.y} 
                         h ${stem * l2lFactor}
                         q ${step * radius * l2lFactor} 0 
                         ${step * radius * l2lFactor} ${step * factor * radius}
                         V ${coordinates.end.y - step * factor * radius}
                         q ${0} ${step * factor * radius}
                         ${step * radius} ${step * factor * radius}
                         H ${coordinates.end.x}
                         `;
     
         let path = pathr2l; // default
         return path;
         }
     
     function corner21() {
         const factor = distanceX * distanceY >= 0 ? 1 : -1;
         const t2tFactor = 1;
     
         /** |-| */
 
         const pathb2t = `M
                         ${coordinates.start.x} ${coordinates.start.y} 
                         v ${stem * t2tFactor}
                         q  0 ${step * radius * t2tFactor}
                             ${step * factor * radius} ${step * radius * t2tFactor}
                         H ${coordinates.end.x - step * factor * radius}
                         q ${step * factor * radius} 0
                             ${step * factor * radius} ${step * radius}
                         V ${coordinates.end.y}
                         `;
     
         let path = pathb2t; // default
     
         return path;
     }
     
     function corner34() {
         const factor = distanceX * distanceY > 0 ? 1 : -1;
     
         /** -|-|- */
 
         let pathr2l = `M
                         ${coordinates.start.x} ${coordinates.start.y} 
                         h ${stem} 
                         q ${step * radius} 0 
                         ${step * radius} ${-step * factor * radius}
                         v ${distanceY / 2 + step * 2 * factor * radius}
                         q 0 ${-step * factor * radius}
                         ${-step * radius} ${-step * factor * radius}
                         h ${distanceX - stem * 2}
                         q ${-step * radius} 0
                         ${-step * radius} ${-step * factor * radius}
                         V ${coordinates.end.y + step * factor * radius}
                         q 0 ${-step * factor * radius}
                         ${step * radius} ${-step * factor * radius}
                         H ${coordinates.end.x}
                         `;
     
         let path = pathr2l; // default
     
         return path;
     }
         
     if (distanceX >= 50) {
         return corner12();
     } else {
         return corner34();
     }
 
 }
 
 function generateLinkPath_old(origX, origY, destX, destY, sc, node_height, node_width) {
     var dy = destY-origY;
     var dx = destX-origX;
     var delta = Math.sqrt(dy*dy+dx*dx);
     var scale = lineCurveScale;
     var scaleY = 0;
 
     node_height = node_height ?? default_node_height;
     node_width = node_width ?? default_node_width;
 
     if (dx*sc > 0) {
         if (delta < node_width) {
             scale = 0.75-0.75*((node_width-delta)/node_width);
         }
     } else {
         scale = 0.4-0.2*(Math.max(0,(node_width-Math.min(Math.abs(dx),Math.abs(dy)))/node_width));
     }
     if (dx*sc > 0) {
         return "M "+origX+" "+origY+
             " C "+(origX+sc*(node_width*scale))+" "+(origY+scaleY*node_height)+" "+
             (destX-sc*(scale)*node_width)+" "+(destY-scaleY*node_height)+" "+
             destX+" "+destY
     } else {
 
         var midX = Math.floor(destX-dx/2);
         var midY = Math.floor(destY-dy/2);
         //
         if (dy === 0) {
             midY = destY + node_height;
         }
         var cp_height = node_height/2;
         var y1 = (destY + midY)/2
         var topX =origX + sc*node_width*scale;
         var topY = dy>0?Math.min(y1 - dy/2 , origY+cp_height):Math.max(y1 - dy/2 , origY-cp_height);
         var bottomX = destX - sc*node_width*scale;
         var bottomY = dy>0?Math.max(y1, destY-cp_height):Math.min(y1, destY+cp_height);
         var x1 = (origX+topX)/2;
         var scy = dy>0?1:-1;
         var cp = [
             // Orig -> Top
             [x1,origY],
             [topX,dy>0?Math.max(origY, topY-cp_height):Math.min(origY, topY+cp_height)],
             // Top -> Mid
             // [Mirror previous cp]
             [x1,dy>0?Math.min(midY, topY+cp_height):Math.max(midY, topY-cp_height)],
             // Mid -> Bottom
             // [Mirror previous cp]
             [bottomX,dy>0?Math.max(midY, bottomY-cp_height):Math.min(midY, bottomY+cp_height)],
             // Bottom -> Dest
             // [Mirror previous cp]
             [(destX+bottomX)/2,destY]
         ];
         if (cp[2][1] === topY+scy*cp_height) {
             if (Math.abs(dy) < cp_height*10) {
                 cp[1][1] = topY-scy*cp_height/2;
                 cp[3][1] = bottomY-scy*cp_height/2;
             }
             cp[2][0] = topX;
         }
         return "M "+origX+" "+origY+
             " C "+
                cp[0][0]+" "+cp[0][1]+" "+
                cp[1][0]+" "+cp[1][1]+" "+
                topX+" "+topY+
             " S "+
                cp[2][0]+" "+cp[2][1]+" "+
                midX+" "+midY+
            " S "+
               cp[3][0]+" "+cp[3][1]+" "+
               bottomX+" "+bottomY+
             " S "+
                 cp[4][0]+" "+cp[4][1]+" "+
                 destX+" "+destY
     }
 }
 
 export default generateLinkPath;
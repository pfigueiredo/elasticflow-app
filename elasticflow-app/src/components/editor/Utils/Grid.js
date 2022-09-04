function snapToGrid (val, gridSize) {
    var snap_candidate = gridSize * Math.round(val/gridSize);
    return snap_candidate;
};

export default snapToGrid;
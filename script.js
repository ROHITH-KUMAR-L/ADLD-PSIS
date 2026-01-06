document.addEventListener('DOMContentLoaded', () => {
    const stackCellsContainer = document.getElementById('stack-cells');
    const spIndicator = document.getElementById('sp-indicator');
    const spValDisplay = document.getElementById('sp-val');
    const pushBtn = document.getElementById('push-btn');
    const popBtn = document.getElementById('pop-btn');
    const pushValueInput = document.getElementById('push-value');

    const MAX_CELLS = 10;
    const BOTTOM_ADDR = 2000;
    const STEP = 4;

    // SP starts ABOVE the bottom when stack is empty (no element to point to)
    let currentSP = BOTTOM_ADDR + STEP; // 2004 = empty stack
    let stackData = [];

    function init() {
        renderCells();
        updateSPUI();
    }

    function renderCells() {
        stackCellsContainer.innerHTML = '';
        for (let i = 0; i < MAX_CELLS; i++) {
            const cell = document.createElement('div');
            cell.className = 'stack-cell';
            cell.id = `cell-${i}`;
            // Display initial value if any
            cell.textContent = stackData[i] !== undefined ? stackData[i] : '';
            stackCellsContainer.appendChild(cell);
        }
    }

    function updateSPUI() {
        // SP always points to the TOP element (the last pushed item)
        // If stack is empty, SP is above BOTTOM (2004)

        if (stackData.length === 0) {
            // Stack is empty, hide SP indicator or show it off-screen
            spIndicator.style.bottom = `9px`;
            spIndicator.style.opacity = '0.3'; // Dim it when empty
        } else {
            spIndicator.style.opacity = '1'; // Full opacity when pointing to element

            // The top element is at stackData[stackData.length - 1]
            // Visual position: cells are in column-reverse, so index 0 is at bottom
            const topIndex = stackData.length - 1;

            // Each cell is 35px, and we want to point to the topIndex cell
            const pixelOffset = topIndex * 35;

            // Add bounds to prevent overlap
            const minBottom = 30; // Keep above BOTTOM label
            const maxBottom = (MAX_CELLS * 35) + 5; // Keep below ToP label area
            const calculatedBottom = Math.max(minBottom, Math.min(maxBottom, pixelOffset + 6));
            spIndicator.style.bottom = `${calculatedBottom}px`;
        }

        spValDisplay.textContent = currentSP;
    }

    function push() {
        if (stackData.length >= MAX_CELLS) {
            alert("Stack Overflow!");
            return;
        }

        const val = pushValueInput.value || "0";

        // PUSH: Decrement SP first, THEN store value
        // This ensures SP points to the newly stored element
        currentSP -= STEP; // SP now points to the new location
        stackData.push(val);

        renderCells();
        updateSPUI();

        // Highlight the new top cell
        const currentIdx = stackData.length - 1;
        const cell = document.getElementById(`cell-${currentIdx}`);
        if (cell) cell.style.backgroundColor = '#dbeafe';

        pushValueInput.value = Math.floor(Math.random() * 100); // randomize for fun
    }

    function pop() {
        if (stackData.length === 0) {
            alert("Stack Underflow!");
            return;
        }

        // POP: Read value at SP, THEN increment SP
        stackData.pop();
        currentSP += STEP; // SP moves away from the popped location

        renderCells();
        updateSPUI();
    }

    pushBtn.addEventListener('click', push);
    popBtn.addEventListener('click', pop);

    // Seed initial data from image (43, 739, 17, -28)
    const seed = [43, 739, 17, -28];
    seed.forEach(val => {
        currentSP -= STEP; // Decrement first
        stackData.push(val); // Then store
    });

    init();
});

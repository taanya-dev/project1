const totalSlots = 10;
const ratePerHour = 20;
let parkingData = new Map(); // Better than object for key-based storage

// Create parking slots dynamically
function createSlots() {
    const slotDiv = document.getElementById('slots');
    slotDiv.innerHTML = ""; // Reset if called again

    for (let i = 1; i <= totalSlots; i++) {
        let div = document.createElement('div');
        div.className = 'slot';
        div.id = 'slot' + i;
        div.innerText = 'Slot ' + i;
        slotDiv.appendChild(div);
    }
}

// Normalize vehicle number
function normalizeVehicleNumber(vnum) {
    return vnum.trim().toUpperCase();
}

// Validate vehicle number
function isValidVehicleNumber(vnum) {
    return vnum.length >= 3; // Basic validation (can improve regex later)
}

// Find first free slot
function findFreeSlot() {
    let occupiedSlots = new Set(
        Array.from(parkingData.values()).map(data => data.slot)
    );

    for (let i = 1; i <= totalSlots; i++) {
        if (!occupiedSlots.has(i)) {
            return i;
        }
    }
    return null;
}

// Park vehicle
function parkVehicle() {
    let input = document.getElementById('vehicleNumber');
    let vnum = normalizeVehicleNumber(input.value);

    if (!vnum) {
        showMessage("Please enter vehicle number!");
        return;
    }

    if (!isValidVehicleNumber(vnum)) {
        showMessage("Invalid vehicle number!");
        return;
    }

    if (parkingData.has(vnum)) {
        showMessage("Vehicle already parked!");
        return;
    }

    let freeSlot = findFreeSlot();

    if (!freeSlot) {
        showMessage("No slots available!");
        return;
    }

    parkingData.set(vnum, {
        slot: freeSlot,
        entryTime: new Date()
    });

    let slotDiv = document.getElementById('slot' + freeSlot);
    slotDiv.classList.add('occupied');
    slotDiv.innerText = `Slot ${freeSlot}\n${vnum}`;

    showMessage(`Vehicle parked at Slot ${freeSlot}`);

    input.value = "";
}

// Exit vehicle
function exitVehicle() {
    let input = document.getElementById('exitVehicleNumber');
    let vnum = normalizeVehicleNumber(input.value);

    if (!vnum) {
        showMessage("Please enter vehicle number!");
        return;
    }

    if (!parkingData.has(vnum)) {
        showMessage("Vehicle not found!");
        return;
    }

    let data = parkingData.get(vnum);
    let exitTime = new Date();

    let diffMs = exitTime - data.entryTime;

    if (diffMs < 0) {
        showMessage("Invalid time calculation!");
        return;
    }

    let hours = Math.ceil(diffMs / (1000 * 60 * 60));
    hours = Math.max(1, hours); // Minimum 1 hour charge

    let fee = hours * ratePerHour;

    let slotDiv = document.getElementById('slot' + data.slot);
    slotDiv.classList.remove('occupied');
    slotDiv.innerText = 'Slot ' + data.slot;

    parkingData.delete(vnum);

    showMessage(`Vehicle exited. Duration: ${hours} hour(s). Fee: ₹${fee}`);

    input.value = "";
}

// Display message
function showMessage(msg) {
    document.getElementById('message').innerText = msg;
}

// Initialize
createSlots();

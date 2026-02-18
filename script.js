const totalSlots = 10;
const ratePerHour = 20;

let parkingData = new Map();  // vehicleNumber → {slot, entryTime}
let freeSlotsQueue = [];      // Queue of free slots

// Initialize slots
function createSlots() {
    const slotContainer = document.getElementById('slots');
    slotContainer.innerHTML = "";
    freeSlotsQueue = [];

    for (let i = 1; i <= totalSlots; i++) {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'slot';
        slotDiv.id = 'slot' + i;
        slotDiv.innerText = 'Slot ' + i;
        slotContainer.appendChild(slotDiv);

        freeSlotsQueue.push(i); // Add slot to queue
    }
}

// Normalize vehicle number
function normalizeVehicleNumber(vnum) {
    return vnum.trim().toUpperCase();
}

// Basic validation
function isValidVehicleNumber(vnum) {
    return vnum.length >= 3;
}

// Park Vehicle
function parkVehicle() {
    const input = document.getElementById('vehicleNumber');
    let vnum = normalizeVehicleNumber(input.value);

    if (!vnum) {
        showMessage("Please enter vehicle number.");
        return;
    }

    if (!isValidVehicleNumber(vnum)) {
        showMessage("Invalid vehicle number.");
        return;
    }

    if (parkingData.has(vnum)) {
        showMessage("Vehicle already parked.");
        return;
    }

    if (freeSlotsQueue.length === 0) {
        showMessage("Parking Full. No slots available.");
        return;
    }

    let allocatedSlot = freeSlotsQueue.shift(); // O(1)

    parkingData.set(vnum, {
        slot: allocatedSlot,
        entryTime: new Date()
    });

    let slotDiv = document.getElementById('slot' + allocatedSlot);
    slotDiv.classList.add('occupied');
    slotDiv.innerText = `Slot ${allocatedSlot}\n${vnum}`;

    showMessage(`Vehicle parked at Slot ${allocatedSlot}`);
    input.value = "";
}

// Exit Vehicle
function exitVehicle() {
    const input = document.getElementById('exitVehicleNumber');
    let vnum = normalizeVehicleNumber(input.value);

    if (!vnum) {
        showMessage("Please enter vehicle number.");
        return;
    }

    if (!parkingData.has(vnum)) {
        showMessage("Vehicle not found.");
        return;
    }

    let vehicleData = parkingData.get(vnum);
    let exitTime = new Date();

    let diffMs = exitTime - vehicleData.entryTime;
    let hours = Math.ceil(diffMs / (1000 * 60 * 60));
    hours = Math.max(1, hours);  // Minimum 1 hour

    let fee = hours * ratePerHour;

    let slotDiv = document.getElementById('slot' + vehicleData.slot);
    slotDiv.classList.remove('occupied');
    slotDiv.innerText = 'Slot ' + vehicleData.slot;

    freeSlotsQueue.push(vehicleData.slot); // Return slot to queue
    parkingData.delete(vnum);

    showMessage(`Vehicle exited. Duration: ${hours} hour(s). Fee: ₹${fee}`);
    input.value = "";
}

// Show message
function showMessage(message) {
    document.getElementById('message').innerText = message;
}

// Initialize system
createSlots();

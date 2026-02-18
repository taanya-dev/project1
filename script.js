const totalSlots = 10;
let parkingData = {}; // vehicleNumber -> {slot, entryTime}

// Create parking slots
function createSlots() {
    const slotDiv = document.getElementById('slots');
    for (let i = 1; i <= totalSlots; i++) {
        let div = document.createElement('div');
        div.className = 'slot';
        div.id = 'slot' + i;
        div.innerText = 'Slot ' + i;
        slotDiv.appendChild(div);
    }
}

// Strict Indian Vehicle Format: KA01AB1234
function isValidVehicleNumber(vnum) {
    const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
    return regex.test(vnum);
}

// Find free slot
function findFreeSlot() {
    for (let i = 1; i <= totalSlots; i++) {
        if (!Object.values(parkingData).some(v => v.slot === i)) {
            return i;
        }
    }
    return null;
}

// Park vehicle
function parkVehicle() {
    let input = document.getElementById('vehicleNumber');
    let vnum = input.value.trim().toUpperCase();

    // Strict Indian format: KA01AB1234
    const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;

    if (!regex.test(vnum)) {
        showMessage("Invalid format! Use format: KA01AB1234");
        input.style.border = "2px solid red";
        return; // STOP execution
    }

    input.style.border = "2px solid green";

    if (vnum in parkingData) {
        showMessage("Vehicle already parked!");
        return;
    }

    let freeSlot = findFreeSlot();
    if (!freeSlot) {
        showMessage("No slots available!");
        return;
    }

    parkingData[vnum] = {
        slot: freeSlot,
        entryTime: new Date()
    };

    let slotDiv = document.getElementById('slot' + freeSlot);
    slotDiv.classList.add('occupied');
    slotDiv.innerText = `Slot ${freeSlot}\n${vnum}`;

    showMessage(`Vehicle parked at Slot ${freeSlot}`);
    input.value = "";
    input.style.border = "";
}


// Exit vehicle
function exitVehicle() {
    let vnum = document.getElementById('exitVehicleNumber').value.trim().toUpperCase();

    if (!vnum) {
        showMessage("Please enter vehicle number!");
        return;
    }

    if (!(vnum in parkingData)) {
        showMessage("Vehicle not found!");
        return;
    }

    let data = parkingData[vnum];
    let exitTime = new Date();
    let hours = Math.ceil((exitTime - data.entryTime) / (1000 * 60 * 60));
    let fee = Math.max(1, hours) * 20;

    let slotDiv = document.getElementById('slot' + data.slot);
    slotDiv.classList.remove('occupied');
    slotDiv.innerText = 'Slot ' + data.slot;

    delete parkingData[vnum];

    showMessage(`Vehicle exited. Fee: ₹${fee}`);
    document.getElementById('exitVehicleNumber').value = "";
}

// Show message
function showMessage(msg) {
    document.getElementById('message').innerText = msg;
}

createSlots();


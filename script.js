const totalSlots = 10;
let parkingData = {}; // vehicleNumber -> {slot, entryTime}

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

function findFreeSlot() {
    for (let i = 1; i <= totalSlots; i++) {
        if (!Object.values(parkingData).some(v => v.slot === i)) {
            return i;
        }
    }
    return null;
}

function parkVehicle() {
    let vnum = document.getElementById('vehicleNumber').value;

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
}

function exitVehicle() {
    let vnum = document.getElementById('exitVehicleNumber').value;

    if (!(vnum in parkingData)) {
        showMessage("Vehicle not found!");
        return;
    }

    let data = parkingData[vnum];
    let exitTime = new Date();
    let hours = Math.ceil((exitTime - data.entryTime) / (1000 * 60 * 60));
    let fee = hours * 20;

    let slotDiv = document.getElementById('slot' + data.slot);
    slotDiv.classList.remove('occupied');
    slotDiv.innerText = 'Slot ' + data.slot;

    delete parkingData[vnum];

    showMessage(`Vehicle exited. Fee: ₹${fee}`);
}

function showMessage(msg) {
    document.getElementById('message').innerText = msg;
}

createSlots();

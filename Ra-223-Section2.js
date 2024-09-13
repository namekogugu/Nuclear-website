function initializeDatepickers() {
    $("#Ref-date, #Cure-date").datepicker({
        autoclose: true,
        format: 'mm/dd/yyyy'
    }).on('changeDate', function(e) {
        console.log("Date changed:", $(this).attr('id'), $(this).datepicker('getFormattedDate'));
        calculateDateDifference();
    });
}

function calculateDateDifference() {
    var refDate = $('#Ref-date').datepicker('getDate');
    var cureDate = $('#Cure-date').datepicker('getDate');
    
    if (refDate && cureDate) {
        var timeDiff = cureDate - refDate;
        globalDayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        console.log("Calculated day difference:", globalDayDiff);
        document.getElementById('diffdays').textContent = globalDayDiff;
        return globalDayDiff;
    } else {
        console.log("Please select both dates");
        document.getElementById('diffdays').textContent = 'Please select both dates';
        return null;
    }
}

function decayFactor(dayDiff) {
    const negDecayFactor = [2.296, 2.161, 2.034, 1.914, 1.802, 1.696, 1.596, 1.502, 1.414, 1.33, 1.252, 1.178, 1.109, 1.044];
    const positiveDecayFactor = [0.982, 0.925, 0.87, 0.819, 0.771, 0.725, 0.683, 0.643, 0.605, 0.569, 0.536, 0.504, 0.475, 0.447, 0.42];
    let index;

    if (dayDiff <= -1 && dayDiff >= -14) {
        let count = dayDiff - (-14);
        index = negDecayFactor[count];
    } else if (dayDiff >= 0 && dayDiff <= 14) {
        index = positiveDecayFactor[dayDiff];
    } else {
        alert('日期差超過14或者-14天');
        return null;
    }

    document.getElementById('diffFactor').textContent = `${index.toFixed(3)}`;
    console.log("Decay factor calculated:", index);
    return index;
}

function calcDose() {
    let dayDiff = calculateDateDifference();
    if (dayDiff === null) return;

    let factor = decayFactor(dayDiff);
    if (factor === null) return;

    const weight = document.querySelector('#weight');
    const dose = document.querySelector('#TotalDose');
    const volume = document.querySelector('#DoseVolume');

    if (!weight.value) {
        alert('Please enter weight');
        return;
    }

    let totalDose = parseFloat(weight.value) * 55;
    dose.textContent = `${totalDose.toFixed(2)} kBq`;

    let totalVolume = (totalDose / (factor * 1100)).toFixed(2);
    volume.textContent = `${totalVolume} mL`;
    highlightCell(dayDiff);

    console.log("Calculate complete. Day Difference:", dayDiff, "Decay Factor:", factor);
}

function highlightCell(dayDiff) {
    // clear highlight 
    document.querySelectorAll('#decayTableBody td').forEach(cell => {
        cell.classList.remove('highlight');
    });

    let rowIndex, cellIndex;

    if (dayDiff < 0 && dayDiff >= -14) {
        rowIndex = dayDiff + 14; // negIndex
        cellIndex = 3; // negIndex 在第四列（index 3）
    } else if (dayDiff >= 0 && dayDiff <= 14) {
        rowIndex = dayDiff; // PositiveIndex
        cellIndex = 1; // PositiveIndex在第二列（index 1）
    } else {
        console.log("Day difference out of range:", dayDiff);
        return; // out of range 
    }

    const row = document.querySelector(`#decayTableBody tr:nth-child(${rowIndex + 1})`);
    if (row) {
        // highlight decay value
        const factorCell = row.querySelectorAll('td')[cellIndex];
        if (factorCell) {
            factorCell.classList.add('highlight');
        }

        // highlight diff day
        const dateCell = row.querySelectorAll('td')[cellIndex - 1];
        if (dateCell) {
            dateCell.classList.add('highlight');
        }

        console.log(`Highlighted cells: row ${rowIndex + 1}, column ${cellIndex + 1} (factor), column ${cellIndex} (date)`);
    } else {
        console.log(`Row not found: ${rowIndex + 1}`);
    }
}
// Add event listener for calculate button
document.querySelector('button[name="calc"]').addEventListener('click', function() {
    calcDose();
    console.log("Calculate button clicked");
});

// Add event listener for reset button
document.querySelector('button[name="rest"]').addEventListener('click', function() {
    document.getElementById('Ref-date').value = '';
    document.getElementById('Cure-date').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('diffdays').textContent = '';
    document.getElementById('diffFactor').textContent = '';
    document.getElementById('TotalDose').textContent = '';
    document.getElementById('DoseVolume').textContent = '';
    globalDayDiff = 0;

    document.querySelectorAll('#decayTableBody td').forEach(cell => {
        cell.classList.remove('highlight');
    });
    console.log("Reset button clicked");
});


const style = document.createElement('style');
style.textContent = `
.highlight {
    background-color: yellow !important;
}
`;
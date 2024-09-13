document.addEventListener('DOMContentLoaded', function() {              //DropTabel
    let globalDayDiff = 0;

    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('data-target');

            document.querySelectorAll('.content').forEach(content => {
                content.classList.remove('active');
            });

            document.getElementById(targetId).classList.add('active');

            if (targetId === 'section2') {
                initializeDatepickers();
            }
        });
    });
   
    document.head.appendChild(style);
    const decayData = [
        { date: 0, factor: 0.982 }, { date: 1, factor: 0.925 }, { date: 2, factor: 0.87 },
        { date: 3, factor: 0.819 }, { date: 4, factor: 0.771 }, { date: 5, factor: 0.725 },
        { date: 6, factor: 0.683 }, { date: 7, factor: 0.643 }, { date: 8, factor: 0.605 },
        { date: 9, factor: 0.569 }, { date: 10, factor: 0.536 }, { date: 11, factor: 0.504 },
        { date: 12, factor: 0.475 }, { date: 13, factor: 0.447 }, { date: 14, factor: 0.42 }
    ];
    
    const negativeDecayData = [
        { date: -14, factor: 2.296 }, { date: -13, factor: 2.161 }, { date: -12, factor: 2.034 },
        { date: -11, factor: 1.914 }, { date: -10, factor: 1.802 }, { date: -9, factor: 1.696 },
        { date: -8, factor: 1.596 }, { date: -7, factor: 1.502 }, { date: -6, factor: 1.414 },
        { date: -5, factor: 1.33 }, { date: -4, factor: 1.252 }, { date: -3, factor: 1.178 },
        { date: -2, factor: 1.109 }, { date: -1, factor: 1.044 }
    ];
    
    const tableBody = document.getElementById('decayTableBody');
    
    // Generate table rows dynamically
    for (let i = 0; i < decayData.length; i++) {
        const row = document.createElement('tr');
        row.dataset.rowIndex = i;
    
        // Left column (positive dates)
        const leftDateCell = document.createElement('td');
        leftDateCell.textContent = decayData[i].date;
        row.appendChild(leftDateCell);
    
        const leftFactorCell = document.createElement('td');
        leftFactorCell.textContent = decayData[i].factor;
        leftFactorCell.dataset.columnIndex = 1;
        row.appendChild(leftFactorCell);
    
        // Right column (negative dates)
        const rightDateCell = document.createElement('td');
        if (i < negativeDecayData.length) {
            rightDateCell.textContent = negativeDecayData[i].date;
        } else {
            rightDateCell.textContent = '';
        }
        row.appendChild(rightDateCell);
    
        const rightFactorCell = document.createElement('td');
        if (i < negativeDecayData.length) {
            rightFactorCell.textContent = negativeDecayData[i].factor;
            rightFactorCell.dataset.columnIndex = 3;
        } else {
            rightFactorCell.textContent = '';
        }
        row.appendChild(rightFactorCell);
    
        // Append the row to the table body
        tableBody.appendChild(row);
    }

});
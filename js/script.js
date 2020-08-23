// Create event listener on submit button

const submit = document.getElementById('submit')

submit.addEventListener('click', (e) => {
    calculate(e)
})

function calculate(e) {
    e.preventDefault()

    let labels = []
    let balances = []
    let startingBalance = parseInt(
        document.querySelector('#startingBalance').value
    )
    const expectedReturn =
        parseInt(document.querySelector('#expectedReturn').value) / 100
    const monthlyDeposit = parseInt(
        document.querySelector('#monthlyDeposit').value
    )
    const duration = parseInt(document.querySelector('#duration').value)
    const monthlyReturn = expectedReturn / 12

    if (!startingBalance || !expectedReturn || !monthlyDeposit || !duration) {
        return
    }

    // Create formatter for USD
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    })

    // Loop through items to update starting balance and build out table rows
    for (let i = 1; i <= duration * 12; i++) {
        startingBalance = startingBalance * (1 + monthlyReturn) + monthlyDeposit
        if (i % 12 === 0) {
            const year = i / 12
            balances.push(startingBalance.toFixed(2))
            labels.push(`Year ${year}`)
        }

        createChart(labels, balances)
    }

    // Make table and chart appear and have the total presented at the bottom of the screen

    document.querySelector('canvas').style.display = 'block'
    if (document.querySelector('#finalValue')) {
        document.querySelector('#finalValue').innerHTML =
            `Total after ${duration} years: ` +
            formatter.format(startingBalance)
    } else {
        const finalValue = document.createElement('h3')
        finalValue.setAttribute('id', 'finalValue')
        finalValue.innerHTML =
            `Total after ${duration} years: ` +
            formatter.format(startingBalance)
        document.querySelector('.chartDiv').appendChild(finalValue)
    }
    submit.innerHTML = 'Re-Calculate Value'
}

// Function to create chart
function createChart(labels, data) {
    // Destroy previous canvas
    document.getElementById('myChart').remove()

    // Create new canvas
    let canvas = document.createElement('canvas')
    canvas.setAttribute('id', 'myChart')
    document.querySelector('#chartContainer').appendChild(canvas)

    // Fill canvas with chart
    var ctx = document.getElementById('myChart').getContext('2d')
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Growth',
                    data: data,
                    borderColor: 'rgb(50, 200, 0)',
                    backgroundColor: 'rgba(50, 200, 0, .3)',
                    borderWidth: 2,
                    responsive: true,
                    maintainAspectRatio: true,
                },
            ],
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: false,
                        },
                    },
                ],
            },
            legend: {
                display: false,
            },
        },
    })
}

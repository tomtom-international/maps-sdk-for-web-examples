var reachableRangeScenarios = {
    electric: {
        car: {
            vehicleEngineType: 'electric',
            currentChargeInkWh: 35,
            auxiliaryPowerInkW: 1.7,
            vehicleWeight: 1611,
            accelerationEfficiency: 0.33,
            decelerationEfficiency: 0.33,
            uphillEfficiency: 0.33,
            downhillEfficiency: 0.33,
            maxChargeInkWh: 85,
            vehicleMaxSpeed: 200
        },
        truck: {
            vehicleEngineType: 'electric',
            currentChargeInkWh: 55,
            auxiliaryPowerInkW: 1.7,
            vehicleWeight: 15000,
            accelerationEfficiency: 0.33,
            decelerationEfficiency: 0.33,
            uphillEfficiency: 0.23,
            downhillEfficiency: 0.33,
            maxChargeInkWh: 120,
            vehicleMaxSpeed: 100
        }
    },
    combustion: {
        car: {
            vehicleEngineType: 'combustion',
            currentFuelInLiters: 43,
            auxiliaryPowerInLitersPerHour: 1.7,
            fuelEnergyDensityInMJoulesPerLiter: 34.2,
            vehicleWeight: 1600,
            accelerationEfficiency: 0.33,
            decelerationEfficiency: 0.33,
            uphillEfficiency: 0.33,
            downhillEfficiency: 0.33,
            vehicleMaxSpeed: 155
        },
        truck: {
            vehicleEngineType: 'combustion',
            currentFuelInLiters: 60,
            auxiliaryPowerInLitersPerHour: 1.7,
            fuelEnergyDensityInMJoulesPerLiter: 34.2,
            vehicleWeight: 15000,
            accelerationEfficiency: 0.13,
            decelerationEfficiency: 0.33,
            uphillEfficiency: 0.13,
            downhillEfficiency: 0.33,
            vehicleMaxSpeed: 100
        }
    }
};

var reachableRangeBudgets = {
    time: {
        '600': 600,
        '900': 900,
        '1800': 1800
    },
    fuel: {
        '10': 10,
        '15': 15,
        '20': 20
    }
};

window.reachableRangeScenarios = window.reachableRangeScenarios || reachableRangeScenarios;
window.reachableRangeBudgets = window.reachableRangeBudgets || reachableRangeBudgets;

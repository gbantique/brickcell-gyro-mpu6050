/**
 * Enumeration of Axis (X, Y & Z)
 */
enum axisXYZ {
    //% block="X"
    x,
    //% block="Y"
    y,
    //% block="Z"
    z
}

/**
 * Sensitivity of Accelerometer
 */
enum accelSen {
    //% block="2g"
    range_2_g,
    //% block="4g"
    range_4_g,
    //% block="8g"
    range_8_g,
    //% block="16g"
    range_16_g
}

/**
 * Sensitivity of Gyroscope
 */
enum gyroSen {
    //% block="250dps"
    range_250_dps,
    //% block="500dps"
    range_500_dps,
    //% block="1000dps"
    range_1000_dps,
    //% block="2000dps"
    range_2000_dps
}

//% color="#FFBF00" icon="\uf12e" weight=70
namespace Brickcell {
    let i2cAddress = 0x68;
    let power_mgmt = 0x6b;
    // Accelleration addresses
    let xAccelAddr = 0x3b;
    let yAccelAddr = 0x3d;
    let zAccelAddr = 0x3f;
    // Gyroscope addresses
    let xGyroAddr = 0x43;
    let yGyroAddr = 0x45;
    let zGyroAddr = 0x47;
    // Temperature address
    let tempAddr = 0x41;

    // Initialize acceleration and gyroscope values
    let xAccel = 0;
    let yAccel = 0;
    let zAccel = 0;
    let xGyro = 0;
    let yGyro = 0;
    let zGyro = 0;

    function i2cRead(reg: number): number {
        pins.i2cWriteNumber(i2cAddress, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(i2cAddress, NumberFormat.UInt8BE);;
    }

    function readData(reg: number) {
        let h = i2cRead(reg);
        let l = i2cRead(reg + 1);
        let value = (h << 8) + l;

        if (value >= 0x8000) {
            return -((65535 - value) + 1);
        }
        else {
            return value;
        }
    }

    function dist(a: number, b: number): number {
        return Math.sqrt((a * a) + (b * b));
    }

    // Update acceleration data via I2C
    function updateAcceleration(sensitivity: number) {
        // Set sensitivity of acceleration range, according to selection and datasheet value
        let accelRange = 0;
        if (sensitivity == accelSen.range_2_g) {
            // +- 2g
            accelRange = 16384;
        }
        else if (sensitivity == accelSen.range_4_g) {
            // +- 4g
            accelRange = 8192;
        }
        else if (sensitivity == accelSen.range_8_g) {
            // +- 8g
            accelRange = 4096;
        }
        else if (sensitivity == accelSen.range_16_g) {
            // +- 16g
            accelRange = 2048;
        }
        xAccel = readData(xAccelAddr) / accelRange;
        yAccel = readData(yAccelAddr) / accelRange;
        zAccel = readData(zAccelAddr) / accelRange;
    }

    // Update gyroscope data via I2C
    function updateGyroscope(sensitivity: gyroSen) {
        // Set sensitivity of gyroscope range, according to selection and datasheet value
        let gyroRange = 0;
        if (sensitivity == gyroSen.range_250_dps) {
            // +- 250dps
            gyroRange = 131;
        }
        else if (sensitivity == gyroSen.range_500_dps) {
            // +- 500dps
            gyroRange = 65.5;
        }
        else if (sensitivity == gyroSen.range_1000_dps) {
            // +- 1000dps
            gyroRange = 32.8;
        }
        else if (sensitivity == gyroSen.range_2000_dps) {
            // +- 2000dps
            gyroRange = 16.4;
        }
        xGyro = readData(xGyroAddr) / gyroRange;
        yGyro = readData(yGyroAddr) / gyroRange;
        zGyro = readData(zGyroAddr) / gyroRange;
    }

    /**
     * Initialize MPU6050
     */
    //% block="Initialize MPU6050"
    //% weight=100
    //% subcategory="gyro mpu6050"
    export function initMPU6050() {
        let buffer = pins.createBuffer(2);
        buffer[0] = power_mgmt;
        buffer[1] = 0;
        pins.i2cWriteBuffer(i2cAddress, buffer);
    }

    /**
      * Get gyroscope values
      */
    //% block="Gyroscope value of %axisXYZ axis with %gyroSen sensitivity (Unit: rad/s)"
    //%weight=95
    //% subcategory="gyro mpu6050"
    export function gyroscope(axis: axisXYZ, sensitivity: gyroSen) {
        updateGyroscope(sensitivity);
        if (axis == axisXYZ.x) {
            return xGyro;
        }
        else if (axis == axisXYZ.y) {
            return yGyro;
        }
        else {
            return zGyro;
        }
    }

    /**
     * Get rotation of the corresponding Axis
     */
    //% block="Angle of %xaxisXYZ axis with %accelSen sensitivity (Unit: Degrees)"
    //% weight=90
    //% subcategory="gyro mpu6050"
    export function axisRotation(axis: axisXYZ, sensitivity: accelSen): number {
        updateAcceleration(sensitivity);

        let radians;
        if (axis == axisXYZ.x) {
            radians = Math.atan2(yAccel, dist(xAccel, zAccel));
        }
        else if (axis == axisXYZ.y) {
            radians = -Math.atan2(xAccel, dist(yAccel, zAccel));
        }
        else if (axis == axisXYZ.z) {
            radians = Math.atan2(zAccel, dist(xAccel, yAccel));
        }

        // Convert radian to degrees and return
        let pi = Math.PI;
        let degrees = radians * (180 / pi);
        return degrees;
    }

    /**
     * Get acceleration of the corresponding Axis
     */
    //% block="Acceleration of %xaxisXYZ axis with %accelSen sensitivity (Unit: g)"
    //% weight=85
    //% subcategory="gyro mpu6050"
    export function axisAcceleration(axis: axisXYZ, sensitivity: accelSen): number {
        updateAcceleration(sensitivity);
        // Return acceleration of specific axis
        if (axis == axisXYZ.x) {
            return xAccel;
        }
        else if (axis == axisXYZ.y) {
            return yAccel;
        }
        else {
            return zAccel;
        }
    }

    /**
     * Get temperature
     */
    //% block="Temperature (Unit: Celsius)"
    //% weight=80
    //% subcategory="gyro mpu6050"
    export function readTemperature(): number {
        let rawTemp = readData(tempAddr);
        return 36.53 + rawTemp / 340;
    }
}
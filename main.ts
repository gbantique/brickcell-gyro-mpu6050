// Initialize sensor for usage
Brickcell.initMPU6050()

while (true) {
    // Output gyroscope values
    serial.writeLine("X Gyroscope: " + Brickcell.gyroscope(axisXYZ.x, gyroSen.range_250_dps) + " rad/s");
    serial.writeLine("Y Gyroscope: " + Brickcell.gyroscope(axisXYZ.y, gyroSen.range_250_dps) + " rad/s");
    serial.writeLine("Z Gyroscope: " + Brickcell.gyroscope(axisXYZ.z, gyroSen.range_250_dps) + " rad/s");
    serial.writeLine("-----------------------------------------------------------------------------");

    // Output angle values
    serial.writeLine("X Angle: " + Brickcell.axisRotation(axisXYZ.x, accelSen.range_2_g) + " Degree");
    serial.writeLine("Y Angle: " + Brickcell.axisRotation(axisXYZ.y, accelSen.range_2_g) + " Degree");
    serial.writeLine("Z Angle: " + Brickcell.axisRotation(axisXYZ.z, accelSen.range_2_g) + " Degree");
    serial.writeLine("-----------------------------------------------------------------------------");

    // Output acceleration values
    serial.writeLine("X Acceleration: " + Brickcell.axisAcceleration(axisXYZ.x, accelSen.range_2_g) + " g");
    serial.writeLine("Y Acceleration: " + Brickcell.axisAcceleration(axisXYZ.y, accelSen.range_2_g) + " g");
    serial.writeLine("Z Acceleration: " + Brickcell.axisAcceleration(axisXYZ.z, accelSen.range_2_g) + " g");
    serial.writeLine("-----------------------------------------------------------------------------");

    // Output temperature value
    serial.writeLine("Temperature: " + Brickcell.readTemperature() + " C");
    serial.writeLine("-----------------------------------------------------------------------------");
    pause(2000)
}
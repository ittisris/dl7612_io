serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    rx = serial.readLine()
    rxPayload = cayenneLPP.extractPayloadStr(rx, "+NNMI:", ",")
    if (rxPayload.length > 0) {
        cayenneLPP.lpp_update(rxPayload[1])
    }
})
let txPayload = ""
let rx = ""
let rxPayload: string[] = []
cayenneLPP.add_digital(LPP_Direction.Output_Port, DigitalPin.P0)
cayenneLPP.add_sensor(LPP_Bit_Sensor.Temperature)
serial.redirect(
SerialPin.P15,
SerialPin.P14,
BaudRate.BaudRate115200
)
serial.setWriteLinePadding(0)
serial.setRxBufferSize(64)
let vBat = 3.3
rxPayload = []
basic.forever(function () {
    basic.pause(10000)
    txPayload = "" + cayenneLPP.lpp_upload() + cayenneLPP.lpp(
    LPP_DATA_TYPE.Analog_Input,
    99,
    vBat
    )
    serial.writeLine("AT+NMGS=" + convertToText(txPayload.length / 2) + "," + txPayload)
})

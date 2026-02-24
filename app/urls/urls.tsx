const Base_Url = "http://192.168.18.28:8000"
// const Base_Url = "http://192.168.100.159:8000"

// API'S
const urls = {
    login: `${Base_Url}/login`,
    logout: `${Base_Url}/logout`,
    customer_register : `${Base_Url}/customer_register/`,
    configure_device : `${Base_Url}/configure_device`,
    save_captive_portal: `${Base_Url}/save_captive_portal`,
    get_customer_devices: `${Base_Url}/get_customer_devices`,
    get_sensor_data: `${Base_Url}/get_sensor_data`,
    REGISTER_TOKEN_URL: `${Base_Url}/register_firebase_token/`,


    // Sensor details Mqtt URL WS Device Detail Screen Connect and subscribe
    brokerUrl: "ws://192.168.18.28:9001",
}
export default urls
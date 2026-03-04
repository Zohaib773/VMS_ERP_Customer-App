const Base_Url = "http://192.168.18.28:8000"
// const Base_Url = "http://192.168.100.159:8000"

// API'S
const urls = {

    Base: `${Base_Url}`,
    /////////////
    login: `${Base_Url}/login`,
    logout: `${Base_Url}/logout`,
    customer_register : `${Base_Url}/customer_register/`,
    configure_device : `${Base_Url}/configure_device`,
    save_captive_portal: `${Base_Url}/save_captive_portal`,
    get_customer_devices: `${Base_Url}/get_customer_devices`,
    get_sensor_data: `${Base_Url}/get_sensor_data`,
    REGISTER_TOKEN_URL: `${Base_Url}/register_firebase_token/`,
    save_roi: `${Base_Url}/save_roi`,
    get_roi: `${Base_Url}/get_roi/`,
    delete_roi: `${Base_Url}/delete_roi`,


    // Sensor details Mqtt URL WS Device Detail Screen Connect and subscribe
    brokerUrl: "ws://192.168.18.28:9001",
    // TO GET THE URL FOR STREAM
    get_stream: `${Base_Url}/get_stream`,
    // TO SHOW THE SAVED STREAM
    get_videos: `${Base_Url}/get_videos/`,
    // TO PLAY VIDEO
    play_video: `${Base_Url}/play_video/`,
}
export default urls
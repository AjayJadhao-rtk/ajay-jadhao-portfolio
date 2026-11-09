/**
 * SINGLE SOURCE OF TRUTH FOR ALL PROJECTS & WAYPOINTS
 * Adding any new project here automatically:
 * 1. Spawns a new diagonal preview shard in the Hero Section
 * 2. Spawns an interactive physical 3D lab station on the circuit track
 * 3. Populates the telemetry HUD and detailed engineering schematic blueprints
 */

export const PROJECTS_DATA = [
  {
    id: "nex-shield",
    number: "01",
    stationName: "BIO-TELEMETRY LAB // NODE 01",
    title: "NEX-SHIELD",
    category: "Women Safety Wearable",
    tagline: "Cellular Emergency Beacon with Biometric Distress Detection",
    color: "#E11D48", // Crimson SOS
    stationTheme: "wearable_hub",
    beaconFrequency: "1420.40 MHz",
    telemetryStatus: "SOS ACTIVE // GPS LOCKED",
    image: "/assets/crops/nex-shield.jpg",
    status: "SYSTEM ACTIVE",
    coords: "LAT 18.5204° N / LON 73.8567° E",
    specs: [
      { label: "Core Controller", val: "ESP32 dual-core Xtensa 240MHz" },
      { label: "Connectivity", val: "GSM/GPRS SIM800L + Neo-6M GPS" },
      { label: "Sensors", val: "MAX30102 Heart Rate + Panic Force" },
      { label: "Battery Life", val: "72 Hours Continuous Standby" },
    ],
    description:
      "A discreet wearable personal protection system that triggers rapid SOS alerts with exact real-time GPS coordinates to emergency contacts and nearby authorities upon distress detection or manual activation.",
    features: [
      "Instant 1-touch silent emergency beacon",
      "Live geo-fencing and SMS distress broadcast",
      "OLED telemetry screen displaying signal strength & SOS status",
      "Ultra-low power deep-sleep power management"
    ]
  },
  {
    id: "line-robot",
    number: "02",
    stationName: "AUTONOMOUS PROVING GROUND // NODE 02",
    title: "Line Following Robot",
    category: "Autonomous Ground Vehicle",
    tagline: "High-Precision PID-Controlled Track Tracing Rover",
    color: "#D97706", // Amber
    stationTheme: "robotics_depot",
    beaconFrequency: "433.92 MHz",
    telemetryStatus: "CLOSED LOOP // PID 200Hz",
    image: "/assets/crops/line-robot.jpg",
    status: "PID CALIBRATED",
    coords: "VEL 1.4 m/s · ERR < 2mm",
    specs: [
      { label: "Microcontroller", val: "ATmega328P / Arduino Nano" },
      { label: "Sensor Array", val: "8-Channel TCRT5000 IR Array" },
      { label: "Actuation", val: "Twin 12V 600RPM Metal Gear Motors" },
      { label: "Algorithm", val: "Discrete Time-Domain PID Loop" },
    ],
    description:
      "Engineered an autonomous high-speed wheeled mobile platform capable of dynamically tracking intricate race tracks and intersecting corridors with zero overshoot using tuned proportional-integral-derivative control.",
    features: [
      "8-point analog infrared ground mapping",
      "Dynamic differential wheel steering",
      "Onboard telemetry and ultrasonic collision avoidance",
      "Custom acrylic chassis engineered for optimal center of gravity"
    ]
  },
  {
    id: "saline-monitor",
    number: "03",
    stationName: "CLINICAL TELEMETRY SPIRE // NODE 03",
    title: "Saline Monitoring System",
    category: "IoT Healthcare Telemetry",
    tagline: "Intravenous Fluid Depletion Warning & Infusion Telemetry",
    color: "#059669", // Emerald
    stationTheme: "medical_tower",
    beaconFrequency: "2.40 GHz",
    telemetryStatus: "MQTT STREAMING // BUFFER OK",
    image: "/assets/crops/saline-monitor.jpg",
    status: "NODE BROADCASTING",
    coords: "FREQ 2.4GHz · TELEMETRY OK",
    specs: [
      { label: "Weight Sensing", val: "Strain Gauge Load Cell + HX711 24-bit ADC" },
      { label: "Transceiver", val: "ESP8266 Wi-Fi Node" },
      { label: "Protocol", val: "MQTT with TLS Encryption" },
      { label: "Alert Latency", val: "< 150ms to Nurse Station" },
    ],
    description:
      "A smart clinical telemetry device that clamps onto standard hospital IV infusion poles, continuously gauging remaining intravenous saline solution weight to avert dangerous air embolism before fluid depletion.",
    features: [
      "Sub-gram weight measurement resolution",
      "Audible buzzer + cloud dashboard push notifications",
      "Optical drop-rate confirmation sensor",
      "Centralized multi-bed monitoring ward web interface"
    ]
  },
  {
    id: "gesture-car",
    number: "04",
    stationName: "HMI WIRELESS BASE // NODE 04",
    title: "Gesture Control Car",
    category: "HMI & Wearable Robotics",
    tagline: "6-DOF IMU Glove-Controlled Omni Rover",
    color: "#B17B53", // Muted Copper
    stationTheme: "hmi_satellite",
    beaconFrequency: "2.48 GHz",
    telemetryStatus: "RF LOCKED // LATENCY 12ms",
    image: "/assets/crops/gesture-car.jpg",
    status: "RF LINK LOCKED",
    coords: "2.4GHz NRF · LATENCY 12ms",
    specs: [
      { label: "Glove Unit", val: "MPU-6050 6-Axis Gyro/Accelerometer" },
      { label: "RF Transceiver", val: "nRF24L01+ with PA/LNA Antenna" },
      { label: "Chassis", val: "4WD Skid-Steer Robotic Platform" },
      { label: "Control Range", val: "100+ Meters Open Air" },
    ],
    description:
      "An intuitive human-machine interface featuring a sensory cybernetic glove that translates intuitive wrist tilts and hand gestures into instantaneous robotic maneuvering and speed modulation.",
    features: [
      "Complementary filter fusion for noise-free tilt estimation",
      "Proportional acceleration based on palm pitch angle",
      "Fail-safe RF packet watchdog auto-braking system",
      "Low-profile tactical wearable form factor"
    ]
  },
  {
    id: "balancing-robot",
    number: "05",
    stationName: "EQUILIBRIUM OBSERVATORY // NODE 05",
    title: "Balancing Robot",
    category: "Inverted Pendulum Robotics",
    tagline: "Dynamic Equilibrium Platform with Kalman Sensor Fusion",
    color: "#2563EB", // Cobalt Blue
    stationTheme: "pendulum_spire",
    beaconFrequency: "915.00 MHz",
    telemetryStatus: "EQUILIBRIUM OK // TILT 0.00°",
    image: "/assets/crops/balancing-robot.jpg",
    status: "EQUILIBRIUM ACTIVE",
    coords: "TILT 0.00° · CORRECTION 200Hz",
    specs: [
      { label: "Inertial Sensor", val: "MPU-6050 6-Axis Motion Tracking" },
      { label: "Motors", val: "NEMA 17 Steppers + TMC2208 Silent Drivers" },
      { label: "Filter System", val: "Discrete Linear Kalman Filter" },
      { label: "Control Cycle", val: "5ms Interrupt-Driven PID" },
    ],
    description:
      "An inverted pendulum robotic platform that continuously balances on two wheels by resolving gravitational torque via ultra-responsive closed-loop state estimation and dynamic center-of-gravity compensation.",
    features: [
      "Real-time sensor fusion mitigating drift and vibration",
      "Rapid step-response recovery from external shoves",
      "Precision micro-stepping motor actuation",
      "Telemetry stream for angle visualization and tuning"
    ]
  }
];

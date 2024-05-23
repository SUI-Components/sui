// Device Memory
// Specification: https://www.w3.org/TR/device-memory/
// Repository: https://github.com/w3c/device-memory

interface NavigatorDeviceMemory {
  readonly deviceMemory: number
}

interface Navigator extends NavigatorDeviceMemory {}

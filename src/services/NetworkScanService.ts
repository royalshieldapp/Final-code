import { DeviceInfo } from '../types';

const devices: DeviceInfo[] = [
  { name: 'Living Room Cam', ip: '192.168.0.10', type: 'camera' },
  { name: 'Laptop', ip: '192.168.0.22', type: 'computer' },
  { name: 'Smart Lock', ip: '192.168.0.30', type: 'iot' },
];

const NetworkScanService = {
  scan(): Promise<DeviceInfo[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(devices.map((d) => ({ ...d, status: Math.random() > 0.2 ? 'online' : 'offline' })));
      }, 600);
    });
  },
};

export default NetworkScanService;

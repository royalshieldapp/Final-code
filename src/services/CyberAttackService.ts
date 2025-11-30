import { CyberAttackPoint } from '../types';

const mocked: CyberAttackPoint[] = [
  {
    id: '1',
    title: 'Phishing Spike',
    severity: 'medium',
    description: 'Localized phishing SMS campaign',
    lat: 37.78,
    lng: -122.45,
  },
  {
    id: '2',
    title: 'DDoS Cluster',
    severity: 'high',
    description: 'High volume traffic on key ISP nodes',
    lat: 34.05,
    lng: -118.25,
  },
  {
    id: '3',
    title: 'Ransomware Alert',
    severity: 'low',
    description: 'Suspicious lateral movement patterns',
    lat: 40.71,
    lng: -74.01,
  },
];

const CyberAttackService = {
  async fetch() {
    return new Promise<CyberAttackPoint[]>((resolve) => setTimeout(() => resolve(mocked), 300));
  },
};

export default CyberAttackService;

export interface DashboardStats {
  doctors: number;
  nurses: number;
  pharmacy: number;
  homeopathy: number;
}

export interface UserDetails {
  name: string;
  qualification: string;
  profileImage?: string | null;
}

export interface StatItem {
  title: string;
  value: number;
  color: string;
  image?: string;
}
export interface GpuInfoType {
  'GPU num': number;
  'GPU name': string;
  'Total memory (MB)': number;
  'Free memory (MB)': number;
  'Used memory (MB)': number;
  'Free memory (%)': number;
  'Used memory (%)': number;
}

export interface gpuInfoResponse {
  data: {
    gpu_info: GpuInfoType[];
  };
}


export interface RoboflowPrediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
  class_id?: number;
  detection_id?: string;
}

export interface RoboflowResponse {
  time?: number;
  image?: {
    width: number;
    height: number;
  };
  predictions: RoboflowPrediction[];
}

export interface DetectionResult {
  rawPredictions: RoboflowPrediction[];
  detectedLabels: string[];
  executionTime?: number;
}

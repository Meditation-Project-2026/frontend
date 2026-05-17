import api from './axios';

/**
 * [2-1] 명상 세션 시작 (Log 생성)
 * POST /main/meditations/{id}/start
 */
export interface StartMeditationResponse {
  logId: number;
  startedAt: string; // ISO 8601 format
}

export const startMeditation = async (meditationId: number): Promise<StartMeditationResponse> => {
  try {
    const response = await api.post<StartMeditationResponse>(
      `/main/meditations/${meditationId}/start`,
      {} // empty body, backend will handle userId
    );
    return response.data;
  } catch (error) {
    console.error('Failed to start meditation:', error);
    throw error;
  }
};

/**
 * [2-2] rPPG 실시간 데이터 스트림 (WebSocket)
 * WSS /v1/ai/rppg-stream
 */
export interface RPPGStreamMessage {
  heartRate: number;
  lfHfRatio: number;
  isFaceDetected: boolean;
}

export const connectRPPGStream = (
  logId: number,
  onMessage: (data: RPPGStreamMessage) => void,
  onError?: (error: Event) => void,
  onClose?: (event: CloseEvent) => void
): WebSocket => {
  const wsUrl = `ws://127.0.0.1:8000/v1/ai/rppg-stream`;
  const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      // 서버의 RppgStreamRequest 규격(logId, frame)을 반드시 지켜야 합니다.
      ws.send(JSON.stringify({
        logId: Number(logId),
        frame: ""
      }));
    };

  ws.onmessage = (event) => {
    try {
      const data: RPPGStreamMessage = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    onError?.(error);
  };

  ws.onclose = (event) => {
    console.log('WebSocket closed');
    onClose?.(event);
  };

  return ws;
};

/**
 * WebSocket에 프레임 데이터 전송
 */
export const sendFrameToWebSocket = (ws: WebSocket, frameData: string | Blob | BufferSource) => {
  // frameData가 base64 문자열이어야 함
  try {
    // frameData가 dataURL(base64)일 때만 처리
    if (typeof frameData === 'string') {
      ws.send(JSON.stringify({ frame: frameData }));
    } else {
      console.warn('frameData is not a base64 string');
    }
  } catch (e) {
    console.error('Failed to send frame JSON:', e);
  }
};

/**
 * [2-3] 명상 결과 최종 저장 (AI 서버 → 메인 서버)
 * POST /main/records
 * 주의: 이 API는 FastAPI에서 호출하지만, 필요시 프론트에서도 호출 가능
 */
export interface SaveMeditationRecordRequest {
  logId: number;
  startHr: number;
  endHr: number;
  startLfhf: number;
  endLfhf: number;
  resultStatus: 'SUCCESS' | 'FAILURE';
  hrDiff: number;
  lfhfDiff: number;
}

export interface SaveMeditationRecordResponse {
  status: string;
}

export const saveMeditationRecord = async (
  data: SaveMeditationRecordRequest
): Promise<SaveMeditationRecordResponse> => {
  try {
    const response = await api.post<SaveMeditationRecordResponse>(
      '/main/records',
      data
    );
    return response.data;
  } catch (error) {
    console.error('Failed to save meditation record:', error);
    throw error;
  }
};

/**
 * [3-1] 명상 피드백 상세 조회
 * GET /main/records/{logId}
 */
export interface MeditationFeedbackResponse {
  meditationDate: string;
  title: string;
  totalDuration: string;
  lfhf: {
    start: number;
    end: number;
    changeRate: number;
  };
  heartRate: {
    start: number;
    end: number;
    diff: number;
  };
  resultStatus: 'SUCCESS' | 'FAILURE';
  userNote: string | null;
  recommendedMeditations: Array<{
    id: number;
    title: string;
    backgroundUrl: string;
  }>;
}

export const getMeditationFeedback = async (logId: number): Promise<MeditationFeedbackResponse> => {
  try {
    const response = await api.get<MeditationFeedbackResponse>(
      `/main/records/${logId}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch meditation feedback:', error);
    throw error;
  }
};

/**
 * 사용자 노트 업데이트
 * PATCH /main/records/{logId}
 */
export interface UpdateUserNoteRequest {
  logId: number;
  userNote: string;
}

export const updateUserNote = async (data: UpdateUserNoteRequest): Promise<{ status: string }> => {
  try {
    const response = await api.patch<{ status: string }>(
      `/main/records/${data.logId}`,
      { userNote: data.userNote }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update user note:', error);
    throw error;
  }
};
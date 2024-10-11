# 베이스 이미지: Python 3.10
FROM python:3.10.6

# 작업 디렉토리를 /app/S11P21S001/backend으로 설정
WORKDIR /app/S11P21S001/backend

# 필요한 파일 복사 (현재 디렉터리 기준으로 backend 디렉터리 전체를 복사)
COPY . .

# 가상환경 생성 및 활성화, requirements.txt 설치
RUN python3 -m venv venv && \
    . venv/bin/activate && \
    pip install --upgrade pip && \
    pip install -r requirements.txt && \
    . venv/bin/activate

# 8000번 포트 노출
EXPOSE 8000

# FastAPI 애플리케이션 실행 (환경 변수를 로드)
CMD ["./venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

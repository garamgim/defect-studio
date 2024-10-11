1. Gitlab 소스 클론 이후 빌드 및 배포할 수 있도록 정리한 문서
    - 사용한 JVM, 웹서버, WAS 제품 등의 종류와 설정 값, 버전(IDE 버전 포함) 기재
        - Docker 버전
        
        ![image.png](./images/docker.png)
        
        - nginX 버전
        
        ![image.png](./images/nginx.png)
        
        - nginx 설정
            
            /etc/nginx/sites-available/default 작성 내용
            
            ```bash
            #
            server {
                listen 80;
                server_name j11s001.p.ssafy.io;
            
                # Redirect HTTP to HTTPS
                return 301 https://$host$request_uri;
            
            }
            
            # HTTPS 요청을 처리
            server {
                listen 443 ssl;
                server_name j11s001.p.ssafy.io;
            
            # Path to your SSL certificate and key
                ssl_certificate /etc/letsencrypt/live/j11s001.p.ssafy.io/fullchain.pem;
                ssl_certificate_key /etc/letsencrypt/live/j11s001.p.ssafy.io/privkey.pem;
            
                    location / {
                            proxy_pass http://localhost:8000;
                            proxy_set_header Host $host;
                            proxy_set_header X-Real-IP $remote_addr;
                            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                            proxy_set_header X-Forwarded-Proto $scheme;
                    }
            }
            ```
            
        - IDE 버전
            
            ```markdown
            PyCharm: 2024.2 (Professional Edition)
            Visual Studio Code: 1.90.2
            ```
            
        - 백엔드 버전
            
            ```markdown
            Python: Python 3.10
            ```
            
        - 프론트엔드 버전
            
            ```markdown
            React: 18.2.0
            React DOM: 18.2.0
            VITE: 5.1.6
            Electron: 30.0.1
            Tainwind CSS: 3.4.10
            Redux Toolkit: 2.2.7
            Tanstack Query: 5.53.1
            ```
            
    
    - 빌드 시 사용되는 환경변수
        - 백엔드
            - AI 서버
            
            ```markdown
            OUTPUT_DIR=/{your-path}/ai/checkpoint
            # ex) stable-diffusion-v1-5|stable-diffusion-v2-inpainting
            BASE_MODEL_NAME={model-name}|{model-name}
            MULTI_CONCEPT_TRAIN_PATH={your-path}/diffusers-fork-defectStudio/defect/train_multi_subject_dreambooth_inpaint.py
            
            # REDIS
            REDIS_HOST=
            REDIS_PORT=6379
            
            # Working Directory
            DOWNLOAD_TEMP_DIR=/{your-path}/tmp
            ```
            
            - Backend 서버
            
            ```markdown
            # URL
            BACKEND_DOMAIN=localhost
            AI_SERVER_URL=http://localhost:9755/api
            
            # REDIS
            REDIS_HOST=
            REDIS_PORT=
            
            # JWT
            ENCODE_ALGORITHM=HS256
            JWT_SECRET_KEY=your-secret
            JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
            JWT_REFRESH_TOKEN_EXPIRE_MINUTES=10080
            
            # POSTGRES
            POSTGRES_SERVER=
            POSTGRES_PORT=
            POSTGRES_USER=
            POSTGRES_PASSWORD=
            POSTGRES_DB=postgres
            
            # S3
            AWS_S3_BUCKET=s3-bucket-ott
            AWS_S3_REGION_STATIC=ap-northeast-2
            AWS_S3_ACCESS_KEY=
            AWS_S3_SECRET_KEY=
            
            # MONGO DB
            MONGO_DB_PORT=27017
            MONGO_DB_USERNAME=root
            MONGO_DB_PASSWORD=1234
            MONGO_DB_DATABASE=defectstudio
            
            # MONGO EXPRESS
            MONGO_EXPRESS_PORT=8081
            MONGO_EXPRESS_USERNAME=admin
            MONGO_EXPRESS_PASSWORD=1234
            MONGO_EXPRESS_MONGODB_URL=mongodb://root:1234@mongodb:27017
            
            # etc
            BASE_MODEL_NAME=stable-diffusion-2|stable-diffusion-v1-5|stable-diffusion-v1-4|stable-diffusion-2-inpainting
            
            # GMAIL SMTP
            MAIL_USERNAME=
            MAIL_PASSWORD=
            MAIL_FROM=
            MAIL_PORT=465
            MAIL_SERVER=smtp.gmail.com
            MAIL_STARTTLS=False
            MAIL_SSL_TLS=True
            ```
            
        - 프론트엔드
            
            ```markdown
            VITE_API="{be-server-path}"
            ```
            
    - Build
        - torch와 cuda 특정 버전으로 설치
            
            ```bash
            pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu117
            ```
            
        - `ai/` `backend/` 에서 `pip install requirements.txt`
        - `ai/` `backend/` 에서 `python main.py`
        - gpu 서버에서 redis 실행
            
            ```bash
            cd project/redis-7.4.0/src/
            ../redis-server
            ```
            
        - `ai/` Celery 실행
            
            ```markdown
            cd ai
            celery -A workers.celery.celery_app worker --hostname=gen --queues=gen_queue --loglevel=info --pool=threads
            celery -A workers.celery.celery_app worker --hostname=tra --queues=tra_queue --loglevel=info --pool=threads
            ```
            
        - AI 서버 모델 Training 시 필요한 소스코드 로드
            
            ```bash
            git clone https://github.com/Kimbumsoo99/diffusers-fork-defectStudio.git
            git checkout -t origin/defect-studio
            
            # 이후 해당 경로 지정하여 ai .env 수정
            MULTI_CONCEPT_TRAIN_PATH={your-path}/diffusers-fork-defectStudio/defect/train_multi_subject_dreambooth_inpaint.py
            ```
            
        - Base 모델 경로 load
            
            ```bash
            # 사용하기 위한 BASE_MODEL_NAME OUTPUT_DIR/ 하위 위치에 모델 경로 지정
            OUTPUT_DIR={your-path}/ai/checkpoint
            
            # 필요 시 모델 다운로드 또는 diffusion 기반의 모델을 로드
            ```
            # model download code
            from diffusers import StableDiffusionPipeline
            
            # hugging face model load or your model(diffusion based) path
            model_id = "stabilityai/stable-diffusion-2-inpainting"
            
            local_model_path = "/{your-path}/ai/checkpoint/stable-diffusion-2-inpainting"
            
            # model download and local save
            pipeline = StableDiffusionPipeline.from_pretrained(model_id)
            pipeline.save_pretrained(local_model_path)
            ```
            
            # 여러 개인 경우 |로 구분, 아래는 예시입니다
            BASE_MODEL_NAME=stable-diffusion-2|stable-diffusion-v1-5|stable-diffusion-v1-4|stable-diffusion-2-inpainting
            ```
            
2. 프로젝트에서 사용하는 외부 서비스 정보를 정리한 문서
    - 소셜 인증, 포톤 클라우드, 코드 컴파일 등에 활용된 외부 서비스 가입 및 활용에 필요한 정보
3. DB 덤프 파일 최신본
    - 해당 디렉토리에 첨부
4. 시연 시나리오

## 🎯 Generation

### 📌 Text To Image

![text_to_image](../readme/text_to_image.gif)

Text Prompt를 통해서 원하는 이미지를 생성할 수 있습니다.  
이를 통해서 다양한 불량 이미지를 생성할 수 있습니다.

Basic 모드에서는 Text 입력을 통해 간단하게 입력을 할 수 있고  
Advance 모드에서는 세부적인 Parameter들을 입력할 수 있습니다.

### 📌 Image To Image

![image_to_image](../readme/image_to_image.gif)

기존에 생성한 이미지를 업로드. 혹은 다른 파트에서 생성한 이미지를  
바로 가져와서 해당 이미지 바탕으로 또다른 이미지를 생성할 수 있습니다!

### 📌 Inpainting

![inpainting](../readme/inpainting.gif)

특정 영역을 선택해서, 이에 관한 프롬프트를 입력하여 원하는 이미지를 생성 할 수 있습니다.

### 📌 Clean Up

![cleanup](../readme/cleanup.gif)

불필요한 요소들을 AI가 스스로 파악해서 없애서 이미지를 깔끔하게 만들어 줍니다!

### 📌 Remove Background

![remove-bg](../readme/remove-bg.gif)

배경화면 부분을 알아서 없애 주어 손쉽게 투명 이미지를 만들 수 있습니다.

### 공통적인 요소

**Preset**

![preset](../readme/general_preset.gif)

각각 파트에서 자기가 원하는 Prompt 글 및 여러가지 Parameter 설정값을 저장할 수 있습니다.  
이를 통해 쉽게 여러가지 parameter 및 프롬프트를 불러 올 수 있습니다.

**Batch Mode**

![batch](../readme/batch_mode.gif)

여러장의 이미지에 대해서 업로드 하지 않고, 파일 경로만 지정하면 알아서 이미지를 읽어와서  
관련된 처리를 손쉽게 할 수 있습니다!

**Side Bar**

![sidebar](../readme/general_sidebar.gif)

사이드를 통해서 이미지 선택, 다운로드, 작업물 삭제 등을 손쉽게 할 수 있습니다

### Clip

> 해당 기능은 `image-to-image`, `inpainting` 에만 가능합니다.

![clip](../readme/clip.gif)

해당 기능은 업로드한 이미지에 대해서 AI가 자동으로 분석하여 알맞는 프롬프트를 추천합니다.  
사용자는 제시된 여러 프롬프트들 중 몇가지 선택하여 실제 프롬프트에 반영 할 수 있습니다.

## 🎯 Training

![training](../readme/training.gif)

사용자가 만약 특화된 이미지에 대한 학습을 시키고 싶을 때  
해당 부분에서 다양한 파라미터 및 기본 Model 선택. 학습 이미지가 담긴 경로 선택 등을 할 수 있습니다.

학습 중에는 실시간으로 학습 상황에 대한 통계를 볼 수 있습니다.

![training_status](../readme/training_status.png)

## 🎯 History

![history1](../readme/history1.gif)

사용자들은 Generation 사용한 기록들을 볼 수 있습니다.  
해당 기록을 통해서 이전에 생성한 이미지들에 대해서 쉽게 다운로드 할 수 있으며,  
해당 기록에는 프롬프트 정보, 툴 도구,를 확인할 수 있습니다.

![history2](../readme/history2.gif)

또한 북마크 기능을 활용하면 Home 페이지에 해당 북마크 목록을 볼 수 있도록 하였습니다.

## 🎯 Settings

![setting](../readme/setting.png)

Settings에는 현재 GPU 서버 상태를 확인할 수 있고.  
기본적으로 사용할 GPU 서버를 선택할 수 있습니다.

## 🎯Token

AI 생성 및 훈련에 대해서 많은 컴퓨터 자원을 소모합니다. 따라서 사용자들이 무작정 사용하는 것을 막기 위해 **토큰** 이라는 시스템을 도입하였습니다.

### 📌 Token 발행

![token_issue](../readme/token_issue.png)

본 기능은 계정 권한 중 최상위 **super_admin** 에만 활성화 되어 있습니다.

해당 기능은 각 부서별에 토큰에 대한 발급을 담당합니다.  
해당 부분에서는 부서에 전달항 토큰 양 및 유효기간을 설정해서  
넘길 수 있습니다.

### 📌 Token 분배

![token_distribute](../readme/token_distribution.png)

본 기능은 계정 권한 중 **super_admin** 혹은 **department_admin** 에만 활성화가 되어 있습니다.

발행을 통해 받은 토큰에 대해서 해당 부서 내에 있는 사람들 중 전달할 사람들을 선택허여  
해당 사람들에게 토큰을 넘겨 줄 수 있습니다.

### 📌 Statistics

![token_statictics](../readme/token_statistics.png)

부서 (super_admin, department_admin 만 가능) 및 자기자신에 대한  
다양한 사용 통계를 알 수 있습니다.

- 모델 사용 빈도
- 토큰 사용량, 이미지 생성량
- Tool 사용 빈도 통계

## 🎯 회원

### 📌 회원가입 & 이메일 인증

![signup](../readme/signup.png)

![email_verify](../readme/email_verify.png)

회원 가입 시 해당 이메일이 유효한 이메일인지 확인하기 위해서  
확인 코드를 요구합니다.

실제 이메일에 전송된 코드를 입력할 경우 "임시 회원" 으로서 승인이 되고  
정식으로 승인이 되기 위해서는 관리자의 [회원관리](user_management)를 통해서  
승인이 되어야 합니다.

### 📌 회원관리

> 본 기능은 **super_admin** 만 가능한 기능입니다.

![user_management](../readme/user_management.png)

기존 회원들에 대한 계정 권한 정보 수정, 계정 삭제 (강제 탈퇴) 등이 가능하며,  
임시 회원에 대한 승인,거절 선택을 할 수 있습니다.

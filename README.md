<style>h1,h2,h3,h4 { border-bottom: 0; } </style>

# 🌟 삼성 청년 SW 아카데미 11기 SDC 1팀 **폼행폼사** 🌟

---

# 🌳 프로젝트 개요

## ✨ 팀원

|  팀장  |  팀원  |  팀원  |  팀원  |  팀원  |  팀원  |
| :----: | :----: | :----: | :----: | :----: | :----: |
| 정현수 | 김경대 | 김가람 | 박수진 | 장재훈 | 김범수 |
|        |        |        |        |        |        |
|   FE   |   FE   |   BE   |   BE   |   AI   |   AI   |

## 📅 기간

- 기획 및 설계 : 2024.08.19 - 2024.08.23
- 개발 : 2024.08.26 - 2024.10.10

---

<br>

# 💎 소개

### 🌃 기획 의도

> **실제 검증에 쓰이는 AI** 에 학습시킬 양질의 불량 이미지를 만들어 **성능 및 정확도** 를 높이기!

4차 산업에 들어오면서 제조업은 최근 물건은 제조하는 양이 많아짐에 따라 불량 점검은 갈수록 어려워지고 있습니다.

따라서 AI를 활용한 불량을 점검하고 있는 추세인데, 해당 AI에 대한 도입 실패 확률이 높습니다.

여러 이유들 중 한 이유는 <span style="color:red"> **양질의 데이터 부족** </span> 입니다.

정상 데이터를 이용한 AI 학습은 편향적인 학습으로 인해 불량을 검증하는데 한계가 있습니다.

따라서 다량의 불량 이미지 DataSet이 필요하지만, 실제 제조 과정에서 발행하는 불량품의 생성량은 매우 작으며, 일부러 제품에 찍힘 및 스크래치 등을 만들어서 실제 불량 이미지를 만들어 내고 있지만, 한계가 있습니다.

따라서 저희 팀은 **제조 불량 이미지를 생성하는 Gen AI 시스템** 을 개발하여 이를 개선시키고자 합니다.

### 🌃 타겟층

**AI를 통해 불량을 판별하는 모든 기업 및 부서**

### 🔍 주요 기능

- **Stable Diffusion**을 이용한 결함 이미지 생성 및 이미지 수정

  - text-to-image, image-to-image, remove-background, inpainting, cleanup

- **학습**을 통해 특정 제품에 대한 결함, 정상 이미지 학습

- 이전 생성한 이미지에 대한 **History 기록**

- **Token 관리 및 통계** 제공

- Settings을 통한 사용할 **GPU 서버 선택**

---

<br>

# 🔨 Tech Stack 🔨

### Front End

![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge)
![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge)
![Vite Badge](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff&style=for-the-badge)
![Electron Badge](https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=fff&style=for-the-badge)
![React Router Badge](https://img.shields.io/badge/React%20Router-CA4245?logo=reactrouter&logoColor=fff&style=for-the-badge)
![Redux Badge](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=fff&style=for-the-badge)
![React Query Badge](https://img.shields.io/badge/React%20Query-FF4154?logo=reactquery&logoColor=fff&style=for-the-badge)

![HTML5 Badge](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff&style=for-the-badge)
![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff&style=for-the-badge)

### Back End

![Python Badge](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff&style=for-the-badge)
![FastAPI Badge](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=fff&style=for-the-badge)

### AI

![PyTorch Badge](https://img.shields.io/badge/PyTorch-EE4C2C?logo=pytorch&logoColor=fff&style=for-the-badge)
![Stable Diffusion](https://img.shields.io/badge/Stable%20Diffusion-D24939?logoColor=fff&style=for-the-badge)

### DB

![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=for-the-badge)
![Redis](https://img.shields.io/badge/Redis-FF4438?logoColor=fff&style=for-the-badge)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-4169E1?logo=SQLAlchemy&logoColor=fff&style=for-the-badge)

### Infra

![Amazon EC2 Badge](https://img.shields.io/badge/Amazon%20EC2-F90?logo=amazonec2&logoColor=fff&style=for-the-badge)
![Jenkins Badge](https://img.shields.io/badge/Jenkins-D24939?logo=jenkins&logoColor=fff&style=for-the-badge)
![Celery Badge](https://img.shields.io/badge/Celery-37814A?logo=celery&logoColor=fff&style=for-the-badge)
![Docker Badge](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff&style=for-the-badge)

### Team Collaboration Tools

![Jira Badge](https://img.shields.io/badge/Jira-0052CC?logo=jira&logoColor=fff&style=for-the-badge)
![GitLab Badge](https://img.shields.io/badge/GitLab-FC6D26?logo=gitlab&logoColor=fff&style=for-the-badge)
![Mattermost Badge](https://img.shields.io/badge/Mattermost-0058CC?logo=mattermost&logoColor=fff&style=for-the-badge)
![Git Badge](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=fff&style=for-the-badge)
![Slack Badge](https://img.shields.io/badge/Slack-4A154B?logo=slack&logoColor=fff&style=for-the-badge)

### Architecture

<img src="./readme/architecture.png">

<br>

---

<br>

# 🌍 서비스 기능

## 🎯 Generation 영역

### 📌 Text To Image

[생성 이미지]

Text Prompt를 통해서 원하는 이미지를 생성할 수 있습니다.  
이를 통해서 다양한 불량 이미지를 생성할 수 있습니다.

Basic 모드에서는 Text 입력을 통해 간단하게 입력을 할 수 있고  
Advance 모드에서는 세부적인 Parameter들을 입력할 수 있습니다.

### 📌 Image To Image

[생성 이미지]

기존에 생성한 이미지를 업로드. 혹은 다른 파트에서 생성한 이미지를  
바로 가져와서 해당 이미지 바탕으로 또다른 이미지를 생성할 수 있습니다!

### 📌 Inpainting

[생성 이미지]

### 📌 Clean Up

[생성 이미지]

### 📌 Remove Background

[생성 이미지]

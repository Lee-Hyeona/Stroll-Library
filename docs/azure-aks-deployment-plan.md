# Azure AKS 배포 계획

## 현재 상황

- Azure AKS 클러스터 설정 완료
- ACR(Azure Container Registry) 생성 완료
- AKS와 ACR 연결 완료
- Helm을 통한 Kafka 배포 완료

## 배포 대상

- React 프론트엔드 애플리케이션 (Vite 기반)
- 정적 파일 서빙을 위한 Nginx 사용

## 배포 단계

### 1. 컨테이너화 준비

- [x] Dockerfile 생성
- [x] .dockerignore 생성
- [x] Nginx 설정 파일 생성

### 2. Kubernetes 배포 파일 생성

- [x] kubernetes/deployment.yaml
- [x] kubernetes/service.yaml
- [x] kubernetes/ingress.yaml

### 3. 배포 스크립트 생성

- [x] deploy.sh (자동 배포 스크립트)
- [x] kubernetes/manual-deploy.md (수동 배포 가이드)

### 4. 배포 실행

- [ ] Docker 이미지 빌드
- [ ] ACR에 이미지 푸시
- [ ] Kubernetes 배포

## 리소스 정보

- **Resource Group**: aivle_ai_08_project-rsrcgrp
- **AKS Cluster**: aivleai_08_project-aks
- **ACR**: aivleai08project

## 배포 실행 방법

### 자동 배포 (권장)

```bash
./deploy.sh
```

### 수동 배포

`kubernetes/manual-deploy.md` 파일을 참고하여 단계별로 실행

## 배포 후 확인사항

1. **Pod 상태 확인**

   ```bash
   kubectl get pods -l app=frontend-lha
   ```

2. **서비스 상태 확인**

   ```bash
   kubectl get services frontend-lha-service
   ```

3. **외부 접근 확인**

   ```bash
   kubectl get services frontend-lha-service
   # EXTERNAL-IP가 할당되면 해당 IP로 접근 가능
   ```

4. **로그 확인**
   ```bash
   kubectl logs -l app=frontend-lha
   ```

## 문제 해결

- **Pod이 시작되지 않는 경우**: `kubectl describe pods -l app=frontend-lha`
- **서비스에 접근할 수 없는 경우**: `kubectl describe service frontend-lha-service`
- **이미지 pull 실패**: ACR 연결 상태 확인 `az acr login --name aivleai08project`

# 수동 배포 가이드

## 사전 준비사항

1. Azure CLI 로그인 완료
2. kubectl 설정 완료 (AKS 클러스터 연결)
3. Docker 설치 완료

## 배포 단계

### 1. Docker 이미지 빌드

```bash
# 현재 날짜를 태그로 사용
export IMAGE_TAG=$(date +%Y%m%d)
docker build -t frontend-lha:$IMAGE_TAG .
```

### 2. ACR에 이미지 태그 설정

```bash
docker tag frontend-lha:$IMAGE_TAG aivleai08project.azurecr.io/frontend-lha:$IMAGE_TAG
docker tag frontend-lha:$IMAGE_TAG aivleai08project.azurecr.io/frontend-lha:latest
```

### 3. ACR 로그인

```bash
az acr login --name aivleai08project
```

### 4. 이미지 푸시

```bash
docker push aivleai08project.azurecr.io/frontend-lha:$IMAGE_TAG
docker push aivleai08project.azurecr.io/frontend-lha:latest
```

### 5. deployment.yaml 이미지 태그 업데이트

```bash
# deployment.yaml 파일에서 이미지 태그를 현재 날짜로 업데이트
sed -i "s|image: aivleai08project.azurecr.io/frontend-lha:latest|image: aivleai08project.azurecr.io/frontend-lha:$IMAGE_TAG|g" kubernetes/deployment.yaml
```

### 6. Kubernetes 배포

```bash
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
```

### 7. 배포 상태 확인

```bash
kubectl get all
kubectl get deployments
kubectl get services
kubectl get pods
```

### 8. 로그 확인

```bash
kubectl logs -l app=frontend-lha
```

### 9. 서비스 접근 (LoadBalancer 사용 시)

```bash
kubectl get services frontend-lha-service
```

## 문제 해결

### Pod 상태 확인

```bash
kubectl describe pods -l app=frontend-lha
```

### 서비스 상태 확인

```bash
kubectl describe service frontend-lha-service
```

### 배포 롤백

```bash
kubectl rollout undo deployment/frontend-lha-deployment
```

## 참고사항

- 이미지 태그는 날짜 형식(YYYYMMDD)으로 자동 생성됩니다
- LoadBalancer 타입의 서비스는 외부 IP를 할당받는데 시간이 소요될 수 있습니다
- Ingress를 사용하려면 NGINX Ingress Controller가 설치되어야 합니다

#!/bin/bash

# Azure AKS 배포 스크립트
# 실행 전 Azure CLI 로그인과 kubectl 설정이 완료되어야 합니다.

set -e

# 변수 설정
RESOURCE_GROUP="aivle_ai_08_project-rsrcgrp"
ACR_NAME="aivleai08project"
AKS_NAME="aivleai_08_project-aks"
IMAGE_NAME="frontend-lha"
IMAGE_TAG="$(date +%Y%m%d)"

echo "🚀 Azure AKS 배포 시작..."

# 1. Docker 이미지 빌드
echo "📦 Docker 이미지 빌드 중..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

# 2. ACR에 이미지 태그
echo "🏷️  ACR에 이미지 태그 설정 중..."
docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:${IMAGE_TAG}
docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:latest

# 3. ACR 로그인
echo "🔐 ACR 로그인 중..."
az acr login --name ${ACR_NAME}

# 4. 이미지 푸시
echo "📤 이미지를 ACR로 푸시 중..."
docker push ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:${IMAGE_TAG}
docker push ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:latest

# 5. deployment.yaml에서 이미지 태그 업데이트
echo "📝 deployment.yaml 업데이트 중..."
sed -i "s|image: ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:latest|image: ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:${IMAGE_TAG}|g" kubernetes/deployment.yaml

# 6. Kubernetes 배포
echo "🚢 Kubernetes에 배포 중..."
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml

# 7. 배포 상태 확인
echo "✅ 배포 상태 확인 중..."
kubectl get deployments
kubectl get services
kubectl get pods

echo "🎉 배포 완료!"
echo "📊 배포 상태를 확인하려면 다음 명령어를 실행하세요:"
echo "   kubectl get all"
echo "   kubectl logs -l app=frontend-lha" 
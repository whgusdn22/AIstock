#!/usr/bin/env node
/**
 * AI 주식 차트 분석기 프론트엔드 설정 스크립트
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createEnvFile() {
  const envFile = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envFile)) {
    console.log('⚠️  .env.local 파일이 이미 존재합니다.');
    const overwrite = await question('덮어쓰시겠습니까? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('설정을 취소했습니다.');
      return;
    }
  }
  
  console.log('🔧 프론트엔드 환경을 설정합니다...');
  
  const backendUrl = await question('백엔드 서버 URL을 입력하세요 (기본값: http://localhost:8000): ') || 'http://localhost:8000';
  
  // 환경 변수 내용 생성
  const envContent = `# 백엔드 서버 URL
BACKEND_URL=${backendUrl}

# Next.js 설정
NEXT_PUBLIC_APP_NAME=AI 주식 차트 분석기
NEXT_PUBLIC_APP_VERSION=1.0.0

# 개발 환경 설정
NODE_ENV=development
`;
  
  // .env.local 파일 생성
  fs.writeFileSync(envFile, envContent, 'utf8');
  
  console.log('✅ .env.local 파일이 생성되었습니다!');
  console.log(`📁 파일 위치: ${envFile}`);
}

function checkDependencies() {
  console.log('📦 Node.js 패키지 의존성을 확인합니다...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json 파일을 찾을 수 없습니다.');
    return false;
  }
  
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('❌ node_modules 폴더가 없습니다.');
    console.log('다음 명령어로 설치하세요:');
    console.log('npm install');
    return false;
  }
  
  console.log('✅ 모든 의존성이 설치되어 있습니다.');
  return true;
}

async function main() {
  console.log('🚀 AI 주식 차트 분석기 프론트엔드 설정');
  console.log('=' * 50);
  
  // 1. 의존성 확인
  if (!checkDependencies()) {
    rl.close();
    return;
  }
  
  // 2. 환경 변수 파일 생성
  await createEnvFile();
  
  console.log('\n🎉 설정이 완료되었습니다!');
  console.log('\n다음 명령어로 개발 서버를 실행하세요:');
  console.log('npm run dev');
  
  console.log('\n📋 추가 정보:');
  console.log('- 백엔드 서버가 실행 중인지 확인하세요.');
  console.log('- .env.local 파일은 절대 Git에 커밋하지 마세요!');
  
  rl.close();
}

main().catch(console.error); 
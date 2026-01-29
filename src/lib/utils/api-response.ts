import { NextResponse } from 'next/server';

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function apiUnauthorized(message = '인증이 필요합니다') {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function apiNotFound(message = '리소스를 찾을 수 없습니다') {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function apiServerError(message = '서버 오류가 발생했습니다') {
  return NextResponse.json({ error: message }, { status: 500 });
}

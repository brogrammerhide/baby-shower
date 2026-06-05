// import { NextRequest, NextResponse } from 'next/server';
// import { login } from '../../../services/authService';
//
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//
//     if (!body.email || !body.password) {
//       return NextResponse.json(
//         { error: 'Missing required fields: email and password' },
//         { status: 400 }
//       );
//     }
//
//     const { token, account } = await login(body.email, body.password);
//
//     const response = NextResponse.json(
//       { message: 'Login successful', account },
//       { status: 200 }
//     );
//
//     // Set JWT token cookie securely
//     response.cookies.set('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 60 * 60 * 24, // 1 day
//       path: '/',
//     });
//
//     return response;
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Login failed' },
//       { status: 401 }
//     );
//   }
// }

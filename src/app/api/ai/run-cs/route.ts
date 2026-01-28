import { NextResponse } from 'next/server';

export async function POST() {
  // Importación dinámica: asegura que este código se ejecute sólo en el servidor
  const { customerSupportFlow } = await import('@/ai/flows/customer-support-flow');
  const result = await customerSupportFlow();
  return NextResponse.json({ result });
}

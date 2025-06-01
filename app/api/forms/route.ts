
import { NextResponse } from "next/server";
import { generateForm } from "@/actions/generateForm";

export async function POST(req: Request) {
  const formData = await req.formData();
  // prevState is not needed, pass null or undefined
  const result = await generateForm(null, formData);

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
  return NextResponse.json(result.data);
}

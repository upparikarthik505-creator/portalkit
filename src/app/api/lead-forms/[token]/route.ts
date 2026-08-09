import { NextResponse } from "next/server";
import {
  getLeadFormPublic,
  submitLeadForm,
} from "@/lib/lead-forms-db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const form = await getLeadFormPublic(token);
    if (!form) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(form);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      message?: string;
      budget?: string;
      website?: string; // honeypot
    };
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }
    const result = await submitLeadForm(token, {
      name: body.name,
      email: body.email,
      message: body.message,
      budget: body.budget,
      honey: body.website,
    });
    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Submit failed" }, { status: 500 });
  }
}

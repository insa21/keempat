// app/api/skills/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const skills = await prisma.skill.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(skills);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSkill = await prisma.skill.create({
      data: {
        name: body.name,
        level: body.level,
      },
    });
    return Response.json(newSkill, { status: 201 });
  } catch (err) {
    return new Response('Invalid JSON or server error', { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await prisma.skill.update({
      where: { id: body.id },
      data: {
        name: body.name,
        level: body.level,
      },
    });
    return Response.json(updated);
  } catch (err) {
    return new Response('Invalid PUT request', { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    await prisma.skill.delete({
      where: { id: body.id },
    });
    return Response.json({ message: 'Skill deleted' });
  } catch (err) {
    return new Response('Failed to delete', { status: 500 });
  }
}

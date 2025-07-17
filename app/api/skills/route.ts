// app/api/skills/route.ts

export type Skill = {
  id: number;
  name: string;
  level: string; // contoh: Beginner, Intermediate, Expert
};

let skills: Skill[] = [
  { id: 1, name: 'JavaScript', level: 'Expert' },
  { id: 2, name: 'Python', level: 'Intermediate' },
];

export async function GET() {
  return Response.json(skills);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newSkill: Skill = {
    id: Date.now(),
    ...body,
  };
  skills.push(newSkill);
  return Response.json(newSkill, { status: 201 });
}

export async function PUT(request: Request) {
  const body: Skill = await request.json();
  const index = skills.findIndex((s) => s.id === body.id);
  if (index !== -1) {
    skills[index] = body;
    return Response.json(skills[index]);
  }
  return Response.json({ error: 'Skill not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { id }: { id: number } = await request.json();
  skills = skills.filter((s) => s.id !== id);
  return Response.json({ message: 'Deleted' });
}

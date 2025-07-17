'use client';

import { useEffect, useState } from 'react';

type Skill = {
  id: number;
  name: string;
  level: string;
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState({ name: '', level: '' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    const res = await fetch('/api/skills');
    const data = await res.json();
    setSkills(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form };

    if (editId) {
      await fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...payload }),
      });
    } else {
      await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    setForm({ name: '', level: '' });
    setEditId(null);
    fetchSkills();
  }

  async function handleDelete(id: number) {
    await fetch('/api/skills', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchSkills();
  }

  function handleEdit(skill: Skill) {
    setForm({ name: skill.name, level: skill.level });
    setEditId(skill.id);
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Skills Manager</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Skill Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Level (e.g., Beginner, Intermediate, Expert)"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          {editId ? 'Update Skill' : 'Add Skill'}
        </button>
      </form>

      <ul className="space-y-2">
        {skills.map((skill) => (
          <li
            key={skill.id}
            className="flex justify-between items-center border p-2"
          >
            <div>
              <p className="font-semibold">{skill.name}</p>
              <p className="text-sm text-gray-600">{skill.level}</p>
            </div>
            <div className="space-x-2">
              <button
                className="text-yellow-600"
                onClick={() => handleEdit(skill)}
              >
                Edit
              </button>
              <button
                className="text-red-600"
                onClick={() => handleDelete(skill.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

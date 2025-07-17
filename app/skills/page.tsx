'use client';

import { useEffect, useState } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

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

    const method = editId ? 'PUT' : 'POST';
    const payload = editId ? { id: editId, ...form } : form;

    await fetch('/api/skills', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setForm({ name: '', level: '' });
    setEditId(null);
    fetchSkills();
  }

  async function handleDelete(id: number) {
    if (!confirm('Yakin ingin menghapus skill ini?')) return;

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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-10 tracking-tight">
          💼 Skill Manager
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Skill Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. TypeScript"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Level</label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                required
              >
                <option value="">-- Select Level --</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            <PlusCircle size={18} />
            {editId ? 'Update Skill' : 'Add Skill'}
          </button>
        </form>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{skill.name}</h3>
                <p className="text-sm text-indigo-500">{skill.level}</p>
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleEdit(skill)}
                  className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-800 font-medium"
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

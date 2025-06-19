"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    explanation: "",
    subject: "",
    topic: "",
    year: new Date().getFullYear(),
    difficulty: "Medium",
    isFree: false,
  });
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [questionImageUrl, setQuestionImageUrl] = useState<string | null>(null);
  const [optionAImage, setOptionAImage] = useState<File | null>(null);
  const [optionAImageUrl, setOptionAImageUrl] = useState<string | null>(null);
  const [optionBImage, setOptionBImage] = useState<File | null>(null);
  const [optionBImageUrl, setOptionBImageUrl] = useState<string | null>(null);
  const [optionCImage, setOptionCImage] = useState<File | null>(null);
  const [optionCImageUrl, setOptionCImageUrl] = useState<string | null>(null);
  const [optionDImage, setOptionDImage] = useState<File | null>(null);
  const [optionDImageUrl, setOptionDImageUrl] = useState<string | null>(null);
  const [explanationImage, setExplanationImage] = useState<File | null>(null);
  const [explanationImageUrl, setExplanationImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestion() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/admin/questions?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch question");
        const data = await res.json();
        setForm({
          text: data.text,
          optionA: data.optionA,
          optionB: data.optionB,
          optionC: data.optionC,
          optionD: data.optionD,
          correctOption: data.correctOption,
          explanation: data.explanation,
          subject: data.subject,
          topic: data.topic,
          year: data.year,
          difficulty: data.difficulty,
          isFree: data.isFree,
        });
      } catch {
        setError("Could not load question.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchQuestion();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: any, setImageUrl: any) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    } else {
      setImageUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`/api/admin/questions?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update question");
      setSuccess(true);
      setTimeout(() => router.push("/admin/questions"), 1500);
    } catch {
      setError("Could not update question.");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Question</h1>
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Question updated! Redirecting...
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Question Text</label>
          <textarea
            name="text"
            rows={3}
            required
            value={form.text}
            onChange={handleChange}
            className="input w-full"
          />
          <div className="mt-2">
            <span className="text-xs text-gray-500">LaTeX Preview:</span>
            <div className="border rounded p-2 bg-gray-50 min-h-[2rem]">
              <BlockMath math={form.text} errorColor="#cc0000" />
            </div>
          </div>
          <div className="mt-2">
            <label className="block text-xs font-medium text-gray-500">Optional Image</label>
            <input type="file" accept="image/*" onChange={e => handleImageChange(e, setQuestionImage, setQuestionImageUrl)} />
            {questionImageUrl && (
              <img src={questionImageUrl} alt="Question" className="mt-2 max-h-32" />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Option A</label>
            <input name="optionA" type="text" required value={form.optionA} onChange={handleChange} className="input w-full" />
            <div className="mt-2">
              <span className="text-xs text-gray-500">LaTeX Preview:</span>
              <div className="border rounded p-2 bg-gray-50 min-h-[2rem]">
                <BlockMath math={form.optionA} errorColor="#cc0000" />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-500">Optional Image</label>
              <input type="file" accept="image/*" onChange={e => handleImageChange(e, setOptionAImage, setOptionAImageUrl)} />
              {optionAImageUrl && (
                <img src={optionAImageUrl} alt="Option A" className="mt-2 max-h-24" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Option B</label>
            <input name="optionB" type="text" required value={form.optionB} onChange={handleChange} className="input w-full" />
            <div className="mt-2">
              <span className="text-xs text-gray-500">LaTeX Preview:</span>
              <div className="border rounded p-2 bg-gray-50 min-h-[2rem]">
                <BlockMath math={form.optionB} errorColor="#cc0000" />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-500">Optional Image</label>
              <input type="file" accept="image/*" onChange={e => handleImageChange(e, setOptionBImage, setOptionBImageUrl)} />
              {optionBImageUrl && (
                <img src={optionBImageUrl} alt="Option B" className="mt-2 max-h-24" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Option C</label>
            <input name="optionC" type="text" required value={form.optionC} onChange={handleChange} className="input w-full" />
            <div className="mt-2">
              <span className="text-xs text-gray-500">LaTeX Preview:</span>
              <div className="border rounded p-2 bg-gray-50 min-h-[2rem]">
                <BlockMath math={form.optionC} errorColor="#cc0000" />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-500">Optional Image</label>
              <input type="file" accept="image/*" onChange={e => handleImageChange(e, setOptionCImage, setOptionCImageUrl)} />
              {optionCImageUrl && (
                <img src={optionCImageUrl} alt="Option C" className="mt-2 max-h-24" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Option D</label>
            <input name="optionD" type="text" required value={form.optionD} onChange={handleChange} className="input w-full" />
            <div className="mt-2">
              <span className="text-xs text-gray-500">LaTeX Preview:</span>
              <div className="border rounded p-2 bg-gray-50 min-h-[2rem]">
                <BlockMath math={form.optionD} errorColor="#cc0000" />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-500">Optional Image</label>
              <input type="file" accept="image/*" onChange={e => handleImageChange(e, setOptionDImage, setOptionDImageUrl)} />
              {optionDImageUrl && (
                <img src={optionDImageUrl} alt="Option D" className="mt-2 max-h-24" />
              )}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Correct Option</label>
          <select name="correctOption" value={form.correctOption} onChange={handleChange} className="input w-full">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Explanation</label>
          <textarea name="explanation" rows={2} required value={form.explanation} onChange={handleChange} className="input w-full" />
          <div className="mt-2">
            <span className="text-xs text-gray-500">LaTeX Preview:</span>
            <div className="border rounded p-2 bg-gray-50 min-h-[2rem]">
              <BlockMath math={form.explanation} errorColor="#cc0000" />
            </div>
          </div>
          <div className="mt-2">
            <label className="block text-xs font-medium text-gray-500">Optional Image</label>
            <input type="file" accept="image/*" onChange={e => handleImageChange(e, setExplanationImage, setExplanationImageUrl)} />
            {explanationImageUrl && (
              <img src={explanationImageUrl} alt="Explanation" className="mt-2 max-h-32" />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Year</label>
            <input name="year" type="number" min="2000" max={new Date().getFullYear()} required value={form.year} onChange={handleChange} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Difficulty</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange} className="input w-full">
              {DIFFICULTY_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input name="subject" type="text" required value={form.subject} onChange={handleChange} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Topic</label>
            <input name="topic" type="text" required value={form.topic} onChange={handleChange} className="input w-full" />
          </div>
        </div>
        <div className="flex items-center">
          <input name="isFree" type="checkbox" checked={form.isFree} onChange={handleChange} className="mr-2" />
          <label className="text-sm font-medium">Make this question free</label>
        </div>
        <div className="flex gap-4 mt-4">
          <button type="button" onClick={() => router.push("/admin/questions")} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Update Question</button>
        </div>
      </form>
    </div>
  );
} 
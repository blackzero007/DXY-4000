import { useState, useEffect } from 'react';

const VISITOR_ID_KEY = 'doodle_gallery_visitor_id';
const VISITOR_NAME_KEY = 'doodle_gallery_visitor_name';

const randomNames = [
  '小画家',
  '涂鸦达人',
  '创意无限',
  '梦想家',
  '童心未泯',
  '艺术爱好者',
  '快乐涂鸦',
  '彩虹画笔',
  '星空画师',
  '阳光小画家',
];

function generateVisitorId(): string {
  return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getRandomName(): string {
  return randomNames[Math.floor(Math.random() * randomNames.length)];
}

export function useVisitor() {
  const [visitorId, setVisitorId] = useState<string>('');
  const [visitorName, setVisitorName] = useState<string>('');

  useEffect(() => {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    let name = localStorage.getItem(VISITOR_NAME_KEY);

    if (!id) {
      id = generateVisitorId();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }

    if (!name) {
      name = getRandomName();
      localStorage.setItem(VISITOR_NAME_KEY, name);
    }

    setVisitorId(id);
    setVisitorName(name);
  }, []);

  const updateVisitorName = (newName: string) => {
    const trimmedName = newName.trim();
    if (trimmedName) {
      setVisitorName(trimmedName);
      localStorage.setItem(VISITOR_NAME_KEY, trimmedName);
    }
  };

  return {
    visitorId,
    visitorName,
    updateVisitorName,
  };
}

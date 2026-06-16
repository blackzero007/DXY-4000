import { db } from './index';

const sampleArtworks = [
  {
    title: '太阳公公',
    author: '小画家一号',
    likes: 42,
    views: 180,
  },
  {
    title: '可爱小猫咪',
    author: '涂鸦达人',
    likes: 28,
    views: 120,
  },
  {
    title: '彩虹桥',
    author: '创意无限',
    likes: 35,
    views: 210,
  },
  {
    title: '快乐小鸟',
    author: '梦想家',
    likes: 19,
    views: 95,
  },
  {
    title: '小星星',
    author: '童心未泯',
    likes: 56,
    views: 320,
  },
  {
    title: '小房子',
    author: '建筑大师',
    likes: 15,
    views: 75,
  },
];

function generateSampleImageData(color: string): string {
  const canvas = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#ffffff"/>
      <circle cx="200" cy="200" r="100" fill="${color}" opacity="0.8"/>
      <circle cx="170" cy="170" r="15" fill="#2D3436"/>
      <circle cx="230" cy="170" r="15" fill="#2D3436"/>
      <path d="M 150 230 Q 200 280 250 230" stroke="#2D3436" stroke-width="8" fill="none" stroke-linecap="round"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`;
}

const colors = ['#FFD93D', '#FF6B6B', '#4ECDC4', '#95E1D3', '#D6A2E8', '#F8B739'];

export function seedDatabase(): void {
  const existing = db.artworks.getAll();
  if (existing.length > 0) {
    return;
  }

  sampleArtworks.forEach((artwork, index) => {
    const newArtwork = db.artworks.create({
      title: artwork.title,
      author: artwork.author,
      imageData: generateSampleImageData(colors[index % colors.length]),
    });
    db.artworks.updateLikes(newArtwork.id, artwork.likes);
    db.artworks.updateViews(newArtwork.id, artwork.views);
  });

  const seededArtworks = db.artworks.getAll();
  
  seededArtworks.forEach((artwork) => {
    db.comments.create({
      artworkId: artwork.id,
      author: '游客A',
      content: '画得太棒了！好可爱~',
    });
    db.comments.create({
      artworkId: artwork.id,
      author: '艺术爱好者',
      content: '配色真好看，学习了！',
    });
  });

  console.log('Database seeded with sample data');
}
